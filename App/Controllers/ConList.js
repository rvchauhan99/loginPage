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
    checkUser : async function (req, res) {
      try {
          console.log("req.body>>>>" ,  req.body)
          let checkUser = await Global.App.Services.SrvList.checkUser(req.body);

          if (checkUser instanceof Error) {
              let obj = { statusCode: 400, status: "fail", message: "Error while check user details", result: null };
              res.send(obj);

            }else if(checkUser.rowsAffected<1){
              let obj = { statusCode: 400, status: "fail", message: "No User Found", result: null };
              res.send(obj);

            }else{
              let obj = { statusCode: 200, status: "success", message: "User Logged In Successfully", result: null };
              res.send(obj);
            }
      } catch (error) {
          console.log("Error while add user details  "+ error);

      }
  },




}