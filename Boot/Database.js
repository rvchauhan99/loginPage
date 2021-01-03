module.exports = {
	connectionType: 'local',
	option: {
		// key: value, // Custom Variable
	},
	local: {
		mode: 'local',
		sql: {
			server: 'localhost',
			port: 1433,
			user: 'ravat',
			password: 'test123', // Al!teR@E~0L$@ // aliter@123
			database: 'test',
			pool: {
				max: 100,
				min: 0,
				idleTimeoutMillis: 30000
			},
			options: {
				// encrypt: false // Use this if you're on Windows Azure
			}
		}
	},

}
