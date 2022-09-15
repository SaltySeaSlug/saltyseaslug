## Welcome

``` csharp
Console.WriteLine("{{welcome}}");

string name = "{{name}}";
string declaration = "{{declaration}}";
const string position = "{{position}}";
const string location = "{{location}}";

Console.WriteLine("I'm {0} a {1}.", name, declaration);
Console.WriteLine($"{position}, currently based in {location}.");
```