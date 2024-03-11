const AWS = require('aws-sdk');
const ssm = new AWS.SSM({
    region: "eu-west-2",
    maxRetries: 5,
    retryDelayOptions: 200,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
});

module.exports = ssm;