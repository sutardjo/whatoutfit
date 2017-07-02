// ---------- Data Modifications --------- //

function search() {
	var query = 'jeans mens outfit';
	var searchURL = "https://www.googleapis.com/customsearch/v1"
	$.getJSON (searchURL, {
		key: 'AIzaSyDGxqdIPIRPqXoGiDsXHNleEU2459qO_Lc',
		cx: '010388424445370661145:wlbdx95zxku',
		searchType: 'image',
		q: query,
	}, function(data) {
		console.log(data);
	})
}

// search();