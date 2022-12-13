// function getting the address from json and adding the corresponding latitude and longitude to it
export async function GeocodeAddress(json){
    json = JSON.parse(json);
    
    for (let row in json) {
        // using free geocode.maps.co API limited to 10 requests per second
        let res = await fetch('https://geocode.maps.co/search?q='+json[row]["address"]);
        let response = await res.json();
        if (res['status'] === 200 && response.length > 0){
            let data = response[0];
            let latitude = data['lat'];
            let longitude = data['lon'];
            json[row]['latitude'] = latitude;
            json[row]['longitude'] = longitude;
        } else {
            json[row]['latitude'] = "NAN";  // not a number
            json[row]['longitude'] = "NAN";
        }
    }
    return JSON.stringify(json);
}