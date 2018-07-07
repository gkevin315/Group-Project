
var ticketMasterAPIkey = '3KM0vy3D2FmO3jenjLVFjqLyfQUwxe34';
var queryUrl = '';
var keyword = '';
var city = '';
var startDate = '';
var endDate = '';

$(document).ready(function () {


    $(document).on('click', '#search-button', function (event) {
        event.preventDefault(); //prevent page refresh
        convertDateFormat(); // converts the date format to the required form for ticketmaster
        buildTicketmasterUrl(); //build the query url
        callTicketMasterAPI (); //call the ticketmaster API and return and format data



    
    });

});//close document ready





////////////////////////////////
//Called Functions Section
////////////////////////////////

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
//Call the ticketmaster API and returns the necessary data in 
//the forme needed for the open weather API

function callTicketMasterAPI () {
    ///call to TicketMaster API
    $.ajax({
        type: "GET",
        url: queryUrl,
        async: true,
        dataType: "json",
        success: function (json) {
            console.log(json);
            // Parse the response.
            // Do other things.


            //var tickmasterReturn = JSON.parse(json);
            var events = json._embedded.events; //stores event array from json returned from API
            console.log(events); // outputs array of events
            console.log(events[0].name); //outputs name of event, cycle through events and check length of events array likely needed
            console.log(events[0]._embedded.venues[0].name);// ouputs the name of the venue, more venues could exist. check output for tours as needed
            console.log(events[0]._embedded.venues[0].city.name); // outputs city name of venue
            console.log(events[0]._embedded.venues[0].state.name); //outputs state where venue is located
            console.log(events[0]._embedded.venues[0].postalCode); //outputs zip / post code of venue
        },
        error: function (xhr, status, err) {
            // This time, we do not end up here!
        }
    });// end ajax call to TicketMaster

};