console.log('starting function');
const request = require("request");
const AWS = require("aws-sdk");
const docClient = new AWS.DynamoDB.DocumentClient({region: "eu-central-1"});

module.exports = (e, ctx, cb) => {
    request('https://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.xchange+where+pair+=+' +
        '%22EURUAH,USDUAH,EURRUB,USDRUB' +
        '%22&format=' +
        'json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=#query/results/rate/0',
        function (error, response, body) {
            if (error){
                cb(error, null)
            }
            let params = {
                TableName: "currency"
            };

            let jsonObj = JSON.parse(body);
            let rate = jsonObj.query.results.rate;
            let [USDUAH, EURUAH, EURRUB, USDRUB] = rate;
            params.Item = {
                date: jsonObj.query.created,
                currencies:{
                    USDUAH: {id: USDUAH.id, rate: Number(USDUAH.Rate)},
                    EURUAH: {id: EURUAH.id, rate: Number(EURUAH.Rate)},
                    EURRUB: {id: EURRUB.id, rate: Number(EURRUB.Rate)},
                    USDRUB: {id: USDRUB.id, rate: Number(USDRUB.Rate)},
                },
                id: "_" + Date.now()
            };

            docClient.put(params, (err, data)=>{
                if(err){
                    cb(err, null)
                }else{
                    cb(null, data);
                }
            });
        });
}
