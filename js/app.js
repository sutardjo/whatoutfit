// ---------- State Declarations  --------- //

// Helps with pagination for Google Custom Search.
// This is incremented by 10 for displaying results on the next page.
// Starting at 0 indicates the first page of results.
var numPasses = 0;

// ---------- Data Modifications: Searches  --------- //

// Calls the weather API
function getWeather(zipcodeQuery, query) {
	var zipCode = zipcodeQuery;
	var weatherURL = "http://api.openweathermap.org/data/2.5/forecast/daily"
	var temperature;
	$.getJSON (weatherURL, {
		APPID: 'd2983c207d7bba0a41970abc13d15005',
		zip: zipCode,
	}, function(data) {
		temperature = data.list[1].temp.day;
		generateWeatherArray(data);
		searchImages(query, temperature); 
	})
}

// Calls search API for images
function searchImages(query, temperature) {
	var season;
	// sets season based on temperature. Season keyword is used in query.
	if (temperature >= 291.483) {
		season = 'summer';
	} else if (temperature < 291.483 && season > 280.372) {
		season = 'spring fall';
	} else if (temperature <= 280.372) {
		season = 'winter';
	}
	// this is the query that gets sent
	query = season + ' ' + query;
	var searchURL = "https://www.googleapis.com/customsearch/v1"
	// First page results call
	if (numPasses === 0) {
		$.getJSON (searchURL, {
		key: 'AIzaSyDGxqdIPIRPqXoGiDsXHNleEU2459qO_Lc',
		cx: '010388424445370661145:wlbdx95zxku',
		searchType: 'image',
		q: query,
	}, function(data) {
		generateOutfitArray(data);
	})	
	//subsequent pages results call
	} else {
		$.getJSON (searchURL, {
		key: 'AIzaSyDGxqdIPIRPqXoGiDsXHNleEU2459qO_Lc',
		cx: '010388424445370661145:wlbdx95zxku',
		searchType: 'image',
		q: query,
		start: numPasses
	}, function(data) {
		generateOutfitArray(data);
	})
	
}}

// ---------- Data Generate Objects  --------- //

function generateWeatherArray(data) {
	var weatherToday = {};
	weatherToday.city = data.city.name;
	weatherToday.dayTemp = data.list[1].temp.day;
	weatherToday.description = data.list[1].weather[0].main;
	displayWeather(weatherToday);
}

function generateOutfitArray(data) {
	var outfitResults = [];
	for (var i = 0; i < data.items.length; i++) {
		// push links
		outfitResults.push(data.items[i].link);
	};
	console.log(outfitResults);
	displayOutfits(outfitResults);
}

function generateSearchQuery(gender, clothingQuery, zipcodeQuery) {
	var query = clothingQuery + ' ' + gender + ' outfit fashion'
	getWeather(zipcodeQuery, query);
}

function generateNextPage() {
	numPasses = numPasses + 10;
    var gender = $('input[name=gender]:checked').val(); 
    var clothingChoice = $('.js-parameters').find('#clothingChoice');
    var clothingQuery = clothingChoice.val();
    var zipcode = $('.js-parameters').find('#zip');
    var zipcodeQuery = zipcode.val();
    // remove undefined from clothingQuery if not specified
	if (clothingQuery === undefined) {
		clothingQuery = ' ';
	}
    generateSearchQuery(gender, clothingQuery, zipcodeQuery);

}

// ---------- Render Functions  --------- //


function displayWeather(weatherToday) {
	var farenheitTemp = Math.round((9/5)*(weatherToday.dayTemp - 273) + 32);
	var weatherTemplate = (
		'<div class="col-md-12 text-center weatherResults">' +
		'<h2>' + farenheitTemp + '° and ' + weatherToday.description + '</h2>' +
		'<p class="lead">In ' + weatherToday.city + '</p>' +
        '</div>'
		);
	$('.js-weather').html(weatherTemplate);
}

function displayOutfits(outfitResults) {
	$('#footer').remove();
	for (var i = 0; i < outfitResults.length; i++) {
      $('.js-outfits').append(
        '<div class="col-sm-6">' +
            '<a href="' + outfitResults[i] + '">' +
                '<div class="portfolio-item">' +
                    '<div class="item-caption"><i class="ion-android-search size-2x"></i></div>' +
                    '<div class="item-image"><img alt="#" src="' + outfitResults[i] + '" /></div>' +
                '</div>' +
            '</a>' +
        '</div>'
    )
  }
  renderLoadMoreButton();
}

function renderLoadMoreButton() {
	var loadMoreButtonTemplate = (
			'<br><div class="col-md-12 text-center">' +
			'<button type="submit" class="btn btn-primary btn-lg load-more-button">See More</button>' +
			'</div>'
		)
	$('.js-outfits').append(loadMoreButtonTemplate)
	watchLoadMore();
}

// ---------- Event Listeners --------- //

function watchLoadMore() {
	$('.load-more-button').click(function(event) {
		event.preventDefault;
		$('.load-more-button').remove();
		generateNextPage();
	})
}

function watchSubmit() {
  $('.js-parameters').submit(function(event) {
    event.preventDefault();
    // gets gender
    var gender = $('input[name=gender]:checked').val(); 
    // gets clothing query
    var clothingChoice = $(event.currentTarget).find('#clothingChoice');
    var clothingQuery = clothingChoice.val();
    // gets zip code
    var zipcode = $(event.currentTarget).find('#zip');
    var zipcodeQuery = zipcode.val();
    // remove undefined from clothingQuery if not specified
	if (clothingQuery === undefined) {
		clothingQuery = ' ';
	}
    generateSearchQuery(gender, clothingQuery, zipcodeQuery);
  });
}

watchSubmit();