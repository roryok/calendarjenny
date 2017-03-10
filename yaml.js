yaml = require('js-yaml');
fs   = require('fs');
 
// Get document, or throw exception on error 
try {
  var doc = yaml.safeLoad(fs.readFileSync('./data/friend birthdays.yaml', 'utf8'));  
  for(var n in doc.dates)
  {
	console.log(n, (doc.year == null ? new Date().getFullYear() + "-" : "") + doc.dates[n]);
  }
} catch (e) {
  console.log(e);
}