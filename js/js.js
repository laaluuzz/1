$(document).ready(function() {
    var audio = document.getElementById('miAudio');
    
    // Reproducir automáticamente el audio al hacer clic en cualquier parte de la página
    $(document).click(function() {
        audio.play();
    });
});
