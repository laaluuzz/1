const apiUrl = 'https://user-opyf.onrender.com/api/users';
const regionUrl = 'https://user-opyf.onrender.com/api/regions';
const cityUrl = 'https://user-opyf.onrender.com/api/cities';

$(document).ready(function() {
    fetchUsers();
    fetchRegions();

    $('#userForm').on('submit', function(event) {
        event.preventDefault();
        const userId = $('#userId').val();
        if (userId) {
            updateUser(userId);
        } else {
            createUser();
        }
    });

    function fetchUsers() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            success: function(users) {
                let userTableBody = '';
                users.forEach(user => {
                    userTableBody += `
                        <tr>
                            <td>${user.name}</td>
                            <td>${user.age}</td>
                            <td>${user.email}</td>
                            <td>${user.region ? user.region.name : ''}</td>
                            <td>${user.city ? user.city.name : ''}</td>
                            <td>
                                <button class="btn btn-info btn-sm edit-user" data-id="${user._id}">Edit</button>
                            </td>
                            <td>
                                <button class="btn btn-danger btn-sm delete-user" data-id="${user._id}">Delete</button>
                            </td>
                        </tr>
                    `;
                });
                $('#userTableBody').html(userTableBody);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching users:', status, error);
                alert('Failed to fetch users.');
            }
        });
    }

    function fetchRegions() {
        $.ajax({
            url: regionUrl,
            type: 'GET',
            success: function(regions) {
                let regionOptions = '<option value="">Select Region</option>';
                regions.forEach(region => {
                    regionOptions += `<option value="${region._id}">${region.name}</option>`;
                });
                $('#userRegion').html(regionOptions);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching regions:', status, error);
                alert('Failed to fetch regions.');
            }
        });
    }

    function fetchCities(regionId) {
        $.ajax({
            url: `${cityUrl}?region=${regionId}`,  // Adjust based on your API
            type: 'GET',
            success: function(cities) {
                let cityOptions = '<option value="">Select City</option>';
                cities.forEach(city => {
                    cityOptions += `<option value="${city._id}">${city.name}</option>`;
                });
                $('#userCity').html(cityOptions);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching cities:', status, error);
                alert('Failed to fetch cities.');
            }
        });
    }

    function createUser() {
        const user = {
            name: $('#userName').val(),
            age: $('#userAge').val(),
            email: $('#userEmail').val(),
            region: $('#userRegion').val(),
            city: $('#userCity').val()
        };
        $.ajax({
            url: apiUrl,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(user),
            success: function() {
                $('#userModal').modal('hide');
                fetchUsers();
            },
            error: function(xhr, status, error) {
                console.error('Error creating user:', status, error);
                alert('Failed to create user.');
            }
        });
    }

    function updateUser(userId) {
        const user = {
            name: $('#userName').val(),
            age: $('#userAge').val(),
            email: $('#userEmail').val(),
            region: $('#userRegion').val(),
            city: $('#userCity').val()
        };
        $.ajax({
            url: `${apiUrl}/${userId}`,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(user),
            success: function() {
                $('#userModal').modal('hide');
                fetchUsers();
            },
            error: function(xhr, status, error) {
                console.error('Error updating user:', status, error);
                alert('Failed to update user.');
            }
        });
    }

    $(document).on('change', '#userRegion', function() {
        const regionId = $(this).val();
        if (regionId) {
            fetchCities(regionId);
        } else {
            $('#userCity').html('<option value="">Select City</option>');
        }
    });

    $(document).on('click', '.edit-user', function() {
        const userId = $(this).data('id');
        $.ajax({
            url: `${apiUrl}/${userId}`,
            type: 'GET',
            success: function(user) {
                $('#userId').val(user._id);
                $('#userName').val(user.name);
                $('#userAge').val(user.age);
                $('#userEmail').val(user.email);
                $('#userRegion').val(user.region ? user.region._id : '');
                fetchCities(user.region ? user.region._id : '');
                $('#userCity').val(user.city ? user.city._id : '');
                $('#userModalLabel').text('Edit User');
                $('#userModal').modal('show');
            },
            error: function(xhr, status, error) {
                console.error('Error fetching user details:', status, error);
                alert('Failed to fetch user details.');
            }
        });
    });

    $(document).on('click', '.delete-user', function() {
        const userId = $(this).data('id');
        if (confirm('Are you sure you want to delete this user?')) {
            $.ajax({
                url: `${apiUrl}/${userId}`,
                type: 'DELETE',
                success: function() {
                    fetchUsers();
                },
                error: function(xhr, status, error) {
                    console.error('Error deleting user:', status, error);
                    alert('Failed to delete user.');
                }
            });
        }
    });

    $('#userModal').on('hidden.bs.modal', function () {
        $('#userForm')[0].reset();
        $('#userId').val('');
        $('#userModalLabel').text('Add User');
        $('#userRegion').html('<option value="">Select Region</option>');
        $('#userCity').html('<option value="">Select City</option>');
    });
});
