var metric = true;
var urls = '';
var geocoder;
var city = '';

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
} 
//Get the latitude and the longitude;
function successFunction(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  codeLatLng(lat, lng)
}

function errorFunction(){
  alert("Geocoder failed");
}

function initialize() {
  geocoder = new google.maps.Geocoder();
}

function codeLatLng(lat, lng) {
  initialize();
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
      //find country name
        for (var i=0; i<results[0].address_components.length; i++) {
          for (var b=0;b<results[0].address_components[i].types.length;b++) {
          //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
            if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                //this is the object you are looking for
                city= results[0].address_components[2].long_name;
                break;
            }
          }
        }
      } else {
        alert("No results found");
      }
    } else {
      alert("Geocoder failed due to: " + status);
    }
    console.log(city);
    updateLocation(city, metric);
  });
}

function updateLocation (city) {
  var metric_url = metric ? '&units=metric' : '&units=imperial';
  urls = 'http://api.openweathermap.org/data/2.5/weather?q=' + city + metric_url + '&APPID=c01b7699362cd3dbd9ecbada007111a1';
  $.ajax({
    url: urls,
    dataType: "jsonp"
  }).done(function(data) {
    //put JSON data into items object
    var items = {};
    $.each( data, function( key, val ) {
      items[key] = val;
    });
    //insert Local Weather Data
    $("#city").text(items.name);
    $("#temp").text(items.main.temp + (metric ? " °C" : " °F"));
    $("#description").text(items.weather[0].description);
    $("#icon").attr("src", "http://openweathermap.org/img/w/" + items.weather[0].icon + ".png");
    $("#windspeed").text("Speed: " +items.wind.speed +(metric ? " mps" : " mph"));
    $("#winddir").text("Direction: " + items.wind.deg + " °");
    $("#humidity").text(items.main.humidity + "%");
  });
  $("body").fadeIn(1000);
}

$( document ).ready(function() {
  $("body").hide();
  $("button").on('click', function () {
    metric = !metric;
    updateLocation(city);
});
});