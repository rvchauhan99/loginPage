/**
 * Title : Global Boot
 * Desc :  
 */

module.exports = Global = Global;

function Global() {
	this.Util = {},
		this.ConfigData = {},
		this.Config = {},
		this.App = {};
		this.Io = {},
		this.HttServer = {},
		this.MqttClient = {},
		this.RedisClient = {},
		this.SqlPool = {},
		this.SqlPools = [],

		this.Sql = {},
		this.Jwt = {},
		this.JwtSecret = '';
	this.Bcrypt = {};
	this.Md5Enc = {};
	this.Csv = {};
	this.CsvExport = {};
	this.Axios = {};
	this.ChildProcess = {};
	this.Fs = {};
	this.Weight = 0;
	this.Xml = {};
	this.pdfExtract = {};
	this.Xlsx = {};
	this.Json2CSV = {};
	this.AD = {};
	this.ADQueue = [];
	this.Mailer = {};
	this.sFtpClient = {};



	// Socket Server
	this.HttpServer = {},
		this.socketClient = {},


		// MAchine Array

		this.Milling = {};
	this.Vibration = {};
	this.vibrationBarcode = '';
	this.vibrationMessageStatus = {
		partOk: '-',
		pnok: '-',
		step: 7
	};



	// IOT
	this.WcmTask = []; // Weight Capture Machine
	this.MqttClient = {};
	this.GlobalWsM = []; // Global Weight Scale Machine Current Weight Store into Array

	// Printer Object Array
	this.PrintJob = [];
	this.Print = {};
	this.Edge = {};


	// // For Setting

	this.CMD = {};

};