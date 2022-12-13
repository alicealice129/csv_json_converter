// Function to convert a csv in text form to an array
function CsvToArray(csv_text, delimiter, quote_char) {
    //extracting data from text form: headers and csv rows
    let csv_headers = csv_text.slice(0, csv_text.indexOf("\n")).split(delimiter);
    let csv_data = csv_text.slice(csv_text.indexOf("\n") + 1).split('\n');
    
    //extracting csv cells from each lines of the csv
    let csv_array = [];
    for (let l in csv_data) {
        let csv_row = [];
        let item = '';
        let inQuotes = 0;
        for (let c in csv_data[l]) {
            //taking into account cells with quotes
            if (csv_data[l][c] === delimiter && !inQuotes) {
                item = item.trim();
                if (item[0] === quote_char) {
                    item = item.slice(1, item.length - 1);
                }
                csv_row.push(item.trim());
                item = '';
            } else {
                item += csv_data[l][c];
            }

            //handling quotes
            if (csv_data[l][c] === quote_char) {
                if (inQuotes) {
                    inQuotes = 0;
                } else {
                    inQuotes = 1;
                }
            }
        }

        csv_row.push(item.trim());
        csv_array.push(csv_row);
    }

    let res = Object();
    res.csv_array = csv_array;
    res.csv_headers = csv_headers;
    return res;
}


function ConvertCSVToJSON(csv_text) {
    csv_text = csv_text.trim();

    //converting csv text to array
    let csv_obj = CsvToArray(csv_text, ',', '"');
    let csv_array = csv_obj.csv_array;
    let csv_headers = csv_obj.csv_headers;

    // converting array to json using header and data arrays
    let json_data = [];

    for (let i = 0; i < csv_array.length; i++) {
        let item = {};
        for (let j = 0; j < csv_headers.length; j++) {
            item[csv_headers[j].toLowerCase()] = csv_array[i][j];
        }
        json_data.push(item);
    }

    //converting json object to string for output
    let res_json = JSON.stringify(json_data);

    return res_json;
}

//converting json string to csv string
function ConvertJSONToCSV(json) {
    json = json.replaceAll(/\r?\n/g,'');
    json = json.replaceAll('“', '"');
    json = json.replaceAll('”', '"');

    //parsing json to object
    try {
        var json_data = JSON.parse(json);
    } catch (error) {
        return false
    }

    //running through the json object and create an array
    let csv_headers = [];
    let csv_array = [];

    for(let i in json_data){
        let val = json_data[i];
        let csv_row = [];
        for(let j in val){
            let sub_key = j;
            if (!csv_headers.includes(sub_key)) {
                csv_headers.push(sub_key);
            }
            let index = csv_headers.indexOf(sub_key);
            csv_row[index] = val[j];
        }
        csv_array.push(csv_row);
    }

    //converting the array to csv text form
    let csv_text = "";
    for (let k in csv_headers){
        csv_text += csv_headers[k] + ',';
    }
    csv_text = csv_text.slice(0,csv_text.length-1) + '\n';
    
    for (let l in csv_array){
        for (let c in csv_array[l]) {
            let item = csv_array[l][c];
            if (item.includes(',')) {
                item = '"' + item + '"';
            }
            csv_text += item + ',';
        }
        csv_text = csv_text.slice(0,csv_text.length-1) + '\n';
    }

    return csv_text;
}

export {ConvertCSVToJSON, ConvertJSONToCSV};