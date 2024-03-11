const ssm = require('./aws-client');

const getSecret = async (secretName) => {
    const params = {
        Name: secretName,
        WithDecryption: true
    };
    try {
        const result = await ssm.getParameter(params).promise();
        return result.Parameter.Value;
    } catch (err) {
        console.error(`Error retrieving parameter ${secretName}: ${err}`);
        throw err;
    }
};

module.exports = {getSecret};