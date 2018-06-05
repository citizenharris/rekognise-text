require('dotenv').config();

const AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'}); // Rekognition only works in Ireland

const rekognition = new AWS.Rekognition({apiVersion: '2016-06-27'});

const getText = (bucket, key) => {

	var params = {
	  Image: { 
	    S3Object: {
	      Bucket: bucket,
	      Name: key,
	    }
	  }
	};

	rekognition.detectText(params, function(err, data) {
	  if (err) console.log(err, err.stack);
	  else {
	  	// console.log(data);
	  	let arrayLength = data.TextDetections.length;
	  	let regex = /^(([A-Za-z]{1,2}[ ]?[0-9]{1,4})|([A-Za-z]{3}[ ]?[0-9]{1,3})|([0-9]{1,3}[ ]?[A-Za-z]{3})|([0-9]{1,4}[ ]?[A-Za-z]{1,2})|([A-Za-z]{3}[ ]?[0-9]{1,3}[ ]?[A-Za-z])|([A-Za-z][ ]?[0-9]{1,3}[ ]?[A-Za-z]{3})|([A-Za-z]{2}[ ]?[0-9]{2}[ ]?[A-Za-z]{3})|([A-Za-z]{3}[ ]?[0-9]{4}))$/;
		for (let i = 0; i < arrayLength; i++) {
			if (data.TextDetections[i].Confidence > 95.0 && data.TextDetections[i].DetectedText.match(regex)) {
				console.log(data.TextDetections[i]);
			}
		}
	  }
	});
};

getText(process.env.S3_BUCKET, process.env.S3_EXAMPLE_IMAGE)