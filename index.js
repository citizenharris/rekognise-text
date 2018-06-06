const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'}); // Rekognition doesn't work in London

exports.handler = (event, context, callback) => {

	const done = (err, res) => callback(null, {
	    statusCode: err ? '400' : '200',
	    body: JSON.stringify(res),
	    headers: {
	        'Content-Type': 'application/json',
	    }
	});

	var req = JSON.parse(event.body);

	const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});
		var params = {
		  Image: { 
		    S3Object: {
		      Bucket: req.bucket,
		      Name: req.key,
		    }
		  }
		};

	rekognition.detectText(params, function(err, data) {

	  if (err) console.log(err, err.stack), done(true, {success: false, error: err.stack});
	  else {

	  	// console.log(data);
	  	let arrayLength = data.TextDetections.length;
	  	let regex = /^(([A-Za-z]{1,2}[ ]?[0-9]{1,4})|([A-Za-z]{3}[ ]?[0-9]{1,3})|([0-9]{1,3}[ ]?[A-Za-z]{3})|([0-9]{1,4}[ ]?[A-Za-z]{1,2})|([A-Za-z]{3}[ ]?[0-9]{1,3}[ ]?[A-Za-z])|([A-Za-z][ ]?[0-9]{1,3}[ ]?[A-Za-z]{3})|([A-Za-z]{2}[ ]?[0-9]{2}[ ]?[A-Za-z]{3})|([A-Za-z]{3}[ ]?[0-9]{4}))$/; // Doesn't handle foreign plates
	  	let minConfidence = Number(req.minConfidence) || 90.0;
	  	let textDetections = [];

		for (let i = 0; i < arrayLength; i++) {
			if (data.TextDetections[i].Confidence > minConfidence && data.TextDetections[i].DetectedText.match(regex)) {
				console.log(`${data.TextDetections[i].DetectedText} - (Confidence: ${data.TextDetections[i].Confidence.toFixed(2)}%)`);
				textDetections.push(data.TextDetections[i].DetectedText);
			}
		}
		done(null, {success: true, data: textDetections});
	  }
	});
};