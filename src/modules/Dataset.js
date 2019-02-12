const Bucket = require('./Bucket');
const Gecko = require('./Gecko');

const schemaBasePath = 'schema';
const dataBasePath = 'data';

module.exports.create = async (name, fields, unique_by) => {
    let schema = {
        id: name,
        fields: fields
    };
    if (unique_by) schema.unique_by = unique_by;

    let schemaPath = `${schemaBasePath}/${name}`;
    if (Bucket.objectExists(schemaPath)) throw new Error('Dataset already exists');

    await Gecko.create(schema);

    await Bucket.storeContent(schemaPath, schema);
};

module.exports.push = async (name, data) => {
    let schemaPath = `${schemaBasePath}/${name}`;
    let schema = await Bucket.getContent(schemaPath);

    let dataset = await Gecko.fetch(schema);
    await Gecko.push(dataset, data);

    let dataPath = `${dataBasePath}/${name}`;
    await Bucket.storeContent(dataPath, data);
};

module.exports.append = async (name, data) => {
    let schemaPath = `${schemaBasePath}/${name}`;
    let schema = await Bucket.getContent(schemaPath);

    let dataset = await Gecko.fetch(schema);
    await Gecko.append(dataset, data);

    let dataPath = `${dataBasePath}/${name}`;
    await Bucket.appendContent(dataPath, data);
};
