// config.js
const config = {
badges: {
    enabled: true,
    credly: {
      enabled: true,
    },
    spectrum: ['46a2f1', '311C87', 'DD0031'],
    list: [
      {
        name: 'Microsoft Edge',
        logo: 'Microsoft-edge',
      },
      {
        name: 'Google Chrome',
        logo: 'GoogleChrome',
      },
      {
        name: 'Github Actions',
        logo: 'githubactions',
      },
      {
        name: 'Firebase',
      },
      {
        name: 'MariaDB',
      },
      {
        name: 'MongoDB',
      },
      {
        name: 'MySql',
      },
      {
        name: 'Sqlite',
      },
      {
        name: 'Microsoft Sql Server',
      },
      {
        name: 'Postgres',
        logo: 'postgresql',
      },
      {
        name: '.NET',
      },
      {
        name: 'Bootstrap',
      },
      {
        name: 'Chart.js',
      },
      {
        name: 'CodeIgniter',
      },
      {
        name: 'Jquery',
      },
      {
        name: 'npm',
      },
      {
        name: 'Xamarin',
      },
      {
        name: 'AWS',
      },
      {
        name: 'Azure',
        logo: 'microsoftazure',
      },

      {
        name: 'Android Studio',
        logo: 'android-studio',
      },
      {
        name: 'Atom',
      },
      {
        name: 'Jupyter',
      },
      {
        name: 'Netbeans',
        logo: 'apache-netbeans-ide',
      },
      {
        name: 'Notepad++',
        logo: 'notepad%2b%2b',
      },
      {
        name: 'Visual Studio Code',
        logo: 'visual-studio-code',
      },
      {
        name: 'Visual Studio',
        logo: 'visual-studio',
      },
      {
        name: 'C%23',
        logo: 'c-sharp',
      },
      {
        name: 'CSS3',
      },
      {
        name: 'HTML5',
      },
      {
        name: 'Javascript',
      },
      {
        name: 'Markdown',
      },
      {
        name: 'PHP',
      },
      {
        name: 'PowerShell',
      },
      {
        name: 'Bash Shell',
        logo: 'gnu-bash',
      },
      {
        name: 'Windows Terminal',
        logo: 'windows-terminal',
      },
      {
        name: 'Microsoft Office',
        logo: 'microsoft-office',
      },
      {
        name: 'Linux',
      },
      {
        name: 'Windows',
      },
      {
        name: 'Arduino',
      },
      {
        name: 'Docker',
      },
      {
        name: 'Pi Hole',
        logo: 'pi-hole',
      },
      {
        name: 'Postman',
      },
      {
        name: 'Raspberry Pi',
        logo: 'raspberry-pi',
      },
      {
        name: 'Swagger',
      },
      {
        name: 'Trello',
      },
      {
        name: 'Google',
      },
      {
        name: 'Apache',
      },
      {
        name: 'Nginx',
      },
      {
        name: 'Git',
      },
      {
        name: 'Github',
      },
    ],
  },
social: [
    {
      name: 'Medium',
      color: '12100E',
      url: 'https://medium.com/@arjenbrandenburgh',
    },
    {
      name: 'Github',
      username: 'saltyseaslug',
      color: '12100E',
      url: 'https://github.com/saltyseaslug',
    },
    {
      name: 'Twitter',
      color: '1DA1F2',
      url: 'https://twitter.com/ArjenBrand',
    },
    {
      name: 'LinkedIn',
      color: '0077B5',
      url: 'https://www.linkedin.com/in/arjen-brandenburgh',
    },
    {
      name: 'Website',
      color: '4285F4',
      logo: 'google-chrome',
      url: 'https://www.arjenbrandenburgh.nl',
    },
    // {
    //   name: 'Instagram',
    //   color: 'E4405F',
    //   url: 'https://www.instagram.com/username',
    // },
    // {
    //   name: 'Facebook',
    //   color: '1877F2',
    //   url: 'https://www.facebook.com/username',
    // },
],
 github: {
    enabled: true,
    username: 'saltyseaslug',
    colors: {
      title: '24292e',
      text: '24292e',
      icon: '24292e',
      background: 'ffffff',
    },
    stats: {
      mostUsedLanguages: true,
      overallStats: true,
    },
    highlightedRepos: ['saltyseaslug'],
  },
template: {
	showHeaderImage: true,
  showFooter: true,
	aboutMe: {
    enabled: true,
    welcome: "Welcome, to my profile",
    name: "Mark",
    declaration: "self-taught self-proclaimed full-stack developer",
    position: "Senior Analyst Programmer",
    location: "Cape Town, South Africa"
  }
},
};

module.exports = config;
