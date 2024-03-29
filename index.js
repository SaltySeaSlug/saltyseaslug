const config = require('./config.js');
const hljs = require('highlight.js');
const md = require("markdown-it")({
  html: true, // Enable HTML tags in source
  breaks: true, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(str, { language: lang }).value;
      } catch (__) {}
    }

    return ''; // use external default escaping
  }
});
const emoji = require("markdown-it-emoji");
const fs = require("fs");
const Parser = require("rss-parser");
const parser = new Parser();
md.use(emoji);



let input = '';


async function getSocialData() {
  const social = config.social.map(item => ({
    ...item,
    logo: item.logo || item.name,
  }));
  return Promise.resolve({ social });
}

async function generateLearningBadges() {
  const colors = new Rainbow();
  colors.setNumberRange(1, config.learning.list.length);
  colors.setSpectrum(...config.learning.spectrum);

  const formattedBadges = config.learning.list.map((badge, index) => ({
    name: badge.name,
    logo: badge.logo || badge.name.toLocaleLowerCase(),
    color: colors.colourAt(index),
  }));

  return Promise.resolve({ learningBadges: formattedBadges });
}

async function generateBadges() {
	const colors = new Rainbow();
	colors.setNumberRange(1, config.badges.list.length);
	colors.setSpectrum(...config.badges.spectrum);
  
	const formattedBadges = config.badges.list.map((badge, index) => ({
	  name: badge.name,
	  logo: badge.logo || badge.name.toLocaleLowerCase(),
	  color: colors.colourAt(index),
	}));
  
	return Promise.resolve({ badges: formattedBadges });
  }

async function getRefreshDate() {
  const refreshDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short',
    timeZone: 'Europe/Stockholm',
  });

  return Promise.resolve({ refreshDate });
}

async function getGithubData() {
  const data = config.github;
  const enabled =
    data.stats.mostUsedLanguages ||
    data.stats.overallStats ||
    data.highlightedRepos.length > 0;

  const github = {
    ...data,
    enabled,
  };

  return Promise.resolve({ github });
}

async function generateReadMe(input, sections) {
	
	//const result = md.render(input);
	sections = sections.filter(function(e){return e;});
	//fs.writeFile("README.md", sections.join('\n') + '\n' + result, function (err) {
	fs.writeFile("README.md", sections.join('\n\n'), function (err) {
		if (err) return console.log(err);
		console.log(`${sections} > README.md`);
  	});

	console.log(`✅ README.md has been succesfully built!`);
}

/**
 * It takes the input file, and replaces the sections with the data from the promises
 */
