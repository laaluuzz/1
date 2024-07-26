const apiUrl = 'https://user-opyf.onrender.com/api/users';

$(document).ready(function() {
    // Fetch and display users
    fetchUsers();

    // Handle form submission
    $('#userForm').on('submit', function(event) {
        event.preventDefault();
        const userId = $('#userId').val();
        if (userId) {
            updateUser(userId);
        } else {
            createUser();
        }
    });

    // Fetch users from API
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
                            <td >
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

    // Create a new user
    function createUser() {
        const user = {
            name: $('#userName').val(),
            age: $('#userAge').val(),
            email: $('#userEmail').val()
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

    // Update an existing user
    function updateUser(userId) {
        const user = {
            name: $('#userName').val(),
            age: $('#userAge').val(),
            email: $('#userEmail').val()
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

    // Edit user
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
                $('#userModalLabel').text('Edit User');
                $('#userModal').modal('show');
            },
            error: function(xhr, status, error) {
                console.error('Error fetching user details:', status, error);
                alert('Failed to fetch user details.');
            }
        });
    });

    // Delete user
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

    // Reset form when modal is hidden
    $('#userModal').on('hidden.bs.modal', function () {
        $('#userForm')[0].reset();
        $('#userId').val('');
        $('#userModalLabel').text('Add User');
    });
});
