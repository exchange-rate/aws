console.log('starting function');
const request = require('request');
const AWS = require('aws-sdk');
const docClient = new AWS.DynamoDB.DocumentClient({ region: 'eu-central-1' });

// const YQL = `select * from yahoo.finance.xchange where pair="EURUAH,USDUAH,EURRUB,USDRUB" & format=json & env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys & callback=#query/results/rate/0`

const url = 'https://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+' +
'%22EURUAH,USDUAH,EURRUB,USDRUB' +
'%22&format=' +
'json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=#query/results/rate/0';

function updateTodayTable(data, cb) { 
	data.query.results.rate.forEach((cur)=> {
		let params = {
			TableName: 'currency',
			Item: {
				date: data.query.created,
                currency: cur.id,
				rate: Number(cur.Rate)
			}
		};
		docClient.put(params, (err, data) => {
			if (err) {
				cb(null, JSON.stringify(err, null, 2))
			} else {
				cb(null, data);
			}
		});	
	});
    
}

function updateAllDaysTable() {

}


function update(e, ctx, cb) {
    request(url, (error, response, body) => {
        if (error) {
            cb(error, null);
        }

        const data = JSON.parse(body);

        updateTodayTable(data, cb);
        updateAllDaysTable(data, cb);
    });
}

module.exports.updateTables = update;