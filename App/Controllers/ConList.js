'use strict';
const Global = require('../../Boot/Global');
module.exports = {


    userLogin : async function (req, res) {
        try {

            let getDetails = await Global.App.Services.SrvList.getUserDetails();


            if(getDetails == true){
                   let obj = {

                    status : 200 ,
                    messege : 'Successs',
                    result: null
                    }
                    res.send(obj)


            }else{

                    let obj = {

                        status : 400 ,
                        messege : 'Fail',
                        result: null
                        }
                    res.send(obj)



            }
      
            
        } catch (error) {
            console.log("Error while user login  "+ error);

        }
    },
    userRegister : async function (req, res) {
        try {

            console.log("Userr register called ??????" , req.body)


            // let getDetails = await Global.App.Services.SrvList.userRegister();


            // if(getDetails == true){
            //        let obj = {

            //         status : 200 ,
            //         messege : 'Successs',
            //         result: null
            //         }
            //         res.send(obj)


            // }else{

            //         let obj = {

            //             status : 400 ,
            //             messege : 'Fail',
            //             result: null
            //             }
            //         res.send(obj)



            // }
      
            
        } catch (error) {
            console.log("Error while user login  "+ error);

        }
    },




}