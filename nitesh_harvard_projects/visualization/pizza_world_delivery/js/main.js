

// DATASETS

// Global variable with 1198 pizza deliveries
console.log(deliveryData);

// Global variable with 200 customer feedbacks
// console.log(feedbackData.length);


// FILTER DATA, THEN DISPLAY SUMMARY OF DATA & BAR CHART

createVisualization();

function createVisualization() {

	/* ************************************************************
	 *
	 * ADD YOUR CODE HERE
	 * (accordingly to the instructions in the HW2 assignment)
	 * 
	 * 1) Filter data
	 * 2) Display key figures
	 * 3) Display bar chart
	 * 4) React to user input and start with (1)
	 *
	 * ************************************************************/


    // get the locatio and ordertype selected value
    let loc_selectBox = document.getElementById("location");
    let loc_selectedValue = loc_selectBox.options[loc_selectBox.selectedIndex].value;

    let order_selectBox = document.getElementById("order_type");
    let order_selectedValue = order_selectBox.options[order_selectBox.selectedIndex].value;


    let filtered_delivery_data = deliveryData;
    let filtered_feedback_data = feedbackData;

    // filter data based on the selected value. If all was selected,
    // do nothing i.e. use the full data.
    if (loc_selectedValue != 'all' ||  order_selectedValue !='all')
    {
        if (loc_selectedValue != 'all')
        {
            filtered_delivery_data = filtered_delivery_data.filter((value) => {
                return (value.area == loc_selectedValue)

            });
        }

        if (order_selectedValue != 'all')
        {
            filtered_delivery_data = filtered_delivery_data.filter((value) => {
                return value.order_type == order_selectedValue

            });
        }

        let temp_filtered_feedback_data = [];

        for(let i=0;i< filtered_delivery_data.length; i++)
        {

            let feedback = filtered_feedback_data.filter((value) =>{
                return value.delivery_id ==  filtered_delivery_data[i].delivery_id;
            });
            if (feedback.length >0) {
                temp_filtered_feedback_data.push(feedback[0]);
            }
        }

        filtered_feedback_data = temp_filtered_feedback_data;

    }
    //get the dataset summary from the filtered data
    let key_figures = get_key_figures(filtered_delivery_data, filtered_feedback_data);

    //draw barchart and update dataset summary
    renderBarChart(filtered_delivery_data)
    generate_key_figures_summary_table(key_figures)
}


function get_key_figures(delivery_data, feedback_data)
{

    /* ************************************************************
	 This function calculates the dataset summary, and return a list
	 with those values.
	 * ************************************************************/

    //create an object to store the values
    let key_figures = {
        num_pizza_delivery:0,
        num_all_deliv_pizza :0,
        avg_del_time :0,
        total_sales : 0,
        num_all_feedback_entries:0,
        num_feedback_low:0,
        num_feedback_medium:0,
        num_feedback_high:0
    };

    //Assign values to the object params

    key_figures.num_pizza_delivery = delivery_data.length;


    key_figures.num_all_deliv_pizza = delivery_data.reduce( (sum, curr) => sum + curr.count,0
    );

    key_figures.avg_del_time = delivery_data.reduce( (sum, curr) => sum + curr.delivery_time,0
    )/delivery_data.length;

    key_figures.avg_del_time = Math.round(key_figures.avg_del_time);

    key_figures.total_sales = delivery_data.reduce((prev, curr) => prev + curr.price,0);

    key_figures.total_sales = Math.round(key_figures.total_sales)

    key_figures.num_all_feedback_entries = feedback_data.length;

    key_figures.num_feedback_low = feedback_data.filter((value) =>{
        return value.quality =="low"
    }).length;

    key_figures.num_feedback_medium = feedback_data.filter((value) =>{
        return value.quality =="medium"
    }).length;

    key_figures.num_feedback_high = feedback_data.filter((value) =>{
        return value.quality =="high"
    }).length;

    //create an array of dataset summary data.
    const data_summary = [key_figures.num_pizza_delivery,key_figures.num_all_deliv_pizza,
    key_figures.avg_del_time,key_figures.total_sales, key_figures.num_all_feedback_entries,
    key_figures.num_feedback_high, key_figures.num_feedback_medium, key_figures.num_feedback_low];

    return data_summary
}

function generate_key_figures_summary_table(key_figures)
{
    /* ************************************************************
	 This function assigns the dataset summary values to index html
	 table .
	 * ************************************************************/

    let table_summary = document.getElementById("data-summary-table");
    let tblbody = document.getElementById("data-summary-body");

    //empty the tbody. The tbody is generated again based on the
    //user selected values
    while(tblbody.firstChild)
    {
        tblbody.removeChild(tblbody.firstChild);
    }

    // title for our dataset summary
    let data_summary_items = ['Total Pizza deliveries : ', 'Total Pizzas Delivered : ',
    'Avg.Delivery Time : ', 'Total Sales (USD) : ', 'Total Feedbacks Received :',
    'High Quality : ', 'Medium Quality :', 'Low Quality : '];

    for(let i=0;i<data_summary_items.length;i++)
    {
        const row = document.createElement("tr");
        const cell = document.createElement("td");
        const cell_text = document.createTextNode(`${data_summary_items[i]} ${key_figures[i]}`);
        cell.appendChild(cell_text);
        row.appendChild(cell);
        tblbody.appendChild(row)
    }
    table_summary.appendChild(tblbody)
}