async function perform() {
	let promises = [];
	let sections = [];
  // Medium articles
  //if (CONFIG.mediumArticles && CONFIG.mediumArticles.enabled) {
  //  promises.push(getMediumArticles());
  //}

  // Badges
  if (config.badges && config.badges.enabled) {
		promises.push(generateBadges());
  }

  if (config.learning && config.learning.enabled) {
	promises.push(generateLearningBadges());
}

  // Refresh date
  promises.push(getRefreshDate());

  // Github data
  promises.push(getGithubData());

  // Social data
  promises.push(getSocialData());

  // Get Instagram images
  //if (CONFIG.instagram && CONFIG.instagram.enabled) {
  //  promises.push(getInstagramPosts());
  //}

  const data = await Promise.all(promises).then(data =>
    data.reduce((acc, val) => ({ ...acc, ...val }))
  );
  
	let aboutPage = fs.readFileSync('./templates/about-me.md');
	let githubStatsPage = fs.readFileSync('./templates/github-stats.md');
	let footerPage = fs.readFileSync('./templates/footer.md');
	let aboutSection = '';
	let skillsSection = '';
	let certificatesSection = '';
	let githubStatsSection = '';
	let footerSection = '';
	let socialSection = '';
	let busyWithSection = '';

	if (config.template && config.template.showHeaderImage)
	{
		aboutSection += `<div id="header" align="center"><img src="./banner.gif" width="100%" height="110em"/></div>\n\n`;
	}

	if (config.template.aboutMe.enabled)
	{
		aboutSection += aboutPage.toString()
				.replace("{{welcome}}", config.template.aboutMe.welcome)
				.replace("{{name}}", config.template.aboutMe.name)
				.replace("{{declaration}}", config.template.aboutMe.declaration)
				.replace("{{position}}", config.template.aboutMe.position)
				.replace("{{location}}", config.template.aboutMe.location);
	}

	if (data.badges && data.badges.length > 0 && config.badges.enabled)
	{
		skillsSection += "## Tools and Technologies\n";
		skillsSection += buildBadges(data.badges) + "\n";
	}

	if (data.learningBadges && data.learningBadges.length > 0 && config.learning.enabled)
	{
		busyWithSection += "## Studing, Learning and Improving\n";
		busyWithSection += buildBadges(data.learningBadges) + "\n";
	}

	if (config.badges.credly.enabled)
	{
		certificatesSection += "## Certificates\n";
		certificatesSection += "<!--START_SECTION:badges--> <!--END_SECTION:badges-->\n";
	}

	if (config.github.enabled)
	{
		githubStatsSection += "## Stats\n";
		let statsClean = "";

		if (config.github.stats.overallStats && config.github.stats.mostUsedLanguages)
		{
		 	statsClean = githubStatsPage.toString()
				.replace(/{{username}}/gi, config.github.username.toLocaleLowerCase());
		}

		if (config.github.stats.overallStats == false)
		{
			statsClean = statsClean.replace(statsClean.substring(statsClean.indexOf("<!--STAT-START-->")+"<!--STAT-START-->".length, statsClean.lastIndexOf("<!--STAT-END-->")), '');
		}

		if (config.github.stats.mostUsedLanguages == false)
		{
			statsClean = statsClean.replace(statsClean.substring(statsClean.indexOf("<!--TOP-START-->")+"<!--TOP-START-->".length, statsClean.lastIndexOf("<!--TOP-END-->")), '');
		}

		if (data.github.highlightedRepos && data.github.highlightedRepos.length > 0)
		{
			for (var repo in data.github.highlightedRepos)
			{
				statsClean += `<a href="https://github.com/${config.github.username}/${data.github.highlightedRepos[repo].toLocaleLowerCase()}"><img src="https://github-readme-stats-gilt-sigma.vercel.app/api/pin/?username=${config.github.username}&repo=${data.github.highlightedRepos[repo].toLocaleLowerCase()}&title_color=${config.github.colors.title}&text_color=${config.github.colors.text}&icon_color=${config.github.colors.icon}&bg_color=${config.github.colors.background}" /></a>`;
			}
		}

		githubStatsSection += statsClean;
	}

	if (config.template.showFooter)
	{
		footerSection += footerPage.toString()
		.replace("{{refreshDate}}", data.refreshDate)
		.replace(/{{username}}/gi, config.github.username.toLocaleLowerCase());
	}

	if (config.social && data.social.length)
	{
		socialSection += "<p align='center'>";
		for (var i in data.social)
		{
			socialSection += `<a href="${data.social[i].url}"><img src="https://img.shields.io/badge/${data.social[i].name}-%23${data.social[i].color}.svg?&style=for-the-badge&logo=${data.social[i].logo}&logoColor=white" /></a>`;
		}
		socialSection += "</p><br>";
	}
	
	sections = [ aboutSection, socialSection, skillsSection, busyWithSection, certificatesSection, githubStatsSection, footerSection ];

  	generateReadMe(input, sections);
}

function buildBadges(data)
{
	let result = '';
	for (var i in data)
	{		
		result += `<img alt="${data[i].name}" src="https://img.shields.io/badge/${data[i].name}-${data[i].color}?style=square&logo=${data[i].logo}&logoColor=white" /> `;
	}

	return result + "\n\n";
}

perform();





















