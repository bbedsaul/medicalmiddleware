'use strict';

module.exports = {
	app: {
		title: 'JWModifier Middleware',
		description: 'Medical middleware that enhances HL7 messages with JLModifier information',
		keywords: ''
	},
	port: process.env.PORT || 3000,
	server: process.env.SERVER || '192.168.23.182',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions'
};