// My two global variables
var searchHistory = [];
var currentDay = moment().format("(" + "M" + "/" + "D" + "/" + "YYYY" + ")");

searchHistory = JSON.parse(localStorage.getItem("listHistory")) || [];

// this For Loop appends all the searchHistory list items that were stored in localStorage
for (var i = 0; i < searchHistory.length; i++) {
  var a = $("<li>");
  a.addClass("list-group-item");
  a.click(searchClick);
  a.text(searchHistory[i]);
  $("#search-history").append(a);
}

// this function fires when the user clicks on the submit button while searching for a city
$("#find-city").on("click", function (event) {
  event.preventDefault(); // prevents refreshing the page after form is submitted

  var city = $("#city").val().trim(); // city captures the text that is entered into the input area

  $("#city").val(""); // after the form is submitted, the text are is emptied

  if (city === "") {
    alert("Your input cannot be blank")
    return;
  }

  // instead of duplicating a city, when the user types in the city name again, it will move the city to the top of the list
  searchHistory = searchHistory.filter(function (newCity) {
    return city.toLowerCase() !== newCity.toLowerCase()
  });

  searchHistory.unshift(city); // this adds the city to the beginning of the searchHistory array

  localStorage.setItem("listHistory", JSON.stringify(searchHistory)); // this stores the searchHistory array into localStorage

  $("#search-history").empty(); // this prevents duplicates in the searchHistory list

  // this For Loop appends an <li> to the searchHistory list. It also adds a click listener to each one for the searchClick function.
  for (var i = 0; i < searchHistory.length; i++) {
    var a = $("<li>");
    a.addClass("list-group-item");
    a.attr("id", searchHistory[i]);
    a.click(searchClick);
    a.text(searchHistory[i]);
    $("#search-history").append(a);
  }

  // this is where the main function, findCity, is called. 
  findCity(city);
});

// searchClick takes the textContent of the <li> the user clicks and passes that into the findCity function
function searchClick() {
  findCity(this.textContent);
}

function findCity(city) {
  var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=70be54f6a0da84bd714c708afbf682a7&units=imperial"
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    $("#5-day").empty();
    var image = response.list[0].weather[0].icon;
    var temp = response.list[0].main.temp;
    var humid = response.list[0].main.humidity;
    var wind = response.list[0].wind.speed;
    $("#city1").html(response.city.name + " " + currentDay);
    $("#weather-icon").attr("src", "https://openweathermap.org/img/wn/" + image + "@2x.png")
    $("#current-temp").text(temp);
    $("#current-humidity").text(humid);
    $("#current-wind").text(wind);
    var lat = response.city.coord.lat
    var lon = response.city.coord.lon

    // For Loop to Generate the 5-Day Forecast
    for (var i = 0; i < response.list.length; i++) {
      if (response.list[i].dt_txt.indexOf("12:00:00") !== -1) {
        var dateNum = response.list[i].dt_txt; // 2020-07-21 --> 07/21/2020
        var date = $("<h5>").text(dateNum.slice(6, 7) + "/" + dateNum.slice(8, 10) + "/" + dateNum.slice(0, 4));
        var card = $("<div>")
        var paragraph = $("<p>").text("Temp: " + response.list[i].main.temp + "F")
        var weatherIcon = $("<img>")
        card.append(date)
        card.append(weatherIcon);
        weatherIcon.attr("src", "https://openweathermap.org/img/wn/" + response.list[i].weather[0].icon + ".png")
        weatherIcon.addClass("img-fluid")
        card.append(paragraph);
        card.append("Humidity: " + response.list[i].main.humidity + "%")
        card.addClass("rounded bg-primary text-white p-1 col-sm-2")
        $("#5-day").append(card)
      }
    }

    var uviURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,daily&appid=70be54f6a0da84bd714c708afbf682a7"

    // separate ajax request just for the UVI
    $.ajax({
      url: uviURL,
      method: "GET"
    }).then(function (response) {
      $("#current-uv").text(response.current.uvi)
      // if the UV Index is greater than 11, the button will show red. If it is less than 11, it will show green. 
      if (response.current.uvi > 11) {
        $("#current-uv").removeClass("btn btn-success")
        $("#current-uv").addClass("btn btn-danger")
      } else {
        $("#current-uv").removeClass("btn btn-danger")
        $("#current-uv").addClass("btn btn-success")
      }
    });
  }).catch(function (error) {
    if (error) {
      alert("Sorry, not a valid city")
      searchHistory.shift();
      localStorage.setItem("listHistory", JSON.stringify(searchHistory));
      $("#" + city).remove();
    }
  })
};