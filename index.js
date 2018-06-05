require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.apiVersions = {
  rekognition: '2016-06-27',
};
AWS.config.update({region: 'eu-west-1'}); // Rekognition only works in Ireland

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();


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
	  else     console.log(data);
	});
};

getText(process.env.S3_BUCKET, process.env.S3_EXAMPLE_IMAGE)