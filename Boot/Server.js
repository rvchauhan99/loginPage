'use strict';

var express = require('express'),
  port =  3000;
var fs = require('fs');
var join = require('path').join;
var path = require("path");
var bodyparser = require('body-parser');  
var winston = require('winston');
var ip = require('ip');


const Global = new require('../Boot/Global'); 

Global.App = express();
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



// Global.Log.info('Loading... DB Connection');
// Global.Log.info('Loading... SqlDB Connection');





Global.Log.info('Initializing App Server...');
fs.readdirSync(path.join(__dirname, '../', './App'))
    .filter(function (file) {
        return (file.indexOf(".") !== 0) && (file.indexOf(".") === -1);
    })
    .forEach(function (dir) {
        if (dir != 'Views' && dir != 'Routes') { // Ignore Load Views & Routes in Sys Object
            Global.App[dir] = {};
            // Global.Log.info('Loading... App' + dir);
            fs.readdirSync(path.join(__dirname, '../', './App', dir)).filter(function (file) {
                return (file.indexOf(".") !== 0);
            }).forEach(function (subDir) {

                insidePath = dir + '/' + subDir;
                // Global.Log.info('Loading... APP Sub Directory :'+subDir);
                // Global.Log.info('insidePath... APP Sub Directory :'+insidePath);
                if (fs.existsSync(path.join(__dirname, '../', './App', insidePath))) {
                    if (fs.lstatSync(path.join(__dirname, '../', './App', insidePath)).isFile()) {
                        //Global.Log.info('Loading... File :'+subDir);
                        Global.App[dir][subDir.split('.')[0]] = require(path.join(__dirname, '../', './App', dir, subDir)); // Add File in Sub Folder Object
                    } else {
                        Global.App[dir][subDir] = {};
                        //Global.Log.info('Loading... App Sub Directory Folder:'+insidePath);
                        fs.readdirSync(path.join(__dirname, '../', './App', insidePath)).filter(function (file) {
                            return (file.indexOf(".") !== 0);
                        }).forEach(function (subInnerDir) {
                            insidePath = dir + '/' + subDir + '/' + subInnerDir;
                            //Global.Log.info('Loading... App Sub  Inner Directory :>>>'+subInnerDir);
                            if (fs.lstatSync(path.join(__dirname, '../', './App', insidePath)).isFile()) {
                                //Global.Log.info('Loading... App Sub  File :'+subInnerDir);
                                Global.App[dir][subDir][subInnerDir.split('.')[0]] = require(path.join(__dirname, '../', './App', dir + '/' + subDir, subInnerDir)); // Add File in Sub Folder Object
                            } else {
                                Global.App[dir][subDir][subInnerDir] = {};
                                //	Global.Log.info('Loading... App Sub Inner Directory Folder:'+insidePath);

                                fs.readdirSync(path.join(__dirname, '../', './App', insidePath)).filter(function (file) {
                                    return (file.indexOf(".") !== 0);
                                }).forEach(function (subInnerLastDir) {
                                    insidePath = dir + '/' + subDir + '/' + subInnerDir + '/' + subInnerLastDir;
                                    //Global.Log.info('Loading... App Sub  Inner Directory :'+subInnerLastDir);
                                    if (fs.lstatSync(path.join(__dirname, '../', './App', insidePath)).isFile()) {
                                        //Global.Log.info('Loading... Sub Last  File :'+subInnerLastDir);
                                        Global.App[dir][subDir][subInnerDir][subInnerLastDir.split('.')[0]] = require(path.join(__dirname, '../', './App', dir + '/' + subDir + '/' + subInnerDir, subInnerLastDir)); // Add File in Sub Folder Object
                                    } else {
                                        //	Global.Log.info('Loading... Sub Last  Folder Plase Change Your Code:'+subInnerLastDir);
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
        let dateTime = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' Time ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        // Evolve.HttpServer.listen(Evolve.Config.port);
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
  console.log("Evolve Error When Start Sql Server : " + err.message)
}
})()




// const bodyparser = require('body-parser') 
// const express = require("express") 
// // const path = require('path') 
// const app = express() 
   
// var PORT =  3000 
  
// // View Engine Setup 
// // app.set("views", path.join(__dirname)) 
// // app.set("view engine", "ejs") 
  
// // Body-parser middleware 

   
// app.get("/", function(req, res){ 
//     res.render("SampleForm") 
// }); 
   
// app.post('/saveData', (req, res) => { 
//     console.log("Using Body-parser: ", req.body) 
// }) 
   
// app.listen(PORT, function(error){ 
//     if (error) throw error 
//     console.log("Server created Successfully on PORT", PORT) 
// })