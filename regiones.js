const regionApiUrl = 'https://user-opyf.onrender.com/api/regions';

$(document).ready(function() {
    // Fetch and display regions
    fetchRegions();

    // Handle region form submission
    $('#regionForm').on('submit', function(event) {
        event.preventDefault();
        const regionId = $('#regionId').val();
        if (regionId) {
            updateRegion(regionId);
        } else {
            createRegion();
        }
    });

    // Fetch regions from API
    function fetchRegions() {
        $.ajax({
            url: regionApiUrl,
            type: 'GET',
            success: function(regions) {
                let regionTableBody = '';
                let regionList = '';
                regions.forEach(region => {
                    regionTableBody += `
                        <tr>
                            <td>${region.name}</td>
                            <td>
                                <button class="btn btn-info btn-sm edit-region" data-id="${region._id}">Edit</button>
                            </td>
                            <td>
                                <button class="btn btn-danger btn-sm delete-region" data-id="${region._id}">Delete</button>
                            </td>
                        </tr>
                    `;
                    regionList += `<li>${region.name}</li>`;
                });
                $('#regionTableBody').html(regionTableBody);
                $('#regionList').html(regionList);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching regions:', status, error);
                alert('Failed to fetch regions.');
            }
        });
    }

    // Create a new region
    function createRegion() {
        const region = {
            name: $('#regionName').val()
        };
        $.ajax({
            url: regionApiUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(region),
            success: function() {
                $('#regionModal').modal('hide');
                fetchRegions();
            },
            error: function(xhr, status, error) {
                console.error('Error creating region:', status, error);
                alert('Failed to create region.');
            }
        });
    }

    // Update an existing region
    function updateRegion(regionId) {
        const region = {
            name: $('#regionName').val()
        };
        $.ajax({
            url: `${regionApiUrl}/${regionId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(region),
            success: function() {
                $('#regionModal').modal('hide');
                fetchRegions();
            },
            error: function(xhr, status, error) {
                console.error('Error updating region:', status, error);
                alert('Failed to update region.');
            }
        });
    }

    // Delete a region
    $(document).on('click', '.delete-region', function() {
        const regionId = $(this).data('id');
        if (confirm('Are you sure you want to delete this region?')) {
            $.ajax({
                url: `${regionApiUrl}/${regionId}`,
                type: 'DELETE',
                success: function() {
                    fetchRegions();
                },
                error: function(xhr, status, error) {
                    console.error('Error deleting region:', status, error);
                    alert('Failed to delete region.');
                }
            });
        }
    });

    // Edit a region
    $(document).on('click', '.edit-region', function() {
        const regionId = $(this).data('id');
        $.ajax({
            url: `${regionApiUrl}/${regionId}`,
            type: 'GET',
            success: function(region) {
                $('#regionName').val(region.name);
                $('#regionId').val(region._id);
                $('#regionModal').modal('show');
            },
            error: function(xhr, status, error) {
                console.error('Error fetching region details:', status, error);
                alert('Failed to fetch region details.');
            }
        });
    });
});
