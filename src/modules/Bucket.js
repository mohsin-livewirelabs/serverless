const aws = require('aws-sdk');
const s3 = new aws.S3();
const bucket = process.env.BUCKET_NAME;

module.exports.objectExists = async (path) => {
    let params = {
        Bucket: bucket,
        Key: path
    };
    await s3.headObject(params).promise().then(() => {
        return false;
    }).catch(() => {
        return true;
    });
};

module.exports.storeContent = async (path, data) => {
    let params = {
        Bucket: bucket,
        Key: path,
        Body: JSON.stringify(data),
        ContentType: 'application/json'
    };
    await s3.putObject(params).promise();
};

module.exports.getContent = async (path) => {
    let content = await s3.getObject({
        Bucket: bucket,
        Key: path
    }).promise();
    content = new Buffer(content.Body, 'base64').toString('ascii');
    JSON.parse(content);
};

module.exports.appendContent = async (path, data) => {
    let content = await getContent(path);
    content.push(...data);
    await storeContent(path, content);
};
