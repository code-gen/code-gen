var router = require('express').Router();
var path = require('path');
var fs = require('fs');
var childProcess = require('child_process');

// For creating new File and running the filecontent in sync and giving the response.
router.route('/newFile').post(function(req, res) {
  var filename = req.body.filename;
  var directory = req.body.directory;
  var filecontent = req.body.filecontent;
  var fullfilepath = path.resolve(directory,filename);
  console.log('fullfilepath ' + fullfilepath);
  fs.writeFile(fullfilepath, filecontent || "", function(err){
    if(err){
      console.log('Got error While writing the file to disk. Error - ' + err);
      res.send('Got error while writing the file to disk');
    }
    else{
      console.log('File created successfully.');
      executeFileSync(fullfilepath, res);
    } 
  });
});

function executeFileSync(filePath, res) {
  res.write('Start Response.\n');
  var spawnProcess = childProcess.spawn('node',[filePath]);
  spawnProcess.stdout.on('data', function(data) {
    console.log('on stdout data ' + data);
    res.write(data);
  });
  
  spawnProcess.stderr.on('data', function(data) {
    console.log('on stderr data ' + data);
    res.write(data);
  });
  
  spawnProcess.on('exit', function(code){
    console.log('on exit with code ' + code );
    res.end('End of Reponse.');
  });
  
}

// Route for executing file in async and returning the process id to check the response later.
router.route('/executeFile').get(function(req, res) {
  var currentTime = new Date().getTime();
  var filePath = req.query.filePath;
  res.json({'pid': currentTime});
  var execFile = new executeFile(filePath, currentTime);
  execFile.process();
});

function executeFile(filePath, currentTime) {
  this.filePath = path.resolve(filePath);
  this.currentTime = currentTime.toString();
  console.log(typeof this.currentTime);
  this.process = function() {
    var spawnProcess = childProcess.spawn('node', [this.filePath]);
    var currentTime = this.currentTime;
    spawnProcess.stdout.on('data', function(data){
      console.log('on stdout data '+ data);
      fs.appendFile(currentTime, data, function(err) {
        if(err) console.log('Error in appending file ' + err);
      });
	});
    
    spawnProcess.stderr.on('data', function(data){
      console.log('on stderr data ' + data);
      fs.appendFile(this.currentTime, data, function(err){
        if(err) console.log('Error in appending file ' + err);
      });
    });
    
    spawnProcess.on('exit', function(code) {
      console.log('Exit with code '+ code);
    });
  }
  
}

// Route for getting response data from the which was saved previously by running executeFile
router.route('/getResponse').get(function(req, res) {
  var pid = req.query.pid;
  fs.readFile(pid, function(err, data) {
    if(err){
      console.log('Error while reading the response from file ' + err);
      res.end('Error while reading the response from file.');
    }
    else{
      console.log('Response in file - \n' + data);
      res.json({'response': data.toString() , 'status': 'completed'});
    }
  });
});

module.exports = router;