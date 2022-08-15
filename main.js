ChartIt();
//getData();
function ChartIt(){
(async () => {    
const data  = await  getData();
const ctx = document.getElementById('chart').getContext('2d'); 

const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: data.xlabel,//['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: 'Global Average Temperature',
            data: data.ytemps,
            fill : false,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)'],
            borderColor: [
                'rgba(255, 99, 132, 1)' ],
            borderWidth: 1
        }]
    },
    options: {
        
        
        scales: {
            x: {

                display: true
                
            },
    y: {
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


 async function getData(){
    const xlabel = []; 
    const ytemps = [];    
    const response = await fetch("ZonAnn.Ts+dSST.csv");
    //const response = await fetch("test.csv");
    const data = await response.text();
    //console .log(data);
    
    const table = data.split("\n").slice(1);
    //const rows = data.split("\n").slice(1);

    table.forEach(row => {
        const columns = row.split(",");
        const year = columns[0];
        xlabel.push(year);
        const temp = columns[1];
        ytemps.push(parseFloat(temp) + 14);
        console .log(year, temp);
        
    });
   return {xlabel, ytemps};
}
