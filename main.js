const yaml = require('js-yaml');
const fs = require('fs');
const c = require('calendar');
const cal = new c.Calendar();               // weeks start on Sunday by default
const tabletojson = require('tabletojson');
const request = require("request");
const async = require('async');
const moment = require('moment');

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// load data from config.json
var config = require('./config.json');

async.map(config.dataSets, function (ds, callback) {
        
    // handle yaml based data
    if (ds.type == "yaml")
    {
        try 
        {
            console.log("processing dataset - type: yaml, file: " + ds.file)
            // read yaml file into memory
            var doc = yaml.safeLoad(fs.readFileSync(ds.file, 'utf8'));
            // add empty data array to dataset
            ds.data = [];
            // add a data object to the dataset for each date
            for(var j in doc.dates)
            {
                ds.data.push({ date: new Date(config.year + " " + doc.dates[j]), name: j });
            }  
            // inherit some values from the yaml document
            ds.className = doc.className;            
            ds.icon = doc.icon;
            callback(null)
        } catch (e) {
            console.error(e);
        }
    }
    // process entries from timeanddate.com
    else if ( ds.type == "timeanddate.com")
    {
        try {
            console.log("processing dataset - type: url, url: " + ds.url)
            // find a table at the end url and process it 
            // (this has only had limited testing, mostly used to pull national holidays from timeanddate.com
            tabletojson.convertUrl(ds.url, function(tablesAsJson) {
                // get data from first table
                ds.data = tablesAsJson[0];  
                // for each data object in our data, add year to date, and set name to the column header
                for(var j in ds.data)
                {
                    ds.data[j].date = new Date(config.year + " " + ds.data[j][ds.dateheader])
                    ds.data[j].name = ds.data[j][ds.nameheader]                    
                }       
                callback(null)
            }, { useFirstRowForHeadings: true });
        }
        catch (e) {
            console.error(e);
        }
    }
    // process native dataset (see config.json for samples)
    else
    {
        console.log("processing dataset - type: " + ds.type);

        for(var j in ds.data)
        {            
            if(ds.data[j].type == "recurring")
            {
                ds.data[j].date = new Date(ds.data[j].date)
                var dn = moment(ds.data[j].date); //next date
                while ((dn.year() == config.year)) {
                    if (ds.data[j].until && dn.isAfter(ds.data[j].until))
                        break;
                    if (ds.data[j].every == "day") dn = dn.add(1, 'd');
                    if (ds.data[j].every == "week") dn = dn.add(1, 'w');
                    if (ds.data[j].every == "2 weeks") dn = dn.add(2, 'w');           
                    ds.data.push({ date: dn.toDate(), name: ds.data[j].name, icon: ds.data[j].icon, color: ds.data[j].color });
                }
            }
            else
            {
                ds.data[j].date = new Date(ds.data[j].date)
                if (ds.data[j].until)
                {
                    var dn = moment(ds.data[j].date); //next date
                    while (dn.isBefore(ds.data[j].until)) {
                        dn = dn.add(1, 'd');
                        ds.data.push({ date: dn.toDate(), name: ds.data[j].name, icon: ds.data[j].icon, color: ds.data[j].color });
                    }
                }
            }
        }
        callback(null)
    }

}, function(err, results) {
    // results now equals an array of the existing files
    
    buildHtml(config.year, function (err, html) {
        if (err) {
            console.error(err);
        }

        html =
    `<html>
        <head>
            <link rel="stylesheet" type="text/css" href="style.css">
            <link rel="stylesheet" type="text/css" href="https://opensource.keycdn.com/fontawesome/4.7.0/font-awesome.min.css">
        </head>
        <body> ` +
            html +
    `   </body>
    </html>`;

        fs.writeFile("./output.html", html, function (err) {
            if (err) {
                console.error(err);
            }
            console.log("saved output.html");
        });
    });
});

// remove leading zeros from dates
function dezero(date)
{
    var bits = date.split('-');
    for(var b in bits)
    {
        bits[b] = parseInt(bits[b], 10)
    }
    return bits.join("-");
}

