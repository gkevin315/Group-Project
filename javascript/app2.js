///call to TicketMaster API



$(document).ready(function() {

queryUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey=' + ticketMasterAPIkey + keyword + city + startDate + endDate;
console.log(queryUrl);

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
}); // end API config

}); //end document ready