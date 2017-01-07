var url = 'http://api.openweathermap.org/data/2.5/weather?q={los%20osos}&APPID=c01b7699362cd3dbd9ecbada007111a1';
$.getJSON( url, function( data ) {
  var items = {};
  $.each( data, function( key, val ) {
    items[key] = val;
  });
  $("#city").text(items.name);
  $("#temp").text(items.main.temp);
  console.log(items);
});