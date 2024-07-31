const apiUrl = 'https://user-opyf.onrender.com/api/users';

$(document).ready(function() {
    fetchUsers();

    $('#userTableBody').on('click', 'tr', function() {
        const userId = $(this).data('id');
        fetchUserDetails(userId);
    });

    $('#consultationForm').on('submit', function(event) {
        event.preventDefault();
        const userId = $('#modalUserId').val();
        addConsultation(userId);
    });

    function fetchUsers() {
        $.ajax({
            url: apiUrl,
            type: 'GET',
            success: function(users) {
                let userTableBody = '';
                users.forEach(user => {
                    const edad = user.age ? calcularEdad(user.age) : 'N/A';
                    userTableBody += `
                        <tr data-id="${user._id}">
                            <td>${user.name}</td>
                            <td>${edad}</td>
                            <td>${user.city ? user.city.name : ''}</td>
                        </tr>
                    `;
                });
                $('#userTableBody').html(userTableBody);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching users:', status, error);
                alert('Failed to fetch users. Please check the console for more details.');
            }
        });
    }

    function fetchUserDetails(userId) {
        $.ajax({
            url: `${apiUrl}/${userId}`,
            type: 'GET',
            success: function(user) {
                $('#modalUserId').val(user._id);
                $('#userDetails').html(`
                    <p><strong>Name:</strong> ${user.name}</p>
                    <p><strong>Age:</strong> ${user.age ? calcularEdad(user.age) : 'N/A'}</p>
                    <p><strong>Email:</strong> ${user.email || 'N/A'}</p>
                    <p><strong>Phone:</strong> ${user.telefono || 'N/A'}</p>
                    <p><strong>Region:</strong> ${user.region ? user.region.name : 'N/A'}</p>
                    <p><strong>City:</strong> ${user.city ? user.city.name : 'N/A'}</p>
                `);

                // List consultations
                let consultationList = '';
                user.consultations.forEach(consultation => {
                    consultationList += `
                        <li>
                            <strong>Date:</strong> ${new Date(consultation.date).toLocaleDateString()} <br>
                            <strong>Reason:</strong> ${consultation.reason} <br>
                            <strong>Details:</strong> ${consultation.details}
                        </li>
                    `;
                });
                $('#consultationList').html(consultationList);

                $('#userModal').modal('show');
            },
            error: function(xhr, status, error) {
                console.error('Error fetching user details:', status, error);
                alert('Failed to fetch user details. Please check the console for more details.');
            }
        });
    }

    function addConsultation(userId) {
        const consultationData = {
            date: $('#consultationDate').val(),
            reason: $('#consultationReason').val(),
            details: $('#consultationDetails').val()
        };

        $.ajax({
            url: `${apiUrl}/${userId}/consultations`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(consultationData),
            success: function(response) {
                $('#userModal').modal('hide');
                fetchUserDetails(userId); // Refresh user details to include the new consultation
                alert('Consultation added successfully.');
            },
            error: function(xhr, status, error) {
                console.error('Error adding consultation:', status, error);
                alert('Failed to add consultation. Please check the console for more details.');
            }
        });
    }

    function calcularEdad(fechaNacimiento) {
        const partes = fechaNacimiento.split('-');
        const dia = parseInt(partes[0], 10);
        const mes = parseInt(partes[1], 10) - 1;
        const año = parseInt(partes[2], 10);

        const fechaNac = new Date(año, mes, dia);
        const hoy = new Date();

        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mesActual = hoy.getMonth();
        const diaActual = hoy.getDate();

        if (mesActual < mes || (mesActual === mes && diaActual < dia)) {
            edad--;
        }

        return edad;
    }
});
