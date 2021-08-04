import {HOST,PORT,DB} from "../config/index";

const mongoose = require('mongoose');
// const isProd = process.env.NODE_ENV === 'production'
// const settings = require('../../../configs/settings');
mongoose.connect(`mongodb://${HOST}:${PORT}/${DB}`, { useNewUrlParser: true });
// if (!isProd) {
//     mongoose.connect(`mongodb://${config.HOST}:${config.PORT}/${config.DB}`, { useNewUrlParser: true });
// } else {

// }
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.once('open', () => {
    console.log('connect mongodb success')
})
// var gfs = Grid(db);

db.on('error', function (error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});

db.on('close', function () {
    console.log('数据库断开，重新连接数据库');
});
// exports.User = require('./User');
// exports.News = require('./News');
// exports.Expert = require('./Expert');
// exports.Organization = require('./Organization');
// exports.Collaborate = require('./Collaborate');
// exports.Statute = require('./Statute');
// exports.Collaborate = require('./Collaborate');
// exports.ResearchReport = require('./ResearchReport');
// exports.ResearchScriptures = require('./ResearchScriptures');
// exports.Magazine = require('./Magazine');
// exports.About = require('./About');
// exports.IndexConfig = require('./IndexConfig');
// exports.CompanyData = require('./CompanyData');
// exports.FinancialData = require('./FinancialData');
// exports.Financialing = require('./Financialing');
// exports.Rate = require('./Rate');
// exports.BasicData = require('./BasicData');
// exports.BrModel = require('./BondRecord');
// exports.Oss = require('./oss')
// exports.FileChunk = require('./fs.chunks')
// exports.FileFiles = require('./fs.files')
// exports.db = db
