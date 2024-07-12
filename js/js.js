document.addEventListener("DOMContentLoaded", function() {
    fetch("../comun/header.html")
        .then(response => response.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
        });
});
// Función para cambiar de vista al hacer scroll
function changeViewOnScroll() {
    const views = document.querySelectorAll('.view');
    const viewContainer = document.getElementById('view-container');
 
    // Variable para mantener el índice de la vista actual
    let currentViewIndex = 0;
 
    // Escuchar el evento de scroll en el contenedor de vistas
    viewContainer.addEventListener('scroll', function() {
        // Obtener la altura visible del contenedor
        const viewHeight = viewContainer.clientHeight;
        
        // Calcular la posición actual de scroll
        const scrollPosition = viewContainer.scrollTop;
 
        // Calcular el índice de la vista actual
        const newIndex = Math.floor(scrollPosition / viewHeight);
 
        // Si el índice actual ha cambiado, actualizar la vista activa
        if (newIndex !== currentViewIndex) {
            views[currentViewIndex].classList.remove('active');
            views[newIndex].classList.add('active');
            currentViewIndex = newIndex;
        }
    });
 
    // Inicializar la primera vista como activa
    views[currentViewIndex].classList.add('active');
 }
 
 // Llamar a la función para iniciar el cambio de vista al hacer scroll
 changeViewOnScroll();
 