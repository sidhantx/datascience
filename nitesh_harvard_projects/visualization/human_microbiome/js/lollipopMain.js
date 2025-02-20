/* * * * * * * * * * * * * *
*           MAIN           *
* * * * * * * * * * * * * */


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
let data3;





// load data using promises
let promises3 = [
    d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"),
    d3.csv("data/FermentedFiberLollipop1.csv", data3 => {
        data3.IL6 = +data3.IL6;
        data3.ClassicalMonoctyles = +data3.ClassicalMonoctyles;
        data3.NonClassicalMonocytes = +data3.NonClassicalMonocytes;
        data3.GH10 = +data3.GH10;
        data3.GH23 = +data3.GH23;
        data3.GH43 = +data3.GH43;
        return data3;
    })
];

Promise.all(promises3)
    .then( function(data3)
    {
        console.log("Calling Init");
        console.log(data3);
        initMainPage3(data3)



    })
    .catch( function (err){console.log(err)} );

// initMainPage
function initMainPage3(allDataArray3) {

    IL6 = new LollipopVis3(document.getElementById('IL6'),
        allDataArray3[1], configs3[0]);

    ClassicalMonoctyles = new LollipopVis3(document.getElementById('ClassicalMonoctyles'),
        allDataArray3[1], configs3[1]);

    NonClassicalMonocytes = new LollipopVis3(document.getElementById('NonClassicalMonocytes'),
        allDataArray3[1], configs3[2]);

    GH10 = new LollipopVis3(document.getElementById('GH10'),
        allDataArray3[1], configs3[3]);

    GH23 = new LollipopVis3(document.getElementById('GH23'),
        allDataArray3[1], configs3[4]);

    GH43 = new LollipopVis3(document.getElementById('GH43'),
        allDataArray3[1], configs3[5]);


}






