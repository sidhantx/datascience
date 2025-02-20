/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */


let configs = [
    {key: "diversity_shannon", title: "Diversity Index"},
    {key: "chao1", title: "Richness Index"},
    {key: "evenness_pielou", title: "Evenness Index"},
    {key: "coverage_index", title: "Coverage Index"},
    {key: "gini_inequality", title: "Gini Inequality"}
];


let selectedCategory =  "Nationality";
let barCharts = [];
let myMapVis, scatterBubbleVis, lollipopEvenness,
    lollipopInequality, diversityDescription, myMapDomVis, beesSwarmVis,
    matrixVis;
let selectedCategoryEven = 'Nationality';
let selectedCategoryBees = 'Nationality';
var selectedCategoryMap = "";
var evennessChart ='Avg.Evenness Pileou';
var inequalityChart ='Avg.Gini Inequality';

let configs3 = [
    {key: "IL6", title: "IL6"},
    {key: "ClassicalMonoctyles", title: "ClassicalMonoctyles"},
    {key: "NonClassicalMonocytes", title: "NonClassicalMonocytes"},
    {key: "GH10", title: "GH10"},
    {key: "GH23", title: "GH23"},
    {key: "GH43", title: "GH43"}
];
let IL6, ClassicalMonoctyles,NonClassicalMonocytes, GH10, GH23, GH43;


function updateAllVisualizations(){

    myMapVis.wrangleData()
}
let data;


// load data using promises
let promises = [
    d3.json("data/countries-50m.json"),
    d3.csv("data/cleaned_hitchip.csv", data => {
        data.gini_inequality = +data.gini_inequality;
        data.diversity_shannon = +data.diversity_shannon;
        data.chao1 = +data.chao1;
        data.diversity_coverage = +data.diversity_coverage;
        data.evenness_pielou = +data.evenness_pielou
        data.coverage_index = +data.coverage_index;

        return data;
    }),
    d3.csv("data/dominant_bacteria_region.csv", data => {

        data.genus_mean = +data.genus_mean;
        data.keyVal = +data.keyVal;
        data.rank = +data.rank;
        data.bacteria_id = +data.bacteria_id;
        return data;
    }),

    d3.csv("data/dominant_bacteria_bmi.csv", data => {

        data.genus_mean = +data.genus_mean;
        data.keyVal = +data.keyVal;
        data.rank = +data.rank;
        data.bacteria_id = +data.bacteria_id;
        return data;
    }),

    d3.csv("data/dominant_bacteria_age.csv", data => {

        data.genus_mean = +data.genus_mean;
        data.keyVal = +data.keyVal;
        data.rank = +data.rank;
        data.bacteria_id = +data.bacteria_id;
        return data;
    }),

    d3.csv("data/FermentedFiberLollipop1.csv", data => {
        data.IL6 = +data.IL6;
        data.ClassicalMonoctyles = +data.ClassicalMonoctyles;
        data.NonClassicalMonocytes = +data.NonClassicalMonocytes;
        data.GH10 = +data.GH10;
        data.GH23 = +data.GH23;
        data.GH43 = +data.GH43;
        return data;
    })


];

Promise.all(promises)
    .then( function(data)
    {
        console.log("Calling Init");
       initMainPage(data)
        //console.log(data[2]);

    })
    .catch( function (err){console.log(err)} );

// initMainPage
function initMainPage(allDataArray) {

    console.log(allDataArray);
    // activity 2, force layout
    myMapVis = new MapVis(document.getElementById('mapDiv'), allDataArray[0], allDataArray[1]
    , configs[0]);

    scatterBubbleVis = new ScatterBubbleVis(document.getElementById('scatterHitDiv'),
        allDataArray[1], configs );

    lollipopEvenness = new LollipopVis(document.getElementById('lollipop_evenness'),
        allDataArray[1], configs[2],evennessChart);

    lollipopInequality = new LollipopVis(document.getElementById('lollipop_inequality'),
        allDataArray[1], configs[4],inequalityChart);

    matrixVis = new MatrixVis(document.getElementById('beesDominantMatrix'),
        allDataArray[2], allDataArray[3], allDataArray[4]);

    IL6 = new LollipopVis3(document.getElementById('IL6'),
        allDataArray[5], configs3[0]);

    ClassicalMonoctyles = new LollipopVis3(document.getElementById('ClassicalMonoctyles'),
        allDataArray[5], configs3[1]);

    NonClassicalMonocytes = new LollipopVis3(document.getElementById('NonClassicalMonocytes'),
        allDataArray[5], configs3[2]);

    GH10 = new LollipopVis3(document.getElementById('GH10'),
        allDataArray[5], configs3[3]);

    GH23 = new LollipopVis3(document.getElementById('GH23'),
        allDataArray[5], configs3[4]);

    GH43 = new LollipopVis3(document.getElementById('GH43'),
        allDataArray[5], configs3[5]);

}

function categoryChange(requestor) {

    console.log(requestor);
    if(requestor != 'map')
    {
        selectedCategoryMap ="";
        selectedCategory = requestor;
    }
    scatterBubbleVis.wrangleData();

}


function evennessInequalityChange(event)
{
    selectedCategoryEven = event;
    lollipopInequality.wrangleData();
    lollipopEvenness.wrangleData();

}

function beeswarmChange(event)
{
    selectedCategoryBees = event;
    matrixVis.wrangleData();
}



