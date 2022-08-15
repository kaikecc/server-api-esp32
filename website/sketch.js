

function ChartIt(){
(async () => {    
const data  = await  getData();
const ctx = document.getElementById('chart').getContext('2d'); 

const myChart1 = new Chart(ctx, {
    type: 'line',
    data: {
        labels: data.xlabel,//['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'Temperature of Environment',
            data: data.ytemps,
            fill : false,
            backgroundColor: [
                'rgba(0, 0, 255, 0.2)'],
            borderColor: [
                'rgba(0, 0, 255, 1)' ],
            borderWidth: 1
        }]
    },
    options: {
        maintainAspectRatio: false,
        
        
        scales: {
            x: {

                display: true
                
            },
            y: {
        beginAtZero: true,
        ticks: {
            // Include a dollar sign in the ticks
            callback: function(value, index, ticks) {
                return  value + '°C';
            }
        }
    }
}
}
  
});
    

    })();
    
   

}

 function ChartHumidity(){
    (async () => {    
    const data  = await  getData();
    const ctx = document.getElementById('chartHumidity').getContext('2d'); 
    
    const myChart2 = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.xlabel,//['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [{
                label: 'Humidity of Environment',
                data: data.yhumidity,
                fill : false,
                backgroundColor: [
                    'rgba(255, 0, 0, 0.2)'],
                borderColor: [
                    'rgba(255, 0, 0, 1)' ],
                borderWidth: 1
            }]
        },
        options: {
            respomsive: true,
            maintainAspectRatio: false,
            
            
            scales: {
                x: {
    
                    display: true
                    
                },
                y: {
                    min: 0,
                    max: 100,
            beginAtZero: true,
            ticks: {
                // Include a dollar sign in the ticks
                callback: function(value, index, ticks) {
                    return  value + '%';
                }
            }
        }
    }
    }
      
    });
    })();
    
    }


async function getData() { 

     
    
    const xlabel = []; 
     const ytemps = [];
    const yhumidity = []; 
    const response = await fetch("http://localhost:3000/temp");
    //const response = await fetch("test.csv");
     const data = await response.text();
     const obj = JSON.parse(data);
    
    const count = Object.keys(obj.DHT).length;
     console.log(count);

     document.getElementById('temp').textContent = obj.DHT[count-1].temperature;
     document.getElementById('humid').textContent = obj.DHT[count-1].humidity;
     
    var date = obj.DHT[parseInt(count)-1].date.replace("T", " ")
    //console.log(date.slice(0,date.length-5));
     
     for (var i = 0; i < obj.DHT.length; i++) {
        var date = obj.DHT[i].date.replace("T", " ")
         xlabel.push(date.slice(0,date.length-5));
         
         ytemps.push(obj.DHT[i].temperature);
            yhumidity.push(obj.DHT[i].humidity);
     }
    
    //const table = data.split("\n").slice(1);
    //const rows = data.split("\n").slice(1);

    // table.forEach(row => {
    //     const columns = row.split(",");
    //     const year = columns[0];
    //     xlabel.push(year);
    //     const temp = columns[1];
    //     ytemps.push(parseFloat(temp) + 14);
    //     console .log(year, temp);
        
    // });
   return {xlabel, ytemps, yhumidity};
}


function refresh() {    
    setTimeout(function () {
        location.reload()
       // location.href = "http://localhost:3000";
    }, 30000);
}



ChartIt();
ChartHumidity();


getData();

//setInterval(getData, 1000);


refresh();