const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'}); // Rekognition only works in Ireland

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
	  	let minConfidence = Number(req.minConfidence) || 90.0;
	  	let textDetections = [];
			for (let i = 0; i < arrayLength; i++) {
				if (data.TextDetections[i].Confidence > minConfidence) {
				  	let textDetection = {};
					// console.log(`${data.TextDetections[i].DetectedText} - (Confidence: ${data.TextDetections[i].Confidence.toFixed(2)}%)`);
					textDetection.DetectedText = data.TextDetections[i].DetectedText;
					textDetection.Confidence = data.TextDetections[i].Confidence.toFixed(2);
					textDetections.push(textDetection);
				}
			}
			// console.log(textDetections);
		done(null, {success: true, data: textDetections});
	  }
	});
};