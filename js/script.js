/** When the submit button is clicked it fetches flight data and displays it */
document.getElementById("flightSubmit").addEventListener("click", function(event){
    event.preventDefault();
    getFlights();
});

/** Calls the Space Devs API to get info on upcoming rocket launches */
function getFlights(){
    const input = document.getElementById("flightInput").value;
    const search = (input.replace(" ", "%20")).toLowerCase();
    const url = "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?search=" + search +"&is_crewed=false&include_suborbital=true&related=false&hide_recent_previous=false";
    fetch(url)
        .then(function(response) {
            return response.json();
        }).then(function(json) {
            console.log(json);
            if(json.detail != null){
                throw new Error("Error: " + json.detail);
            }
            document.getElementById("flightInfo").innerHTML = fillFlghtData(json);
        }).catch(function handleError(error){
            document.getElementById("errorLog").innerHTML = error.message;
        });
}

/** Displays an image, and information about upcoming flights */
function fillFlghtData(json){
    var data = '';
    if(json.results == null){
        data += '<p>Sorry there are no upcoming flights from ' + document.getElementById("flightInput").value; + '</p>';
    }
    document.getElementById("errorLog").innerHTML = "";
    data += '<h3 class = "text-center" >Upcoming Flights</h3>';
    for(var i = 0; i < (json.results).length; i++){
        data += '<div class = "container mt-3 mt-5">';
        data += '<h4 class = "text-center"><b>Flight Time:</b> '+ toDateTime(json.results[i].net) + '</h4>';
        data += '<div class = "row d-flex align-items-center">';
        data += '<div class = "col-md-6 col-sm-12 center-elem">';//Start of Flight Data Column
        data += '<ul class = "list-group list-group-flush">'
        data += '<li class = "list-group-item hourly"><b>Company:</b>  ' + json.results[i].launch_service_provider.name;
        if(json.results[i].launch_service_provider.type != null){
            data+= ' - ' + json.results[i].launch_service_provider.type + '</li>'
        }
        else {
            data +='</li>';
        }
        data += '<li class = "list-group-item hourly"><b>Launch Location:</b>  <a href = "' + json.results[i].pad.map_url + '">' + json.results[i].pad.location.name + '</a></li>';
        data += '<li class = "list-group-item hourly"><b>Launch Pad Name:</b>  ' + json.results[i].pad.name  + '</li>';
        data += '<li class = "list-group-item hourly"><b>Rocket:</b>  <a href = "' + json.results[i].rocket.configuration.url + '">' + json.results[i].rocket.configuration.full_name + '</a></li>';
        data += '<li class = "list-group-item hourly"><b>Current Launch Status:</b>  ' + json.results[i].status.name + '</li>';
        if(json.results[i].holdreason != ""){
            data += '<li class = "list-group-item hourly"><b>Launch Hold Reason:</b>  ' + json.results[i].holdreason + '</li>';
        }
        if(json.results[i].failreason != ""){
            data += '<li class = "list-group-item hourly"><b>Failed To Launch Reason:</b>  ' + json.results[i].failreason + '</li>';
        }
        if(json.results[i].mission != null){
            data += '<li class = "list-group-item hourly"><b>Mission ID:</b>  ' + json.results[i].mission.name + '</li>';
            data += '<li class = "list-group-item hourly"><b>Orbit Path:</b>  ' + json.results[i].mission.orbit.name + '</li>';
        }
        data += '<li class = "list-group-item hourly"><a href = "' + json.results[i].launch_service_provider.url + '"><b>Book Now</b></a></li>';
        data += '</ul>'//Closes Flight Data List
        data += '</div>'//Closes Flight Data Column
        data += '<div class = "col-md-6 col-sm-12 center-elem"><img class = "img-block" alt = "rocket" src = "' + json.results[i].image+ '"/></div>';
        data += '</div>'//Closes Info and Img Row
        data += '</div>'; //Close the Flight Div
    }
    return data;
}

/** Parses returns the date a string */
function toDateTime(dateInfo) {
    var months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const year = dateInfo.substring(0,4);
    const month = months[parseInt(dateInfo.substring(5,7)) - 1];
    const date = dateInfo.substring(8,10);
    var hr = parseInt(dateInfo.substring(11,13));
    var min = parseInt(dateInfo.substring(14,16));
    if (min < 10) {
        min = "0" + min;
    }
    var ampm = "AM";
    if( hr > 12 ) {
        hr -= 12;
        ampm = "PM";
    }
    if( hr == 0){
        hr = 12;
    }
    return month + " " + date + ", " + year + " " + hr + ":" + min + " " + ampm + " UTC";

}