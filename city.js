const cityUrl = 'https://user-opyf.onrender.com/api/cities';

$(document).ready(function() {
    fetchCities();

    $('#cityForm').on('submit', function(event) {
        event.preventDefault();
        const cityId = $('#cityId').val();
        if (cityId) {
            updateCity(cityId);
        } else {
            createCity();
        }
    });

    function fetchCities() {
        $.ajax({
            url: cityUrl,
            type: 'GET',
            success: function(cities) {
                let cityTableBody = '';
                cities.forEach(city => {
                    cityTableBody += `
                        <tr>
                            <td>${city.name}</td>
                            <td>
                                <button class="btn btn-info btn-sm edit-city" data-id="${city._id}">Edit</button>
                            </td>
                            <td>
                                <button class="btn btn-danger btn-sm delete-city" data-id="${city._id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });
                $('#cityTableBody').html(cityTableBody);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching cities:', status, error);
                alert('Failed to fetch cities.');
            }
        });
    }

    function createCity() {
        const city = {
            name: $('#cityName').val()
        };
        $.ajax({
            url: cityUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(city),
            success: function() {
                $('#cityModal').modal('hide');
                fetchCities();
            },
            error: function(xhr, status, error) {
                console.error('Error creating city:', status, error);
                alert('Failed to create city.');
            }
        });
    }

    function updateCity(cityId) {
        const city = {
            name: $('#cityName').val()
        };
        $.ajax({
            url: `${cityUrl}/${cityId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(city),
            success: function() {
                $('#cityModal').modal('hide');
                fetchCities();
            },
            error: function(xhr, status, error) {
                console.error('Error updating city:', status, error);
                alert('Failed to update city.');
            }
        });
    }

    $(document).on('click', '.edit-city', function() {
        const cityId = $(this).data('id');
        $.ajax({
            url: `${cityUrl}/${cityId}`,
            type: 'GET',
            success: function(city) {
                $('#cityId').val(city._id);
                $('#cityName').val(city.name);
                $('#cityModalLabel').text('Edit City');
                $('#cityModal').modal('show');
            },
            error: function(xhr, status, error) {
                console.error('Error fetching city details:', status, error);
                alert('Failed to fetch city details.');
            }
        });
    });

    $(document).on('click', '.delete-city', function() {
        const cityId = $(this).data('id');
        if (confirm('Are you sure you want to delete this city?')) {
            $.ajax({
                url: `${cityUrl}/${cityId}`,
                type: 'DELETE',
                success: function() {
                    fetchCities();
                },
                error: function(xhr, status, error) {
                    console.error('Error deleting city:', status, error);
                    alert('Failed to delete city.');
                }
            });
        }
    });

    $('#cityModal').on('hidden.bs.modal', function () {
        $('#cityForm')[0].reset();
        $('#cityId').val('');
        $('#cityModalLabel').text('Add City');
    });
});
