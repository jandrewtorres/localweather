var metric = true;
var urls = '';
var items= {};

//Get the latitude and the longitude;
function successFunction(position) {
  var lat = position.coords.latitude;
  var lng = position.coords.longitude;
  updateLocation(lat, lng, false);
}

function errorFunction(){
  updateLocation(0, 0, true);
}

function getURL(lat, lng, mobile) {
  var key = '?key=1ad49f8106594b0688d03548170901';
  var base = 'https://api.apixu.com/v1/current.json';
  var loc = (mobile ? ('&q=auto:ip') : ('&q=' + lat + ' ' + lng));
  var url = base + key + loc;
  console.log(url);
  return url;
}

function updateLocation (lat, lng, mobile) {
  urls = getURL(lat, lng, mobile);
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

function convertTimestamp(unix_timestamp) {
  var date = new Date(unix_timestamp*1000);
  var hours = date.getHours() + 8;
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}

function updateUI(items) {
    //insert Local Weather Data
    $("#city").text(items.location.name + ', ' + items.location.region);
    $("#time").text(convertTimestamp(items.location.localtime_epoch));
    $("#temp").text(metric ? items.current.temp_c + " °C" : items.current.temp_f + " °F");
    $("#description").text(items.current.condition.text);
    $("#icon").attr("src", 'https:' + items.current.condition.icon);
    $("#windspeed").text("Speed: " + (metric ? items.current.wind_kph + " kph" : items.current.wind_mph + " mph"));
    $("#winddir").text("Direction: " + items.current.wind_dir);
    $("#humidity").text(items.current.humidity + "%");
    $("body").fadeIn(1000);
}

$( document ).ready(function() {
  $("body").hide();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
  } 
  $("button").on('click', function () {
    metric = !metric;
    updateUI(items);
  });
});