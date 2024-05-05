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

    $('button').click(function() {
	fetchPlaces();
    });
    
    updateAPIStatus();
    fetchPlaces();


    // Function to handle changes in location checkboxes
    function handleLocationChange (states, cities) {
        $('.locations > .popover ul:first-child > li > input').change(function () {
          const idSt = $(this).attr('data-id');
          const nameSt = $(this).attr('data-name');
          if (this.checked) {
            states[idSt] = nameSt;
          } else {
            delete states[idSt];
          }
          $('.locations > h4').text(Object.values(states).join(', '));
        });
      
        $('.locations > .popover li li > input').change(function () {
          const idCi = $(this).attr('data-id');
          const nameCi = $(this).attr('data-name');
          if (this.checked) {
            cities[idCi] = nameCi;
          } else {
            delete cities[idCi];
          }
        });
      }


    // Function to add the reviews to the article
    async function addingReviews (article, id, allUsers) {
    const reviewResponse = await $.get('http://0.0.0.0:5001/api/v1/places/' + id + '/reviews');
    const classReviews = $('<div class="reviews"></div>');
    const reviewsList = $('<ul></ul>');
    const reviewsSpan = $('<span>show</span>');
    classReviews.append('<h2>' + reviewResponse.length + ' Review' + (reviewResponse.length !== 1 ? 's' : '') + '</h2>', reviewsSpan, reviewsList);
    $(reviewsSpan).click(function () {
      if ($(reviewsSpan).text() === 'show') {
        $(this).text('hide');
        for (const review of reviewResponse) {
          const user = allUsers.find(user => user.id === review.user_id);
          reviewsList.append($('<h3></h3>').text('From ' + user.first_name + ' at ' + formatDateFromISO(review.updated_at)), $('<li></li>').text(review.text));
        }
      } else {
        $(this).text('show');
        $(reviewsList).empty();
      }
    });
    article.append(classReviews);
  }
  
      
});
