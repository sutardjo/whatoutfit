// ---------- Data Modifications --------- //

function getWeather() {
	var zipCode = 60611;
	var weatherURL = "http://api.openweathermap.org/data/2.5/forecast/daily"
	$.getJSON (weatherURL, {
		APPID: 'd2983c207d7bba0a41970abc13d15005',
		zip: zipCode,
	}, function(data) {
		console.log(data);
		generateWeatherArray(data);
	})
}

function generateWeatherArray(data) {
	var weatherToday = {};
	var weatherTomorrow = {};
	weatherToday.city = data.city.name;
	weatherToday.dayTemp = data.list[1].temp.day;
	weatherToday.description = data.list[1].weather[0].main;
	weatherTomorrow.city = data.city.name;
	weatherTomorrow.dayTemp = data.list[2].temp.day;
	weatherTomorrow.description = data.list[2].weather[0].main;
	console.log(weatherToday);
	console.log(weatherTomorrow);
}

// getWeather();
