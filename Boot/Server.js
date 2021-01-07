'use strict';

var express = require('express'),
  port =  3000;
var fs = require('fs');
var join = require('path').join;
var path = require("path");
var bodyparser = require('body-parser');  
var winston = require('winston');
var ip = require('ip');
var sql = require("mssql");



const Global = new require('../Boot/Global'); 

Global.App = express();
Global.Sql = sql;
Global.SqlPools = [];
Global.ConfigData = new Array();
fs.readdirSync(join(__dirname, './'))
    .filter(file => ~file.search(/^[^\.].*\.js$/))
    .forEach(function (file) {
        Global.ConfigData[file.split('.')[0]] = require(join(join(__dirname, './'), file))
    });


Global.App.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

/**
*  Body Parser
*/

Global.App.use(bodyparser.urlencoded({extended:false})) 
Global.App.use(bodyparser.json()) 



Global.Router =  express.Router();
(async function () {
  try {

Global.Server = {};
let insidePath = null;

Global.Log = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),

});

Global.Log.add(new winston.transports.Console({
    timestamp: true,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf((info) => {
            const { timestamp, level, message, ...args } = info;
            const ts = timestamp.slice(0, 19).replace('T', ' ');
            return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
        })
    ),
}));



Global.Log.info('Loading... DB Connection');
Global.Log.info('Loading... SqlDB Connection');

Global.SqlPool = await Global.Sql.connect(Global.ConfigData.Database[Global.ConfigData.Database.connectionType].sql);

Global.Log.info('Initializing App Server...');
fs.readdirSync(path.join(__dirname, '../', './App'))
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file.indexOf(".") === -1);
    })
    .forEach(function (dir) {
        if (dir != 'Views' && dir != 'Routes') { // Ignore Load Views & Routes in Sys Object
            Global.App[dir] = {};
            fs.readdirSync(path.join(__dirname, '../', './App', dir)).filter(function (file) {
                return (file.indexOf(".") !== 0);
            }).forEach(function (subDir) {

                insidePath = dir + '/' + subDir;
                if (fs.existsSync(path.join(__dirname, '../', './App', insidePath))) {
                    if (fs.lstatSync(path.join(__dirname, '../', './App', insidePath)).isFile()) {
                        Global.App[dir][subDir.split('.')[0]] = require(path.join(__dirname, '../', './App', dir, subDir)); // 
                    } else {
                        Global.App[dir][subDir] = {};
                        fs.readdirSync(path.join(__dirname, '../', './App', insidePath)).filter(function (file) {
                            return (file.indexOf(".") !== 0);
                        }).forEach(function (subInnerDir) {
                            insidePath = dir + '/' + subDir + '/' + subInnerDir;
                            if (fs.lstatSync(path.join(__dirname, '../', './App', insidePath)).isFile()) {
                                Global.App[dir][subDir][subInnerDir.split('.')[0]] = require(path.join(__dirname, '../', './App', dir + '/' + subDir, subInnerDir)); // Add File in Sub Folder Object
                            } else {
                                Global.App[dir][subDir][subInnerDir] = {};
                                fs.readdirSync(path.join(__dirname, '../', './App', insidePath)).filter(function (file) {
                                    return (file.indexOf(".") !== 0);
                                }).forEach(function (subInnerLastDir) {
                                    insidePath = dir + '/' + subDir + '/' + subInnerDir + '/' + subInnerLastDir;
                                    if (fs.lstatSync(path.join(__dirname, '../', './App', insidePath)).isFile()) {
                                        Global.App[dir][subDir][subInnerDir][subInnerLastDir.split('.')[0]] = require(path.join(__dirname, '../', './App', dir + '/' + subDir + '/' + subInnerDir, subInnerLastDir)); // 
                                    }

                                });
                            }
                        });

                    }

                }
            });
        }

    });
    insidePath = null;
    fs.readdirSync(join(__dirname, '../App/Routes'))
        .filter(function (file) {
            return (file.indexOf(".") !== 0);
        })
        .forEach(function (dir) {
            // Global.App[dir] = {};
            if (fs.lstatSync(path.join(__dirname, '../', './App/Routes', dir)).isFile()) {
                Global.App.use('/', require(join(join(__dirname, '../App/Routes'), dir))) // Dir As file Name
            } else {
                fs.readdirSync(path.join(__dirname, '../', './App/Routes', dir)).filter(function (file) {
                    return (file.indexOf(".") !== 0);
                }).forEach(function (subDir) {
                    insidePath = dir + '/' + subDir;
                    if (fs.lstatSync(path.join(__dirname, '../', './App/Routes', insidePath)).isFile()) {
                        Global.App.use('/', require(join(join(__dirname, '../App/Routes'), insidePath))) // Dir As file Name
                    } else {
                        insidePath = dir + '/' + subDir;
                        fs.readdirSync(join(__dirname, '../App/Routes', insidePath))
                            .filter(file => ~file.search(/^[^\.].*\.js$/))
                            .forEach(function (file) {
                                Global.App.use('/', require(join(join(__dirname, '../App/Routes', insidePath), file))); // Register Router to app.use
                            });
                    }
                });
            }
        });

        let date = new Date();
        let dateTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' Time ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();;
        Global.App.listen(port)
        console.log("(---------------------------------------------------------------)");
        console.log(" |                     Server Started...                        |");
        console.log(" |                 Date :" + dateTime + "                 |");
        console.log(" |                  http://" + ip.address() + ":" + port + "                   |");
        console.log("(---------------------------------------------------------------)");
 

module.exports = {
    app: Global.App,
    server: Global.Server
};
} catch (err) {
  console.log("Global Error When Server : " + err.message)
}
})()

