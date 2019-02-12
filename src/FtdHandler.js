'use strict';

const moment = require('moment');

const DB = require('./modules/Db');
const Queries = require('./modules/Queries');
const Dataset = require('./modules/Dataset');

module.exports.currentMonth = async (event, context, callback) => {
    const name = `cloudbet.ftd-current-month.${process.env.STAGE}`;

    let date = moment().startOf('M').format('YYYY-MM-DD');
    let query = Queries.ftdCurrentMonth(date);
    let results = await DB.query(query);
    let data = {
        users: results.rows[0].count,
        time: moment().format()
    };
    await Dataset.append(name, data);
};

module.exports.pastMonths = async (event, context, callback) => {
    const name = `cloudbet.ftd-past-months.${process.env.STAGE}`;

    let date = event['detail-type'] === "Scheduled Event" ? moment() : moment(event.date);
    let startDate = date.startOf('M').format('YYYY-MM-DD');
    let endDate = startDate.clone().add(1, 'M').format('YYYY-MM-DD');

    let query = Queries.ftdPastMonth(startDate, endDate);
    let results = await DB.query(query);
    let data = {
        users: results.rows[0].count,
        date: startDate
    };
    await Dataset.append(name, data);
};
