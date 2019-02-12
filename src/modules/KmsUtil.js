const aws = require('aws-sdk');
const kms = new aws.KMS();

module.exports.decryptSecret = async (secret) => {
    let data = await kms.decrypt({
        CiphertextBlob: new Buffer(secret, 'base64')
    }).promise();
    return data.Plaintext.toString('ascii');
};