function Rainbow()
{
	"use strict";
	var gradients = null;
	var minNum = 0;
	var maxNum = 100;
	var colours = ['ff0000', 'ffff00', '00ff00', '0000ff']; 
	setColours(colours);
	
	function setColours (spectrum) 
	{
		if (spectrum.length < 2) {
			throw new Error('Rainbow must have two or more colours.');
		} else {
			var increment = (maxNum - minNum)/(spectrum.length - 1);
			var firstGradient = new ColourGradient();
			firstGradient.setGradient(spectrum[0], spectrum[1]);
			firstGradient.setNumberRange(minNum, minNum + increment);
			gradients = [ firstGradient ];
			
			for (var i = 1; i < spectrum.length - 1; i++) {
				var colourGradient = new ColourGradient();
				colourGradient.setGradient(spectrum[i], spectrum[i + 1]);
				colourGradient.setNumberRange(minNum + increment * i, minNum + increment * (i + 1)); 
				gradients[i] = colourGradient; 
			}

			colours = spectrum;
		}
	}

	this.setSpectrum = function () 
	{
		setColours(arguments);
		return this;
	}

	this.setSpectrumByArray = function (array)
	{
		setColours(array);
		return this;
	}

	this.colourAt = function (number)
	{
		if (isNaN(number)) {
			throw new TypeError(number + ' is not a number');
		} else if (gradients.length === 1) {
			return gradients[0].colourAt(number);
		} else {
			var segment = (maxNum - minNum)/(gradients.length);
			var index = Math.min(Math.floor((Math.max(number, minNum) - minNum)/segment), gradients.length - 1);
			return gradients[index].colourAt(number);
		}
	}

	this.colorAt = this.colourAt;

	this.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			minNum = minNumber;
			maxNum = maxNumber;
			setColours(colours);
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
		return this;
	}
}

