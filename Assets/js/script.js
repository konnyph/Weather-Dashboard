//global variables
var apiKey = "843fa40ad68a96668befb0da86d9b44b"
var city = "raleigh"
var currentConditions = "https://api.openweathermap.org/data/2.5/weather?appid="
var fiveDay =
  "https://api.openweathermap.org/data/2.5/forecast?4e5dbe7db2b5e9c8b47fa40b691443d5q={city name},{country code}"
var uvIndex =
  "https://api.openweathermap.org/data/2.5/uvi?appid={appid}&lat={lat}&lon={lon}"
var searchedArr = JSON.parse(localStorage.getItem("searchedItems")) || [];


//taking in user input, and passing the value into a variable
$(document).ready(function() {
  $("#search-input").on("click", function(event) {
    var userInput = $("#city-search").val()
    console.log(userInput)
    getWeather(userInput)
  
  })
})

// userInput is passed into the getWeather function as arguement 'cityName'
function getWeather(cityName) {
  var apiCall = ""

  if (cityName !== "") {
    apiCall = currentConditions + apiKey + "&q=" + cityName
    //return apiCall;
  } else {
    apiCall = currentConditions + apiKey + "&q=" + city
    //return apiCall;
  }

  $.ajax({
    url: apiCall,
    method: "GET"
  }).then(function(response) {
    console.log(response)
    var feelslike = response.main.temp
    feelslike = (feelslike - 273.15) * 1.8 + 32
    feelslike = Math.floor(feelslike)
    city = response.name
    $("#current-weather").append("<div>" + feelslike + "</div>")
    $("#current-weather").append("<div>" + city + "</div>")
    fiveDay = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`
    $("#current-weather").append("<img src='http://openweathermap.org/img/wn/"+response.weather[0].icon+"@2x.png'>")
     $.ajax({
      url: fiveDay,
      method: "GET"
    }).then(function(response) {
      console.log(response)

      var averageTemp = 0
      var previousdate = ""
      var count = 0
      var results = 0
      previousdate = moment().format("MM/DD/YYYY")
      for (let index = 0; index < response.list.length; index++) {
        var currentDate = moment(response.list[index].dt, "X").format(
          "MM/DD/YYYY"
        )
        var temp = response.list[index].main.temp
        temp = (temp - 273.15) * 1.8 + 32
        temp = Math.floor(temp)
        console.log(currentDate)
        console.log(temp)

        if (previousdate === currentDate) {
          averageTemp = averageTemp + temp
          count++
          previousdate = currentDate
        } else {
          results = averageTemp / count
          results = Math.floor(results)
          console.log("results:", results)
          var card = $("<div class = 'card col-sm-2'>")

          var div1 = $("<div class= 'card-header'>")
          // div1.append("Date" + '' + currentDate)
          div1.append(currentDate)
          card.append(div1)
          // $("#current-weather").append("<img src='http://openweathermap.org/img/wn/"+response.weather[0].icon+"@2x.png'>")
          var div2 = $("<div class= 'card-body'>")
          div2.append("Average Temperature:" + results)
          card.append(div2)

          var div3 = $("<dic class = 'card-body'>")
          div3.append("<img src='http://openweathermap.org/img/wn/"+response.list[index].weather[0].icon+"@2x.png'>")
          card.append(div3)
       
          $("#five-day").append(card)

          count = 0
          averageTemp = 0
          previousdate = currentDate



         
        }
      }
    })
  })
}