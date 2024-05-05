$(document).ready(function() {
    const checked_obj = {};

    function updateAmenities() {
	const names = Object.keys(checked_obj).sort();
	$('.amenities h4').text(names.join(', '));
    }

    $('.amenities .popover input').change(function () {
	const name = $(this).attr('data-name');
	const id = $(this).attr('data-id');

	if ($(this).is(':checked')) {
	    checked_obj[id] = name;
	} else {
	    delete checked_obj[id];
	}

	updateAmenities();
    });

    function updateAPIStatus() {
	$.ajax({
	    type: "GET",
	    url: "http://0.0.0.0:5001/api/v1/status/",
	    success: function(response) {
		if (response.status === "OK") {
		    $('DIV#api_status').addClass('available');
		} else {
		    $('DIV#api_status').removeClass('available');
		}
	    }
	});
    }

    function fetchPlaces() {
	$.ajax({
	    type: "POST",
	    url: "http://0.0.0.0:5001/api/v1/places_search/",
	    contentType: "application/json",
	    data: JSON.stringify({}),
	    success: function(response) {
		response.forEach(function(place) {
		    const articleTag = $('<article>').addClass('place');
		    articleTag.append($('<h2>').text(place.name));
		    articleTag.append($('<div>').text(place.description));
		    articleTag.append($('<div>').text(`Price: $${place.price_by_night}`));
		    articleTag.append($('<div>').text(`Max Guests: ${place.max_guest}`));
		    articleTag.append($('<div>').text(`Number of Rooms: ${place.number_rooms}`));
		    articleTag.append($('<div>').text(`Number of Bathrooms: ${place.number_bathrooms}`));
		    $('section.places').append(articleTag);
		});
	    },
	});
    }
    updateAPIStatus();
    fetchPlaces();
});
