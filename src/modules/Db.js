const { Client } = require('pg');
const KMS = require('./KmsUtil');

module.exports.query = async (query) => {
    let client = new Client({
        host: process.env.PG_HOST,
        database: process.env.PG_DATABASE,
        port: process.env.PG_PORT,
        user: process.env.PG_USER,
        password: KMS.decryptSecret(process.env.PG_PASSWORD),
        ssl: true
    });

    client.connect().then(async () => {
        return await client.query(query);
    }).finally(() => {
        if (client) {
            client.end();
        }
    })
};
