/////////////////////////////////////////////////
//Global variables
/////////////////////////////////////////////////
var ticketMasterAPIkey = '3KM0vy3D2FmO3jenjLVFjqLyfQUwxe34';
var queryUrl = '';
var keyword = '';
var city = '';
var startDate = '';
var endDate = '';
var eventsArray = [];

$(document).ready(function () {



    //1. Takes keyword input from search input and send it to the ticketmaster API
    //2. Returns data from ticketmaster API and sends locatino info to openWeather API
    //3. Returns weather info from openWeather API
    $(document).on('click', '#search-button', function (event) {
        event.preventDefault(); //prevent page refresh

        

        //Call the ticketmaseter API and return results
        buildTicketmasterUrl(); //build the query url
        callTicketMasterAPI(); //call the ticketmaster API and return and format data


        //Weather API call is in the callTicketMaster API to allow .done to be used on the AJAX



    });

});//close document ready





///////////////////////////////////////////////////
//Called Functions Section
//////////////////////////////////////////////////

//Formats the date input to the format ticketmaster requires

function convertDateFormat() {

    ///use moment js

}; // End convert data function



//Builds TicketMaster query URL

function buildTicketmasterUrl() {
    var keywordInput = $('#keyword-input').val();

    if (keywordInput == '') {
        keyword = '';
    } else {
        var keyword = '&keyword=' + keywordInput;
    };

    /////////////////////////
    //THIS SECTION IS FOR ADDITIONAL SEARCH PARAMETERS AS NEEDED

    // if (cityInput.val() == '') {
    //     city = '';
    // } else {
    //     var city = '&city=' /* + input from city field*/;
    // };

    // if (startDateInput.val() == '') {
    //     startDate = '';
    // } else {
    //     var startDate = '&startDateTime=' /*input from startDate in proper format*/
    // }

    // if (endDateInput.val() == '') {
    //     endDate = '';
    // } else {
    //     var endDate = '&endDateTime=' /*input from endDate in proper format*/
    // };

    //building the queryUrl
    // need to pull in information from inputs on the main page and put into the correct formats
    //date format is 2018-07-08T01:03:00Z using zulu (UTC / universal) time. Need to convert to local time


    queryUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=' + ticketMasterAPIkey + keyword + city + startDate + endDate;

}; //end build ticketmaster url


/////////////////////////////////////
//Call the ticketmaster API and return the necessary data in 
//the form needed for the open weather API

function callTicketMasterAPI() {
    ///call to TicketMaster API
    $.ajax({
        type: "GET",
        url: queryUrl,
        async: true,
        dataType: "json",
        success: function (json) {
            // Parse the response.
            // Do other things.


            //var tickmasterReturn = JSON.parse(json);
            var events = json._embedded.events; //stores event array from json returned from API

            //fill locations array from the json response

            for (var i = 0; i < 3; i++) { //limiting to 3 results for testing, use events.length in the future

                var event = {
                    name: events[i].name,
                    venueName: events[i]._embedded.venues[0].name,
                    eventCity: events[i]._embedded.venues[0].city.name,
                    eventState: events[i]._embedded.venues[0].state.name,
                    eventCountry: events[i]._embedded.venues[0].country.countryCode,
                    postalCode: events[i]._embedded.venues[0].postalCode,
                    url: events[i].url,
                    date: events[i].dates.start.localDate,
                    time: events[i].dates.start.localTime
                };

                eventsArray.push(event);

            };

        },
        error: function (xhr, status, err) {
            // This time, we do not end up here!
        }
    }).done(callOpenWeatherAPI);// end ajax call to TicketMaster, and call the weather API upon completion

};


/////////////////////////////////////
//Call the openweather API and return the necessary data

function callOpenWeatherAPI() {

    //loop through event and list its weather


    for (i = 0; i < 1; i++) {
        ; //currently only set to pull one city for testing, use events.length in the future
        
        //build the open weather API key
        var openWeatherAPIkey = 'a9766e37e0c762d383eac53e362bd391';


        var weatherCity = eventsArray[i].eventCity;
        var weatherCountry = eventsArray[i].eventCountry;

        var queryURL = 'https://api.openweathermap.org/data/2.5/forecast?q=' + weatherCity + ',' + weatherCountry + '$units=imperial' + '&APPID=' + openWeatherAPIkey;

        //Call the open wether API
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {

            //make weather results more manageable by pulling out only the array of forecast data
            var weatherArray = response.list

            //loop through each event in the events array and input weather data

            for (var i = 0; i < eventsArray.length; i++) {

                //convert event time to the weather forecast time 3hr window where the event falls
                var eventTime = eventsArray[i].time;

                //get hour of event only
                eventTime = eventTime.substr(0, 2);

                //converting hour into a number
                eventTime = parseInt(eventTime);

                //set the hour to the 3hr window beginning required for the weather app
                var remainder = eventTime % 3;
                var weatherTime = eventTime - remainder;

                //set date and time format needed to search the weather app
                var eventDate = eventsArray[i].date;
                var weatherDateTime = eventDate + ' ' + weatherTime + ':00:00';
                console.log(weatherDateTime);
                


                //search for the correct forecast window in the weather array

                for (var j = 0; j < weatherArray.length; j++) {
                    if (weatherArray[j].dt_txt == weatherDateTime) {

                        console.log('true');
                        eventsArray[i].description = weatherArray[j].weather[0].description; //this section will say light rain, scattered clouds, etc...
                        eventsArray[i].temp = parseInt(weatherArray[j].main.temp_max);
                
                    } else if (!eventsArray[i].hasOwnProperty('description')) {
                        eventsArray[i].description = "Forecasts are only available for 5 days from the current date, or the server is unavaiable";
                        eventsArray[i].temp = 'Unavailable';
                    };
                };

                console.log(eventsArray);
            };

        }).done(); //end response function

    };
};



//Ticketmaster date format
//YYYY-MM-DDTHH:mm:ssZ