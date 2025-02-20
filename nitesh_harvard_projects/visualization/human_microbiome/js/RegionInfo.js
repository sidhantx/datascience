var regionData = [
    {
        "region":"CentralEurope",
        "countries":['Slovakia','Slovenia','Germany','Poland','Austria','Switzerland',
            'Liechtenstein','Hungary'],
        "color":"#525252"

    },

    {
        "region":"Scandinavia",
        "countries":['Denmark','Norway','Sweden'],
        "color" :"#979797"
    },

    {
        "region":"SouthEurope",
        "countries":['Croatia','Portugal','Spain','Andorra','San Marino','Vatican','Italy','Malta',
            'Bosnia and Herzegovina','Montenegro','Serbia','North Macedonia','Albania','Greece'],
        "color":"#696969"
    },

    {
        "region":"UKIE",
        "countries":['United Kingdom','Ireland'],
        "color":"#808080"
    },


    {
        "region":"EasternEurope",
        "countries":['Belarus','Czechia',
            'Bulgaria','Romania','Moldova','Ukraine','Russia'],
        "color":"#C5C5C5"
    },

    {
        "region":"US",
        "countries":["United States of America"],
        "color":"#3B3B3B"
    }

]

var region_key = ["US","EasternEurope","UKIE","SouthEurope","Scandinavia","CentralEurope"];
var bmi_key = ['obese', 'lean', 'underweight', 'overweight'];
var age_key = ['18-30', '50+', '31-50'];
var gender_key = ['male', 'female'];

var dietMicorbiomeText = [
    {
        "key":"Nationality",
        "text": "Samples in our dataset shows that US has the lowest average microbiome diversity as measured by shannon" +
            "diversity index. It also has the lowest richness of microbiome as measured by chao, and " +
            "also has the lowest diversity coverage index. Meanwhile Eastern European from our sample" +
            "rank high in all the three metrics. Eastern European diet consists of Whole grains, feremented" +
            "drink such as Kefir. There diet consists of minimum processed food, and sugar. In comparision diet in US" +
            "consist of less fiber, and more processed foods."
    }
    ,
    {
        "key": "BMI_group",
        "text": "Sample in our dataset shows that obese people are low in average microbiome diversity," +
            " richness, and have low" +
            "coverage of microbiome as compared to peple with lower BMI. Both diet and excercise play a role in " +
            "maintaining a good BMI."
    },
    {
        "key": "age_group",
        "text": "Samples in our dataset shows that younger people have higher average microbiome diversity as compared to"+
        "middle aged and older people."

    },

    {
        "key":"Sex",
        "text": "Samples in our data show that  gender seems to affect diversity of microbiome. Our data shows"+
            "that female generally have higher average diversity of microbiome and also have higher average coverage of " +
            "microbiome. Male have slightly higher richness of microbiome on average."
    }

]

var evennessMicorbiomeText = [
    {
        "key":"Nationality",
        "text": "Samples in our dataset shows that US has the lowest average microbiome evenness as measured as measured " +
            "by evenness pileou index. US also has the highest average inequality in microbiome as measure by gini inequality" +
            "index."
    }
    ,
    {
        "key": "BMI_group",
        "text": "Sample in our dataset shows that lean person have high microbiome evenness as compared to other groups." +
            "Lean person also has the lowest inequality in microbiome on average."
    },
    {
        "key": "age_group",
        "text": "Samples in our dataset shows that younger people have high microbiome evenness  as compared to"+
            "middle aged and older people. They also have the lowest inequality in microbiome."

    },

    {
        "key":"Sex",
        "text": "Samples in our data show that male have more evenness in their gut microbiome on average " +
            "as compared to female." +
            "Both have similar gini inequality on average."
    }

]



var mapCategoryToName = {"Nationality":"Region", "BMI_group":"BMI", "age_group":"Age","Sex":"Gender"};
