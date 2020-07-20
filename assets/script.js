$("#atlanta").on("click", function() {
    var forecast = "forecast"
    var queryURL = "http://api.openweathermap.org/data/2.5/" + forecast + "?q=Atlanta&appid=70be54f6a0da84bd714c708afbf682a7&units=imperial"
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
        console.log(response);
        $("#city").text(response.city.name);
        $("#weather-icon").attr("src", "https://openweathermap.org/img/wn/" + response.list[0].weather[0].icon + "@2x.png")
        $("#current-temp").text(response.list[0].main.temp);
        $("#current-humidity").text(response.list[0].main.humidity);
        $("#current-wind").text(response.list[0].wind.speed);
        lat = response.city.coord.lat
        lon = response.city.coord.lon
        var uviURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily&appid=70be54f6a0da84bd714c708afbf682a7"

        // separate ajax request just for the UVI
        $.ajax({
          url: uviURL,
          method: "GET"
        }).then(function(response) {
            console.log(response);
            $("#current-uv").text(response.current.uvi)
            if (response.current.uvi > 11) {
              $("#current-uv").addClass("btn btn-danger")
            } else {
              $("#current-uv").addClass("btn btn-success")
            }
        });
    });
  });

  // + response.list[0].weather[0].icon + 