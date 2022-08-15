
var fs = require('fs');

var data = fs.readFileSync('temps.json');
var values = JSON.parse(data);

var obj = {
    DHT: []
    };
    


console.log('server is running');

var express = require('express');
const { finished } = require('stream');





var app = express();

var server = app.listen(3000, listening);


function listening() {
    console.log('listening on port 3000');
}





app.use(express.static('website'));
//app.use('/api/v1',require('./website')());



//app.get('/search/:flower', sendFlower);

//function sendFlower(request, response) {
//    var data = request.params;
//    
//    response.send("You sent me a " + data.flower);
//}



app.get('/search/:pos/', searchTemp);

function searchTemp(request, response) {
    var data = fs.readFileSync('temps.json');
    var values = JSON.parse(data);
    var pos = request.params.pos;
    var reply;
    if (values.DHT[pos]) {
        reply = {
            status: 'found',
            temperature: values.DHT[pos].temperature,
            humidity: values.DHT[pos].humidity
        }
    } else {
        reply = {
            status: 'not found',
            pos: pos,
            
        }
    }
response.send(reply);
}

app.get('/temp', sendTemp);

function sendTemp(request, response) {
    var data = fs.readFileSync('temps.json');
    var values = JSON.parse(data);
    response.send(values);
}

//localhost:3000/add/temperature/valueTemp/humidity/valueHumidity
app.get('/add/temperature/:valueTemp/humidity/:valueHumidity', addTemp);
//app.get('/add/:temp/:score', addTemp);

function addTemp(request, response) {
    var data = request.params;
    var temp = data.temperature;
    var valueTemp = Number(data.valueTemp);
    var humidity = data.humidity;
    var valueHumidity = Number(data.valueHumidity);
    //var data = fs.readFileSync('temps.json');
    //var values = JSON.parse(data);

    var reply;

    if (!valueTemp & !valueHumidity) {
         reply = {
            msg: "Score is required"
        }
    }
    else {
               
       var now = new Date();
        
        
         obj.DHT.push({ date: now, temperature: valueTemp, humidity: valueHumidity });
        
         var data = JSON.stringify(obj, null, 2);
        
        fs.writeFile('temps.json', data, finished);
       // fs.appendFileSync('temps.json', data, finished);
        
        function finished(err) {
            console.log('file written');
            reply = {
                temperature: valueTemp,
                humidity: valueHumidity,                
                status: "sucess"
            
            }
        } 
        
        reply = {
            temperature: valueTemp,
            humidity: valueHumidity,                
            status: "sucess"
        
        }
         
    }

   

    response.send(reply);
   
}