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

    updateAPIStatus();
});