// build HTML file for a given year
function buildHtml(year, callback)
{
    var o = "";
    for (month = 0; month < 12; month++)
    {
        var m = cal.monthDates(year, month,            // January is 0 in JS Date
           function (d) { return (' ' + d.getDate()).slice(-2) },
           function (w) { return w }
        );
        buildMonthHtml(month, m, function (err, html) {
            if (err) {
                return console.log(err);
            }
            o += html;
        })
    }
    return callback(null, o);
}

// build and return HTML for a given month
function buildMonthHtml(monthIndex, weeks, callback)
{
    try
    { // if ( monthIndex < 2) { // for testing 

        var o = "";

        // get month name
        o += "\r\n\t" + "<h2>" + monthNames[monthIndex] + "</h2>"

        // a string containing the classes that will be applied to this month
        var monthClasses = (weeks.length == 4 ? "stretch" : (weeks.length == 6 ? "squish" : ""));
        
        o += "\r\n\t" + "<ul class='month " + monthClasses + "' data-month='" + weeks + "'>";

        o += "\r\n\t\t" + "<li class='dayheader'>Sun</li>";
        o += "\r\n\t\t" + "<li class='dayheader'>Mon</li>";
        o += "\r\n\t\t" + "<li class='dayheader'>Tue</li>";
        o += "\r\n\t\t" + "<li class='dayheader'>Wed</li>";
        o += "\r\n\t\t" + "<li class='dayheader'>Thu</li>";
        o += "\r\n\t\t" + "<li class='dayheader'>Fri</li>";
        o += "\r\n\t\t" + "<li class='dayheader'>Sat</li>";
        
        var monthStarted = false;
        var monthEnded = false;

        for (var weekIndex in weeks)
        {
            var lastProcessedDay = 0 // lastday;
            var days = weeks[weekIndex];

            for (var dayIndex in days)
            {
                var day = parseInt(days[dayIndex],10);
                var classes = "";
                var styles = "";
                var text = "";

                if (monthStarted == false) {
                    if (day > 1) classes += " lastmonth";
                    if (day == 1) { monthStarted = true; lastProcessedDay = day; }
                } else {
                    if (lastProcessedDay > day) { classes += " nextmonth"; monthEnded = true; }
                    else lastProcessedDay = day;
                }
                
                for (var dataSet in config.dataSets)
                {
                    dataSet = config.dataSets[dataSet];
                    for( var event in dataSet.data )
                    {
                        event = dataSet.data[event];
                        //                     
                        var eventDate = event.date;
                        // mi crap: if we're showing last months or next months days (at start or end of month)
                        // then we should check the relevant events, so we can ghost them in 
                        var mi = monthIndex + 1;
                        if ( monthStarted == false) mi = mi == 1 ? 12 : mi - 1;
                        if ( monthEnded == true) mi = mi == 12 ? 1 : mi + 1;
                        var today = new Date(config.year + "-" + mi + "-" + day)
                                                
                        if (eventDate.toISOString() == today.toISOString()) {
                            classes += (event.color ? "" : " " + dataSet.className);
                            if (classes.trim().length == 0)
                                styles += (event.color ? "background:" + event.color + ";" : "");
                            text += "<event>" 
                                    + "<span class='fa " + (event.icon ? event.icon : dataSet.icon) + "'></span>" 
                                    + event.name 
                                  + "<event>";
                        }
                    }
                }

                o += "\r\n\t\t" + "<li" 
                    + (classes.trim().length > 0 ? " class='" + classes.trim() + "'" : "") 
                    + (styles.trim().length > 0 ? " style='" + styles.trim() + "'" : "")
                    + ">" 
                    + "<date>" + day + "</date>" 
                    + text 
                    + "</li>";
            }
        }
        o += "\r\n\t" + "</ul>";
        return callback(null, o);
    }
    catch (err) {
        console.log(err);
        return callback(err, null);
    }
    
}
