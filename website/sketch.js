
const ctx_temperature = document.getElementById('chartTemperature').getContext('2d');
const ctx_humidity = document.getElementById('chartHumidity').getContext('2d');

const data_temperature = {
    labels: [],
    datasets: [{
        label: 'Temperature of Environment',
        data: [],
        fill: false,
        backgroundColor: [
            'rgba(0, 0, 255, 0.2)'],
        borderColor: [
            'rgba(0, 0, 255, 1)'],
        borderWidth: 1
    }]
};

const data_humidity = {
    labels: [],
    datasets: [{
        label: 'Humidity of Environment',
        data: [],
        fill: false,
        backgroundColor: [
            'rgba(255, 0, 0, 0.2)'],
        borderColor: [
            'rgba(255, 0, 0, 1)'],
        borderWidth: 1
    }]
};


const config_temperature = {
    type: 'line',
    data: data_temperature,
    options: {
        maintainAspectRatio: false,
        

        scales: {
            x: {

                display: true

            },
            y: {
                beginAtZero: true,
                min: 0,
               max: 30,
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, ticks) {
                        return value + '°C';
                    }
                }
            }
        }
    }
};

const config_humidity = {
    type: 'line',
    data: data_humidity,
    options: {
        maintainAspectRatio: false,

        scales: {
            x: {

                display: true

            },
            y: {
                beginAtZero: true,
                min: 0,
                max: 100,
                ticks: {
                    // Include a dollar sign in the ticks
                    callback: function (value, index, ticks) {
                        return value + '%';
                    }
                }
            }
        }
    }
};

const chart_temperature = new Chart(ctx_temperature, config_temperature);
const chart_humidity = new Chart(ctx_humidity, config_humidity);


async function refreshData() {

    const response = await fetch("http://localhost:3000/temp");
    
    const data = await response.text();
    const obj = JSON.parse(data);

    const count = Object.keys(obj.DHT).length;
   

    document.getElementById('temp').textContent = obj.DHT[count - 1].temperature;
    document.getElementById('humid').textContent = obj.DHT[count - 1].humidity;

}

async function getData() {



    const xlabel = [];
    const ytemps = [];
    const yhumidity = [];
    const response = await fetch("http://localhost:3000/temp");
    
    const data = await response.text();
    const obj = JSON.parse(data);

    const count = Object.keys(obj.DHT).length;
    console.log(count);

    document.getElementById('temp').textContent = obj.DHT[count - 1].temperature;
    document.getElementById('humid').textContent = obj.DHT[count - 1].humidity;

    
    var date = obj.DHT[parseInt(count) - 1].date
    

    let dropdown_initial = document.getElementById('date_initial');
    let dropdown_final = document.getElementById('date_final');

    for (var i = 0; i < obj.DHT.length; i++) {
        var option = document.createElement("option");
        var option2 = document.createElement("option");
        

        option.text = obj.DHT[i].date;
        option2.text = obj.DHT[i].date;

        dropdown_final.add(option);
        dropdown_initial.add(option2);
               
    }

    for (var i = 0; i < obj.DHT.length; i++) {
       
        var date = obj.DHT[i].date
        xlabel.push(date);


        ytemps.push(obj.DHT[i].temperature);
        yhumidity.push(obj.DHT[i].humidity);
    }
    //filterDate();
    return { xlabel, ytemps, yhumidity };
}


function getSelectValue() {
    var select_initial = document.getElementById("date_initial")
    var value_initial = select_initial.options[select_initial.selectedIndex].value;

    var select_final = document.getElementById("date_final")
    var value_final = select_final.options[select_final.selectedIndex].value;

    const start = new Date(value_initial);
    const end = new Date(value_final);

    if (start > end || start == end ||   end < start) {
        document.getElementById("filter").disabled = true;
        return;
    }
    else {
        document.getElementById("filter").disabled = false; 
        return;
    }
  
}




async function filterDate() {


    const xlabel = [];
    const ytemps = [];
    const yhumidity = [];



    const start = document.getElementById('date_initial').value;
    const end = document.getElementById('date_final').value;

    


    const response_period = await fetch("http://localhost:3000/period/" + start + "/" + end);

    const data = await response_period.text();
    const obj = JSON.parse(data);
    console.log(obj.length);



    for (var i = 0; i < obj.length; i++) {
        var date = obj[i].date.replace("T", " ")
        xlabel.push(date.slice(0, date.length - 5));

        ytemps.push(obj[i].temperature);
        yhumidity.push(obj[i].humidity);
    }


    
    chart_temperature.config.data.labels = xlabel;
    chart_temperature.config.data.datasets.forEach((dataset) => {
        dataset.data = ytemps;
    });
    
    chart_temperature.update();

    chart_humidity.config.data.labels = xlabel;
    chart_humidity.config.data.datasets.forEach((dataset) => {
        dataset.data = yhumidity;
    });
    
    chart_humidity.update();

       

}


filterDate();
getData();
getSelectValue();

setInterval(refreshData, 1000);

setInterval(getData, 60000);
//refresh();