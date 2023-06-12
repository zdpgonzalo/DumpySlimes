function resizeApp()//NO TOCAR POR LO QUE MÁS QUERÁIS NI SIQUIERA YO SÉ CÓMO FUNCIONA, SOLO SE QUE SIRVE PARA AJUSTAR EL TAMAÑO DE LA VENTANA DE JUEGO AL TAMAÑO DE LA VENTANA DEL NAVEGADOR
{
    'use strict';

    // Ancho y Alto del Juego
    let game_ratio = 720 / 640; 

    // Asegurar de que se mantenga el Ratio con el Tamaño de la Ventana
    let div = document.getElementById('phaser-app'); 
    div.style.width = (window.innerHeight * game_ratio) + 'px'; 
    div.style.height = window.innerHeight + 'px'; 

    // Comprobar que el DPI del Dispositivo se adapte al Ratio
    let canvas = document.getElementsByTagName('canvas')[0]; 
    
    let dpi_w = (parseInt(div.style.width) / canvas.width);
    let dpi_h = (parseInt(div.style.height) / canvas.height); 
    let height = window.innerHeight * (dpi_w / dpi_h);
    let width = height * game_ratio; 

    // Escalar el Canvas
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
}

function runApp()
{
    'use strict';

    // Iniciar la Aplicación de Phaser
    let app = new App();
    app.start();

    // Escalar al Tamaño de Ventana
    window.addEventListener('resize', resizeApp);
    resizeApp();
}

window.onload = function()
{
    'use strict';
    
    // Lanzar el juego
    runApp();
}