function ColourGradient() 
{
	"use strict";
	var startColour = 'ff0000';
	var endColour = '0000ff';
	var minNum = 0;
	var maxNum = 100;

	this.setGradient = function (colourStart, colourEnd)
	{
		startColour = getHexColour(colourStart);
		endColour = getHexColour(colourEnd);
	}

	this.setNumberRange = function (minNumber, maxNumber)
	{
		if (maxNumber > minNumber) {
			minNum = minNumber;
			maxNum = maxNumber;
		} else {
			throw new RangeError('maxNumber (' + maxNumber + ') is not greater than minNumber (' + minNumber + ')');
		}
	}

	this.colourAt = function (number)
	{
		return calcHex(number, startColour.substring(0,2), endColour.substring(0,2)) 
			+ calcHex(number, startColour.substring(2,4), endColour.substring(2,4)) 
			+ calcHex(number, startColour.substring(4,6), endColour.substring(4,6));
	}
	
	function calcHex(number, channelStart_Base16, channelEnd_Base16)
	{
		var num = number;
		if (num < minNum) {
			num = minNum;
		}
		if (num > maxNum) {
			num = maxNum;
		} 
		var numRange = maxNum - minNum;
		var cStart_Base10 = parseInt(channelStart_Base16, 16);
		var cEnd_Base10 = parseInt(channelEnd_Base16, 16); 
		var cPerUnit = (cEnd_Base10 - cStart_Base10)/numRange;
		var c_Base10 = Math.round(cPerUnit * (num - minNum) + cStart_Base10);
		return formatHex(c_Base10.toString(16));
	}

	function formatHex(hex) 
	{
		if (hex.length === 1) {
			return '0' + hex;
		} else {
			return hex;
		}
	} 
	
	function isHexColour(string)
	{
		var regex = /^#?[0-9a-fA-F]{6}$/i;
		return regex.test(string);
	}

	function getHexColour(string)
	{
		if (isHexColour(string)) {
			return string.substring(string.length - 6, string.length);
		} else {
			var name = string.toLowerCase();
			if (colourNames.hasOwnProperty(name)) {
				return colourNames[name];
			}
			throw new Error(string + ' is not a valid colour.');
		}
	}
	
	// Extended list of CSS colornames s taken from
	// http://www.w3.org/TR/css3-color/#svg-color
	var colourNames = {
		aliceblue: "F0F8FF",
		antiquewhite: "FAEBD7",
		aqua: "00FFFF",
		aquamarine: "7FFFD4",
		azure: "F0FFFF",
		beige: "F5F5DC",
		bisque: "FFE4C4",
		black: "000000",
		blanchedalmond: "FFEBCD",
		blue: "0000FF",
		blueviolet: "8A2BE2",
		brown: "A52A2A",
		burlywood: "DEB887",
		cadetblue: "5F9EA0",
		chartreuse: "7FFF00",
		chocolate: "D2691E",
		coral: "FF7F50",
		cornflowerblue: "6495ED",
		cornsilk: "FFF8DC",
		crimson: "DC143C",
		cyan: "00FFFF",
		darkblue: "00008B",
		darkcyan: "008B8B",
		darkgoldenrod: "B8860B",
		darkgray: "A9A9A9",
		darkgreen: "006400",
		darkgrey: "A9A9A9",
		darkkhaki: "BDB76B",
		darkmagenta: "8B008B",
		darkolivegreen: "556B2F",
		darkorange: "FF8C00",
		darkorchid: "9932CC",
		darkred: "8B0000",
		darksalmon: "E9967A",
		darkseagreen: "8FBC8F",
		darkslateblue: "483D8B",
		darkslategray: "2F4F4F",
		darkslategrey: "2F4F4F",
		darkturquoise: "00CED1",
		darkviolet: "9400D3",
		deeppink: "FF1493",
		deepskyblue: "00BFFF",
		dimgray: "696969",
		dimgrey: "696969",
		dodgerblue: "1E90FF",
		firebrick: "B22222",
		floralwhite: "FFFAF0",
		forestgreen: "228B22",
		fuchsia: "FF00FF",
		gainsboro: "DCDCDC",
		ghostwhite: "F8F8FF",
		gold: "FFD700",
		goldenrod: "DAA520",
		gray: "808080",
		green: "008000",
		greenyellow: "ADFF2F",
		grey: "808080",
		honeydew: "F0FFF0",
		hotpink: "FF69B4",
		indianred: "CD5C5C",
		indigo: "4B0082",
		ivory: "FFFFF0",
		khaki: "F0E68C",
		lavender: "E6E6FA",
		lavenderblush: "FFF0F5",
		lawngreen: "7CFC00",
		lemonchiffon: "FFFACD",
		lightblue: "ADD8E6",
		lightcoral: "F08080",
		lightcyan: "E0FFFF",
		lightgoldenrodyellow: "FAFAD2",
		lightgray: "D3D3D3",
		lightgreen: "90EE90",
		lightgrey: "D3D3D3",
		lightpink: "FFB6C1",
		lightsalmon: "FFA07A",
		lightseagreen: "20B2AA",
		lightskyblue: "87CEFA",
		lightslategray: "778899",
		lightslategrey: "778899",
		lightsteelblue: "B0C4DE",
		lightyellow: "FFFFE0",
		lime: "00FF00",
		limegreen: "32CD32",
		linen: "FAF0E6",
		magenta: "FF00FF",
		maroon: "800000",
		mediumaquamarine: "66CDAA",
		mediumblue: "0000CD",
		mediumorchid: "BA55D3",
		mediumpurple: "9370DB",
		mediumseagreen: "3CB371",
		mediumslateblue: "7B68EE",
		mediumspringgreen: "00FA9A",
		mediumturquoise: "48D1CC",
		mediumvioletred: "C71585",
		midnightblue: "191970",
		mintcream: "F5FFFA",
		mistyrose: "FFE4E1",
		moccasin: "FFE4B5",
		navajowhite: "FFDEAD",
		navy: "000080",
		oldlace: "FDF5E6",
		olive: "808000",
		olivedrab: "6B8E23",
		orange: "FFA500",
		orangered: "FF4500",
		orchid: "DA70D6",
		palegoldenrod: "EEE8AA",
		palegreen: "98FB98",
		paleturquoise: "AFEEEE",
		palevioletred: "DB7093",
		papayawhip: "FFEFD5",
		peachpuff: "FFDAB9",
		peru: "CD853F",
		pink: "FFC0CB",
		plum: "DDA0DD",
		powderblue: "B0E0E6",
		purple: "800080",
		red: "FF0000",
		rosybrown: "BC8F8F",
		royalblue: "4169E1",
		saddlebrown: "8B4513",
		salmon: "FA8072",
		sandybrown: "F4A460",
		seagreen: "2E8B57",
		seashell: "FFF5EE",
		sienna: "A0522D",
		silver: "C0C0C0",
		skyblue: "87CEEB",
		slateblue: "6A5ACD",
		slategray: "708090",
		slategrey: "708090",
		snow: "FFFAFA",
		springgreen: "00FF7F",
		steelblue: "4682B4",
		tan: "D2B48C",
		teal: "008080",
		thistle: "D8BFD8",
		tomato: "FF6347",
		turquoise: "40E0D0",
		violet: "EE82EE",
		wheat: "F5DEB3",
		white: "FFFFFF",
		whitesmoke: "F5F5F5",
		yellow: "FFFF00",
		yellowgreen: "9ACD32"
	}
}

if (typeof module !== 'undefined') {
  module.exports = Rainbow;
}
