'use strict';

const moment = require('moment');
const { Client } = require('pg');
const aws = require('aws-sdk');
const gb = require('geckoboard')(process.env.GB_API);
let kms = new aws.KMS();
let s3 = new aws.S3();

module.exports.currentUsers = async (event, context, callback) => {
    let time = moment();
    let year = time.format('YYYY');
    let month = time.format('MM');

    let path = `current/${year}-${month}.json`;
    let query = latestMonthQuery(time.clone().startOf('M'));

    let content = await updateData(path, query, time);

    let schema = {
        id: `${process.env.STACK}-current-users`,
        fields: {
            users: {type: 'number', name: 'Users', optional: false},
            timestamp: {type: 'datetime', name: 'Time'}
        },
        'unique_by': ['timestamp']
    };
    await putGb(schema, content);

    return content;
};

module.exports.monthlyUsers = async (event, context, callback) => {
    let time = moment().subtract(1, 'M').startOf('M'); // this is beginning of previous month
    let year = time.format('YYYY');

    let path = `past/${year}.json`;
    let query = monthQuery(time);

    let content = await updateData(path, query, time.format('YYYY-MM-DD'));

    let schema = {
        id: `${process.env.STACK}-past-users`,
        fields: {
            users: {type: 'number', name: 'Users', optional: false},
            timestamp: {type: 'date', name: 'Date'}
        },
        'unique_by': ['timestamp']
    };
    await putGb(schema, content);

    return content;
};

module.exports.calculateMonthlyUsers = async (event, context, callback) => {
    let time = moment(event.date).startOf('M');
    let year= time.format('YYYY');

    let path = `past/${year}.json`;
    let query = monthQuery(time);

    let content = await updateData(path, query, time.format('YYYY-MM-DD'));

    let schema = {
        id: `${process.env.STACK}-past-users`,
        fields: {
            users: {type: 'number', name: 'Users', optional: false},
            timestamp: {type: 'date', name: 'Date'}
        },
        'unique_by': ['timestamp']
    };
    await putGb(schema, content);

    return content;
};

let updateData = async (path, query, timestamp) => {
    let client;
    try {
        console.log('Decrypting secret...');
        let data = await kms.decrypt({
            CiphertextBlob: new Buffer(process.env.PG_PASSWORD, 'base64')
        }).promise();
        let pgPassword = data.Plaintext.toString('ascii');
        console.log('Decrypted.');

        client = new Client({
            host: process.env.PG_HOST,
            database: process.env.PG_DATABASE,
            port: process.env.PG_PORT,
            user: process.env.PG_USER,
            password: pgPassword,
            ssl: true
        });
        console.log('Connect to db...');
        await client.connect();
        console.log('Connected.');

        console.log('Running queries...');
        let usersThisMonth = parseInt((await client.query(query)).rows[0].count);
        console.log('Finished queries.');

        console.log('Writing to bucket...');
        let content = await appendToBucket(usersThisMonth, path, timestamp);
        console.log('Finished writing.');

        return content;
    } catch(error) {
        throw error;
    } finally {
        if(client) {
            console.log('Closing connection to db...');
            client.end();
            console.log('Connection to db closed')
        }
    }
};

let appendToBucket = async (users, path, timestamp) => {
    let bucket = process.env.BUCKET_NAME;
    let content;

    try {
        console.log('Looking for object...');
        content = await s3.getObject({
            Bucket: bucket,
            Key: path
        }).promise();

        content = new Buffer(content.Body, 'base64').toString('ascii');
        content = JSON.parse(content);
        console.log('Found object.');
    } catch(err) {
        console.log('Didn\'t find object.');
        content = [];
    }

    content.push({
        users: users,
        timestamp: timestamp
    });

    await s3.putObject({
        Bucket: bucket,
        Key: path,
        Body: JSON.stringify(content),
        ContentType: 'application/json'
    }).promise();

    return content;
};

let latestMonthQuery = (time) => {
    return `select count(1)
from players as p
where exists((select 1
              from sports_bets as sb
              where sb.player_id = p.id
                and sb.state = 'completed'
                and sb.created_at >= '${time.format("YYYY-MM-DD")}')
                 union (select 1
                        from casino_bets as cb
                        where cb.player_id = p.id
                          and cb.state = 'completed'
                          and cb.created_at >= '${time.format("YYYY-MM-DD")}'));`;
};

let monthQuery = (time) => {
    let start = time.format('YYYY-MM-DD');
    let end = time.clone().add(1, 'M').format('YYYY-MM-DD');

    return `select count(1)
from players as p
where exists((select 1
              from sports_bets as sb
              where sb.player_id = p.id
                and sb.state = 'completed'
                and sb.created_at >= '${start}'
                and sb.created_at < '${end}')
                 union (select 1
                        from casino_bets as cb
                        where cb.player_id = p.id
                          and cb.state = 'completed'
                          and cb.created_at >= '${start}'
                          and cb.created_at < '${end}'));`;
};

let putGb = (schema, data) => {
    return new Promise((resolve, reject) => {
        gb.datasets.findOrCreate(schema, (err, dataset) => {
            if (err) reject(err);
            dataset.put(data, (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    });
};
