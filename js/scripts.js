var metric = true;
var urls = '';
var geocoder;
var city = '';
var items= {};

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
} 
//Get the latitude and the longitude;
function successFunction(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  updateLocation(lat, lng);
}

function errorFunction(){
  alert("Geocoder failed");
}

function updateLocation (lat, lng) {
  var metric_url = metric ? '&units=metric' : '&units=imperial';
  urls = 'https://api.apixu.com/v1/current.json?key=1ad49f8106594b0688d03548170901&q=' + lat + ' ' + lng;
  $.ajax({
    url: urls,
    dataType: "json"
  }).done(function(data) {
    //put JSON data into items object
    var items = createItemsObject(data);
    console.log(items);
    updateUI(items);
  });
}

function createItemsObject(data) {
  $.each( data, function( key, val ) {
    items[key] = val;
  });
  return items;
}

function updateUI(items) {
    //insert Local Weather Data
    $("#city").text(items.location.name + ', ' + items.location.region);
    $("#temp").text(metric ? items.current.temp_c + " °C" : items.current.temp_f + " °F");
    $("#description").text(items.current.condition.text);
    $("#icon").attr("src", 'http:' + items.current.condition.icon);
    $("#windspeed").text("Speed: " + (metric ? items.current.wind_kph + " kph" : items.current.wind_mph + " mph"));
    $("#winddir").text("Direction: " + items.current.wind_dir);
    $("#humidity").text(items.current.humidity + "%");
    $("body").fadeIn(1000);
}

$( document ).ready(function() {
  $("body").hide();
  $("button").on('click', function () {
    metric = !metric;
    updateUI(items);
  });
});