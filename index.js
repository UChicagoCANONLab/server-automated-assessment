const express = require('express');
var cors = require('cors');
const app = express();
const Scratch = require('./scratchapi.js');

const multer = require('multer');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
const { execFile } = require('child_process');
const path = require('path');


const port = process.env.PORT || 3000;

app.use(cors());
console.log('Hello from index.js!');

app.get('/scratch/project/:id', function(req, res, next) {
		var id = req.params.id;
		console.log('Getting project ' + id);
	    Scratch.getProject(id,function(err,project) {
				console.log(project);
	      if(err) {
					console.log('Error:');
					console.log(err);
					//res.status(404).send("404 - cannot find. hi");
					res.send(err);
	      }
	      else {
					console.log(project);
					res.send(JSON.stringify(project));
	      }
    	});
 });

/// S3 additions
/////////////////////////////////////////////////////////////////////////////////////////
app.get('/scratch/studio/:id/:offset', function(req, res, next) {
	var id = req.params.id;
	var offset = req.params.offset;
		Scratch.getStudioS3(id, offset, function(err,studio) {
			if(err) {
				console.log(err);
				//res.status(404).send("404 - cannot find. hi ");
			}
			else {
				res.send(JSON.stringify(studio));
			}
		});
}); 
/*
app.get('/projects3/:id', function(req, res, next) {
	var id = req.params.id;
		Scratch.getProjectS3(id,function(err,project) {
			if(err) {
				res.status(404).send("404 - cannot find.")
			}
			else {
				res.send(JSON.stringify(project));
			}
		});
});*/
/////////////////////////////////////////////////////////////////////////////////////////

app.get('/pdf_gen/:id', function(req, res, next) {
	
	var id = req.params.id;
	var url = 'https://scratch.mit.edu/studios/' + id + '/';
	//res.send(url);
	
	var name = 'up' + Date.now() + '/'
  	mkdirp(name, function(err) {});
	const child = execFile('./run_unit2gen.sh', [url, name, 'template/'], (error, stdout, stderr) => {
	  if (error) {
	  	//res.send("Error - try a different url.");
	  	//rimraf(name, function () { console.log('done'); });
	    next(error);
	  }
	  else {
	  	console.log(stdout);
	  	res.sendFile(path.join(__dirname, name, 'all_tests.pdf'));
	  	rimraf(name, function () { console.log('done'); });
	  }
	  
 	});
 	
	

	
  
});

app.listen(port, function() {console.log(`Example app listening on port http://localhost:${port}/`)});
