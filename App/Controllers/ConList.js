'use strict';
const Global = require('../../Boot/Global');
module.exports = {

    getUserDetails : async function (req, res) {
        try {

            let details = await Global.App.Services.SrvList.getUserDetails();

            if (details instanceof Error) {
                let obj = { statusCode: 400, status: "fail", message: "Error while get user details", result: null };
                res.send(obj);
              } else if(details.rowsAffected < 1){
                let obj = { statusCode: 400, status: "Success", message: "No users found !", result: null };
                res.send(obj);
              }else{
                let obj = { statusCode: 200, status: "success", message: "User Details", result: details.recordsets };
                res.send(obj);
              }
        } catch (error) {
            console.log("Error while get user details  "+ error);

        }
    },
    addUser : async function (req, res) {
        try {

            let addUser = await Global.App.Services.SrvList.addUser(req.body);

            if (addUser instanceof Error || addUser.rowsAffected<1) {
                let obj = { statusCode: 400, status: "fail", message: "Error while add user details", result: null };
                res.send(obj);

              }else{
                let obj = { statusCode: 200, status: "success", message: "User Added Successfully", result: null };
                res.send(obj);
              }
        } catch (error) {
            console.log("Error while add user details  "+ error);

        }
    },




}