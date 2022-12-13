import React from 'react';
import Button from '@material-ui/core/Button';
import Stack from '@mui/material/Stack';
import { ConvertCSVToJSON, ConvertJSONToCSV } from '../lib/ConvertCsvJson';
import { GeocodeAddress } from '../lib/Geocode';

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            csv_text: '',
            json_text: ''
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleJsonChange = this.handleJsonChange.bind(this);
        this.onJsonToCsvClick = this.onJsonToCsvClick.bind(this);
        this.onCsvToJsonClick = this.onCsvToJsonClick.bind(this);
        this.onGeocodeClick = this.onGeocodeClick.bind(this);
    }

    handleChange(event) {
        this.setState({ csv_text: event.target.value });
    }
    handleJsonChange(event) {
        this.setState({ json_text: event.target.value });
    }

    // batch version requires professional API Key
    // geocodeAddress(json){
    //     json = JSON.parse(json);
    //     let batch = Array();
    //     for (let row in json) {
    //         console.log("row: ", json[row]);
    //         let item = {"query": json[row]["Address"]};
    //         batch.push(item);
    //         console.log("item: ", item);
    //     }

    //     let payload = {"batch": batch};
    //     console.log("payload: ", payload);
    //     fetch('https://api.positionstack.com/v1/forward?access_key=99988efa0f16d2eb05f7508e0c786bac',{
    //         method: 'post', 
    //         body: JSON.stringify(payload)
    //     })
    //     .then((response) => {
    //         // Code for handling the response
    //         console.log("response: ", response);
    //     })
    //     .catch((error) => {
    //         // Code for handling the error
    //         console.log("error: ", error);
    //     });
    // }

    downloadCSV(csv, filename){
        if (csv === ""){
            alert("Please enter valid csv content in the left text area and then press the button");
            return
        }
        let blob = new Blob([csv], { type: 'text/csv' });
      
        if (navigator && navigator.msSaveOrOpenBlob) {
          navigator.msSaveOrOpenBlob(blob, filename);
        } else {
          let dataURI = `data:text/csv;charset=utf-8,${csv}`;
      
          let URL = window.URL || window.webkitURL;
          let downloadURI =
            typeof URL.createObjectURL === 'undefined' ? dataURI : URL.createObjectURL(blob);
      
          let link = document.createElement('a');
          link.setAttribute('href', downloadURI);
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };

    onCsvToJsonClick() {
        if (this.state.csv_text === ""){
            alert("Please enter valid JSON in the right text area");
            return
        }
        this.setState({ json_text: ConvertCSVToJSON(this.state.csv_text) });
    }

    onJsonToCsvClick() {
        if (this.state.json_text === ""){
            alert("Please input a JSON string in the right text area");
            return
        }
        let csv = ConvertJSONToCSV(this.state.json_text);
        if (!csv) {
            alert('Please input a valid Json string in the right text area');
            return;
        }
        
        this.setState({ csv_text:  csv});
    }

    onGeocodeClick() {
        if (this.state.json_text === ""){
            alert("Please generate valid JSON");
            return
        }
        GeocodeAddress(this.state.json_text).then(
            response => {
                this.setState({ json_text: response });
                this.setState({ csv_text: ConvertJSONToCSV(response) });
            })
    }

    render() {
        return (
            <div>
                <Stack direction="row" spacing={2}>
                    <textarea placeholder="please paste the content of csv file" value={this.state.csv_text} onChange={this.handleChange} cols={90} rows={15} />
                    <Stack direction="column" alignItems="center" justifyContent="center" spacing={2}>
                        <Button variant="contained" color="secondary"
                            onClick={this.onCsvToJsonClick}
                        >
                            CSV → JSON
                        </Button>
                        <Button variant="contained" color="primary"
                            onClick={this.onJsonToCsvClick}
                        >
                            CSV ← JSON
                        </Button>
                        <Button variant="contained" color="inherit"
                            onClick={this.onGeocodeClick}
                        >
                            Geolookup
                        </Button>
                        <Button variant="outlined" color="default" size="small"
                        onClick={() => {
                            this.downloadCSV(this.state.csv_text, "result.csv");
                        }}
                        >
                            Download CSV
                        </Button>
                    </Stack>`
                    <textarea placeholder="please paste the content of JSON file" value={this.state.json_text} onChange={this.handleJsonChange} cols={90} rows={15} />
                </Stack>
                <div>
                </div>
            </div>
        );
    }
}

export default Form;