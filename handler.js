'use strict';
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({ region: "eu-central-1" });
const updateTables = require('update-tables');

function exchage_avg_day(event, context, callback) {
	const today = new Date();
	const startDate = today.setDate(today.getDate() + 1);
	const endDate = today.setDate(today.getDate() - 1);
	const params = {
		TableName : "currency",
		ProjectionExpression:"#date, currencies",
		FilterExpression: "#date between :after_date and :before_date",
		ExpressionAttributeNames: {
			"#date": "date"
		},
		ExpressionAttributeValues: {
			":before_date": startDate,
			":after_date": endDate
		}
	};

	docClient.scan(params, (err, data) => {
		if (err) {
			callback(null, JSON.stringify(err, null, 2));
		} else {
			console.log("Query succeeded. 11");
			console.log(data.Items);
			callback(null, data);
		}
	});
}

module.exports.exchage_avg_day = exchage_avg_day;
module.exports.updateTables = updateTables;