#!/usr/bin/env node

/**
* Module dependencies.
*/

var cgCommander = require('commander');
var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var cgservices = require('../routes/cgservices');

// CLI Commands
cgCommander
  .command('server')
  .description('Starts the server and give the URL for Web Interface.')
  .action(function() {
    // Start the Web server to serve static file content
	console.log('Server started please browse the Web Interface on http://localhost:3030/cgserver');
    console.log('Press CTRL + C to stop the server.');
    // Using express for serving static content and running web server
    app.use('/cgserver',express.static(__dirname + '/../client'));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    // Adding routes
    app.use('/cgservices', cgservices);
    app.listen(process.env.PORT || 3030);
  });

//Displaying default help when no options/commands provided. 
if(!process.argv.slice(2).length) {
  cgCommander.outputHelp(function(txt){return txt;});
}

// Passing command line arguments to commander to parse
cgCommander.parse(process.argv);