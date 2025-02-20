// init global variables & switches
let
    myPieVisCottageCheese,
    myPieVisKefir,
    myPieVisSauerkraut;


// load data using promises
let promises2 = [
    d3.csv("data/fermentedPie.csv"),
    d3.csv("data/FermentedFoodsPie.csv")
];



Promise.all(promises2)
    .then( function(data){ initMainPage2(data) })
    .catch( function (err){console.log(err)} );

function initMainPage2(dataArray2) {

    // log data
    console.log('check out the data', dataArray2);
    // init map

    myPieVisCottageCheese = new PieVis('CottageCheese', dataArray2[1]);
    myPieVisKefir = new PieVis('Kefir', dataArray2[1]);
    myPieVisSauerkraut = new PieVis('Sauerkraut', dataArray2[1]);

}










