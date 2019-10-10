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

/// Scratch 3 changes made here
/////////////////////////////////////////////////////////////////////////////////////////

app.get('/scratch/project/:id', function(req, res, next) {
		var id = req.params.id;
		console.log('Getting project ' + id);
	    	Scratch.getProject(id, function(err, project) {
						if (err) {
								console.log('Error\n' + err);
								res.status(404).send("404 - resource not found.");
						}
						else {
								res.send(JSON.stringify(project));
						}
				});
 });

 app.get('/scratch/projectpage/:id', function(req, res, next) {
	var id = req.params.id;
	console.log('Getting project page ' + id);
		Scratch.getProjectPage(id, function(err, projectPage) {
					if (err) {
							console.log('Error\n' + err);
							res.status(404).send("404 - resource not found.");
					}
					else {
							res.send(JSON.stringify(projectPage));
					}
			});
});

app.get('/scratch/studio/:id/offset/:offset', function(req, res, next) {
		var id = req.params.id;
		var offset = req.params.offset;
		console.log('Getting studio ' + id + ' (starting at project idx. ' + offset + ')');
				Scratch.getStudio(id, offset, function(err, studio) {
					if (err) {
							console.log('Error\n' + err);
							res.status(404).send("404 - resource not found.");
					}
					else {
							res.send(JSON.stringify(studio));
					}
			});
});

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
