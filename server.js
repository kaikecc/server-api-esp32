
const config = require('./config');
const { host, port } = config.app;

var schedule = require('node-schedule');


var fs = require('fs');


var data = fs.readFileSync('sensor-data.json');
var obj = JSON.parse(data);
console.log('values: ' + obj.DHT.length);

var reply;

var lastdate = new Date();


var express = require('express');
const { finished } = require('stream');





var app = express();

var server = app.listen(port, host /* listening */);

console.log(`Server running at http://${host}:${port}/`);
// function listening() {
//     console.log('listening on port 3000');
// }





// app.use(express.static('website'));
app.use(express.static(__dirname + '/website'));



app.get('/period/:start/:end', getPeriod);

function getPeriod(request, response) {

    var data = fs.readFileSync('sensor-data.json');
    var values = JSON.parse(data);
    var start = request.params.start;
    var end = request.params.end;

    console.log(start);

    indexStart = values.DHT.findIndex(x => x.date >= start);
    indexEnd = values.DHT.findIndex(x => x.date === end);

   

    var founds = [];


    for (var i = indexStart; i <= indexEnd; i++) {
        founds.push(values.DHT[i]);
       // console.log(values.DHT[i].date);
    }
    console.log("not found " + founds.length);
    response.send(founds);
}


// app.get('/search/:pos/', searchData);

// function searchData(request, response) {
//     var data = fs.readFileSync('sensor-data.json');
//     var values = JSON.parse(data);
//     var pos = request.params.pos;
//     var reply;
//     if (values.DHT[pos]) {
//         reply = {
//             status: 'found',
//             temperature: values.DHT[pos].temperature,
//             humidity: values.DHT[pos].humidity
//         }
//     } else {
//         reply = {
//             status: 'not found',
//             pos: pos,

//         }
//     }
//     response.send(reply);
// }

app.get('/temp', sendTemp);

function sendTemp(request, response) {
    var data = fs.readFileSync('sensor-data.json');
    // length of data
    

    // if (data.length > 0) {
    //     var values = JSON.parse(data);
    //     var last = values.DHT[values.DHT.length - 1];
    //     reply = {
    //         temperature: null,
    //         humidity: null,
    //         date: null
    //     }
    //     response.send(reply);
    // }
    var values = JSON.parse(data);   
    console.log("dht: " + values.DHT.length);
   
    response.send(values);
}

//localhost:3000/add/temperature/valueTemp/humidity/valueHumidity
app.get('/add/temperature/:valueTemp/humidity/:valueHumidity', addData);

// I want to create a schedule to save the data every minute


// var rule = schedule.scheduleJob('/1 * * * * *', async function () {
//     console.log('running scheduled task');
//     var now = new Date();

//     if (now.getMinutes() - lastdate.getMinutes() >= 5 ) {

//         //now = now.toLocaleString();

//         obj.DHT.push({ date: now, temperature: 0.0, humidity: 0.0 });

//         var data = JSON.stringify(obj, null, 2);

//         fs.writeFile('sensor-data.json', data, finished);
//         // fs.appendFileSync('sensor-data.json', data, finished);

//         function finished(err) {
//             console.log('not receive request from client');
            
//         }
//         lastdate = new Date();
        
//     }
    
// });


    
function addData(request, response) {
    var data = request.params;    
    var valueTemp = Number(data.valueTemp);    
    var valueHumidity = Number(data.valueHumidity);
   

   

    if (isNaN(valueTemp) || isNaN(valueHumidity)) {
        reply = {
            status: 'not sucess',
            valueTemp: valueTemp,
            valueHumidity: valueHumidity
        }
        response.send(reply);
    }
    else {

        var now = new Date(); //.toLocaleString();

        
        obj.DHT.push({ date: now, temperature: valueTemp, humidity: valueHumidity });

        var data = JSON.stringify(obj, null, 2);

        fs.writeFile('sensor-data.json', data, finished);        

        function finished(err) {
            console.log('file written');
            reply = {
                temperature: valueTemp,
                humidity: valueHumidity,
                status: "sucess"

            }
            response.send(reply);
        }
        lastdate = new Date();
    }

}



//setInterval(verifyTime, 60000);