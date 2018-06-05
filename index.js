require('dotenv');
const repl = require('repl');
const AWS = require('aws-sdk');

AWS.config.apiVersions = {
  rekognition: '2016-06-27',
};
AWS.config.update({region: process.env.AWS_REGION});
AWS.config.loadFromPath('./config.json');

const s3 = new AWS.S3();
const rekognition = new AWS.Rekognition();

// repl.start('> ');

const getText = (bucket, key) => {
	var getParams = {
	    Bucket: bucket, // your bucket name,
	    Key: key // path to the object you're looking for
	}

	s3.getObject(getParams, function(err, data) {
	    // Handle any error and exit
	    if (err)
	        return err;

	  // No error happened
	  // Convert Body from a Buffer to a String

	  let objectData = data.Body.toString('utf-8');
	  console.log(objectData);
	  return objectData;
	});

	var params = {
	  Image: { /* required */
	    Bytes: new Buffer(s3.getObject(getParams).objectData, 'base64') // || s3.getObject(getParams).objectData /* Strings will be Base-64 encoded on your behalf */ //,
	    // S3Object: {
	    //   Bucket: process.env.AWS_BUCKET,
	    //   Name: process.env.AWS_BUCKET_IMAGE,
	    //   Version: '1.0.0'
	    // }
	  }
	};
	rekognition.detectText(params, function(err, data) {
	  if (err) console.log(err, err.stack);
	  else     console.log(data);
	});
};

getText(process.env.AWS_BUCKET, process.env.AWS_BUCKET_IMAGE)