var router = require('express').Router();
var path = require('path');
var fs = require('fs');
var childProcess = require('child_process');
router.route('/newFile').post(function(req, res) {
  var filename = req.body.filename;
  var directory = req.body.directory;
  var filecontent = req.body.filecontent;
  var fullfilepath = path.resolve(directory,filename);
  console.log('fullfilepath ' + fullfilepath);
  fs.writeFile(fullfilepath, filecontent, function(err){
    if(err){
      console.log('Got error While writing the file to disk. Error - ' + err);
      res.send('Got error while writing the file to disk');
    }
    else{
      console.log('File created successfully.');
      res.write('Start Response.\n');
      var spawnProcess = childProcess.spawn('node',[fullfilepath]);
      spawnProcess.stdout.on('data', function(data) {
        console.log('on stdout data ' + data);
        res.write(data);
      });
      
      spawnProcess.stderr.on('data', function(data) {
        console.log('on stderr data ' + data);
      });

      spawnProcess.on('exit', function(code){
        console.log('on exit with code ' + code );
        res.end('End of Reponse.');
      });
      
    } 
  });
});
module.exports = router;