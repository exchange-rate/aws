'use strict';
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({region: "eu-central-1"});
module.exports.exchage_avg_day = (event, context, callback) => {
	let toDay = new Date();
	let before_date = toDay.setDate(toDay.getDate() + 1);
	let after_date = toDay.setDate(toDay.getDate() - 1);
	var params = {
		TableName : "currency",
		ProjectionExpression:"#date, currencies",
		FilterExpression: "#date between  :after_date and :before_date",
		ExpressionAttributeNames:{
			"#date": "date"
		},
		ExpressionAttributeValues: {
			":before_date": before_date,
			":after_date": after_date
		}
	};

	docClient.scan(params, function(err, data) {
		if (err) {
			callback(null, JSON.stringify(err, null, 2));
		} else {
			console.log("Query succeeded.");
			console.log(data.Items)
			callback(null, data);
		}
	});
};
