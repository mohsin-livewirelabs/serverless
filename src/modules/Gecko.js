const gb = require('geckoboard')(process.env.GB_API);

module.exports.fetch = async (schema) => {
    return new Promise((resolve, reject) => {
        gb.datasets.findOrCreate(schema, (err, dataset) => {
            if (err) reject(err);
            resolve(dataset);
        });
    });
};

module.exports.create = async (schema) => {
    return fetch(schema);
};

module.exports.push = (dataset, data) => {
    return new Promise((resolve, reject) => {
        dataset.put(data, (err) => {
            if (err) reject(err);
            resolve();
        })
    })
};

module.exports.append = (dataset, data) => {
    return new Promise((resolve, reject) => {
        dataset.post(data, (err) => {
            if (err) reject(err);
            resolve();
        })
    })
};
