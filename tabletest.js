// const HtmlTableToJson = require('table-to-json');

const request = require('request');

var url = 'https://www.timeanddate.com/holidays/ireland/2017';

// Fetch a URL and parse all it's tables into JSON, using a callback
var tabletojson = require('tabletojson');

console.log("poop")

tabletojson.convertUrl(url, function(tablesAsJson) {
    var data = tablesAsJson[0];     
    for(var j in data)
    {
        data[j].Date = new Date('2017 ' + data[j].Date);
        console.log(data[j])
    }       
    
}, { useFirstRowForHeadings: true });
 
// request a page 
// request.get(url, function(err, res, body){
 
//   // handle error and non-200 response here 
//   if(err || (res.statusCode != 200)){
//     return console.log("An error occured.");
//   }
 
//     const jsonTables = new HtmlTableToJson(body);

//     const data = jsonTables.results[0]

//     // for(var d in data)
//     // {
//     //     data[d].date = new Date(d + '2017').toISOString();
//     // } 

//     console.log(data);

//     // console.log(jsonTables.count);
 
// });

// var https = require('https');

// function getHtml(callback) {
    // return https.get({
    //     host: 'www.timeanddate.com',
    //     path: '/holidays/ireland/2017'
    // }, function(response) {
    //     // Continuously update stream with data
    //     var body = '';
    //     response.on('data', function(d) {
    //         body += d;
    //     });
    //     response.on('end', function() {
    //         // console.log(body);
    //         // Data reception is done, do whatever with it!
    //         // var parsed = JSON.parse(body);
    //         // callback({
    //         //     email: parsed.email,
    //         //     password: parsed.pass
    //         // });
    //         const jsonTables = new HtmlTableToJson(body);
    //         console.log(jsonTables.results[0]);
    //         // console.log(jsonTables.count);
    //     });
    // });
// }

var table = `<table class="zebra fw tb-cl tb-hover"><thead><tr class="head"><th rowspan="2">Date</th><th class="sep" rowspan="2">Weekday</th><th class="sep" rowspan="2">Holiday Name</th><th class="sep" rowspan="2">Holiday Type</th></tr><tr class="head"></tr></thead><tbody><tr id="tr0" class="c0"><th class="nw">Jan 1</th><td class="nw">Sunday</td><td><a href="/holidays/ireland/new-year-day">New Year's Day</a></td><td>National holiday</td></tr><tr id="tr1" class="c1"><th class="nw">Jan 2</th><td class="nw">Monday</td><td><a href="/holidays/ireland/new-year-day">New Year's Day observed</a></td><td>Observance</td></tr><tr id="tr2" class="c0"><th class="nw">Mar 17</th><td class="nw">Friday</td><td><a href="/holidays/ireland/st-patrick-day">St. Patrick's Day</a></td><td>National holiday</td></tr><tr id="tr3" class="c1"><th class="nw">Mar 20</th><td class="nw">Monday</td><td><a href="/calendar/march-equinox.html">March equinox</a></td><td>Season</td></tr><tr id="tr4" class="c0"><th class="nw">Apr 14</th><td class="nw">Friday</td><td><a href="/holidays/ireland/good-friday">Good Friday</a></td><td>Observance</td></tr><tr id="tr5" class="c1"><th class="nw">Apr 16</th><td class="nw">Sunday</td><td><a href="/holidays/ireland/easter">Easter</a></td><td>Observance</td></tr><tr id="tr6" class="c0"><th class="nw">Apr 17</th><td class="nw">Monday</td><td><a href="/holidays/ireland/easter-monday">Easter Monday</a></td><td>National holiday</td></tr><tr id="tr7" class="c1"><th class="nw">May 1</th><td class="nw">Monday</td><td><a href="/holidays/ireland/may-day">May Day</a></td><td>National holiday</td></tr><tr id="tr8" class="c0"><th class="nw">Jun 5</th><td class="nw">Monday</td><td><a href="/holidays/ireland/june-bank-holiday">June Bank Holiday</a></td><td>National holiday</td></tr><tr id="tr9" class="c1"><th class="nw">Jun 21</th><td class="nw">Wednesday</td><td><a href="/calendar/june-solstice.html">June Solstice</a></td><td>Season</td></tr><tr id="tr10" class="c0"><th class="nw">Aug 7</th><td class="nw">Monday</td><td><a href="/holidays/ireland/august-bank-holiday">August Bank Holiday</a></td><td>National holiday</td></tr><tr id="tr11" class="c1"><th class="nw">Sep 22</th><td class="nw">Friday</td><td><a href="/calendar/september-equinox.html">September equinox</a></td><td>Season</td></tr><tr id="tr12" class="c0"><th class="nw">Oct 30</th><td class="nw">Monday</td><td><a href="/holidays/ireland/october-bank-holiday">October Bank Holiday</a></td><td>National holiday</td></tr><tr id="tr13" class="c1"><th class="nw">Dec 21</th><td class="nw">Thursday</td><td><a href="/calendar/december-solstice.html">December Solstice</a></td><td>Season</td></tr><tr id="tr14" class="c0"><th class="nw">Dec 24</th><td class="nw">Sunday</td><td><a href="/holidays/ireland/christmas-eve">Christmas Eve</a></td><td>Observance</td></tr><tr id="tr15" class="c1"><th class="nw">Dec 25</th><td class="nw">Monday</td><td><a href="/holidays/ireland/christmas-day">Christmas Day</a></td><td>National holiday</td></tr><tr id="tr16" class="c0"><th class="nw">Dec 26</th><td class="nw">Tuesday</td><td><a href="/holidays/ireland/st-stephen-day">St. Stephen's Day</a></td><td>National holiday</td></tr><tr id="tr17" class="c1"><th class="nw">Dec 31</th><td class="nw">Sunday</td><td><a href="/holidays/ireland/new-year-eve">New Year's Eve</a></td><td>Observance</td></tr></tbody></table>`;


 
