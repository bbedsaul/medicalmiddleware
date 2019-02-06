'use strict';

module.exports = {
	port: 443,
	db: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'mongodb://localhost/webapplication',
	mailer: {
		from: process.env.MAILER_FROM || 'TODO-CONFIGURE MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'TODO-CONFIGURE MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'TODO-CONFIGURE MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'TODO-CONFIGURE MAILER_PASSWORD'
			}
		}
	}
};