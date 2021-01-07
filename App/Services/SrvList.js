'use strict';
const Global = require('../../Boot/Global');
module.exports = {

    getUserDetails: async function () {
		try {
			return await Global.SqlPool.request()
				.query('SELECT * FROM UserDetails ');

		} catch (error) {
			Global.Log.error("Error while get user details " + error.message);
			return new Error("Error while get user details " + error.message);
		}
    },
    addUser: async function (data) {
		try {
            return await Global.SqlPool.request()
				.input('User_Name', Global.Sql.NVarChar, data.User_Name)
				.input('User_Password', Global.Sql.NVarChar, data.User_Password)
            
				.query('INSERT INTO  UserDetails (User_Name ,User_Password ) VALUES (@User_Name ,@User_Password )');

		} catch (error) {
			Global.Log.error("Error while add user details " + error.message);
			return new Error("Error while add user details " + error.message);
		}
	},
	checkUser: async function (data) {
		try {
			return await Global.SqlPool.request()
			.input('User_Name', Global.Sql.NVarChar, data.User_Name)
			.input('User_Password', Global.Sql.NVarChar, data.User_Password)
		
			.query('SELECT * FROM UserDetails WHERE User_Name=@User_Name AND  User_Password=@User_Password');

		} catch (error) {
			Global.Log.error("Error while check user details " + error.message);
			return new Error("Error while check user details " + error.message);
		}
	},




}