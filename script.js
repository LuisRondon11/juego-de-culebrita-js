const contenedorTexto = document.getElementById('contenedorTexto');
const boton1 = document.getElementById('boton1');
const boton2 = document.getElementById('boton2');
const boton3 = document.getElementById('boton3');
const puntaje = document.createElement('div');
const canva = document.createElement("canvas");
let context = canva.getContext('2d');
let n;
let avance = 16;
let count = 0;
let culebra = {
    //posicion inicial de la serpiente
    x: 100,
    y: 100,

    //movimiento de 1 cuadro de la serpiente
    dx: avance,
    dy: 0,

    //tamano de la serpiente
    cells: [],

    //crecimiento de la serpiente, comenzando en 2
    maxCells: 4
};
let comida = {
    //posicion inicial de la comida
    x: 320,
    y: 320
};
//con el boton1 ponemos el juego en facil y llamamos a la funcion juego enviando la dificultad
boton1.onclick = function () {
    n = 'facil';
    juego(n);
}
//con el boton2 ponemos el juego en normal y llamamos a la funcion juego enviando la dificultad
boton2.onclick = function () {
    n = "normal";
    juego(n);
}
//con el boton2 ponemos el juego en normal y llamamos a la funcion juego enviando la dificultad
boton3.onclick = function () {
    n = "dificil";
    juego(n);
}
//toma el valor de dificultad, llama a las funciones ocultar, nivel y le envia el nivel, luego llama a iniciarjuego
function juego(n) {
    ocultar();
    nivel(n)
    iniciarJuego()
};
//Esta funcion oculta el texto en pantalla y lama la funcion mostrarCanva
function ocultar() {
    contenedorTexto.style.display = 'none';
    mostrarCanva();
};
//Esta Funcion crea un contenedor canvas y un div para el puntaje
function mostrarCanva() {
    canva.id = "contenedorJuego";
    canva.height = '600';
    canva.width = '600';
    puntaje.className = 'contador';
    document.body.appendChild(puntaje);
    document.body.appendChild(canva);
};
// con la constante nivel recibimos el nivel y evaluamos el mismo para devolver el numero correspondiente 
const nivel = function () {
    if (n=='facil') {
        return 15;
    } else if (n=='normal'){
        return 7
    } else if (n=='dificil'){
        return 4
    }
}
//funcion para onbtener un numero randon
function numeroRandon(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};
//se encarga de hacer funcionar el juego
function iniciarJuego() {
    let id;
    let contadorNum = culebra.maxCells;
    //guardamos el id generado por la funcion 
    id = requestAnimationFrame(iniciarJuego)
    //establece el nivel de dificultad, siendo n el numero que lo establece, entre mas alto n mas lento y mientras menor sea n es mas rapido    
        if (++count < nivel()) {
            return;
        }
        //console.log(typeof nivel)
    count = 0;
    //refresco de la animacion
    context.clearRect(0, 0, canva.width, canva.height);
    //movimiento en X y Y
    culebra.x += culebra.dx;
    culebra.y += culebra.dy;
    //si la serpiente pasa el limite horizontal
    if (culebra.x < 0) {
        culebra.x = canva.width - avance;
    } else if (culebra.x >= canva.width) {
        culebra.x = 0;
    };
    //si pasa el limite vertical
    if (culebra.y < 0) {
        culebra.y = canva.width - avance;
    } else if (culebra.y >= canva.height) {
        culebra.y = 0;
    };
    //almacena la pocision por donde se paso
    culebra.cells.unshift({
        x: culebra.x,
        y: culebra.y
    });
    //actualiza donde estuvo la serpiente segun avamza
    if (culebra.cells.length > culebra.maxCells) {
        culebra.cells.pop();
    };
    //dibuja la comida
    context.fillStyle = "brown";
    context.fillRect(comida.x, comida.y, avance, avance);
    //dibuja la serpiente cada celda  que avanza y da color
    context.fillStyle = 'aqua';
    culebra.cells.forEach(function(cell, index) {
        //dibuja un cuadro 1px mas pequeno para apreciar el crecimiento
        context.fillRect(cell.x, cell.y, avance - 1, avance - 1);
        if ((cell.y - comida.y >= -8 && cell.y - comida.y <= 8) && 
            (cell.x - comida.x >= -8 && cell.x - comida.x <= 8)) {
            culebra.maxCells++;
            //aparece la comida en lado randon
            comida.x = numeroRandon(1, 25) * avance;
            comida.y = numeroRandon(1, 25) * avance;
        };
        for (var i = index + 1; i < culebra.cells.length; i++) {
            // si choca con el cuerpo el juego se finaliza el juego y llama a la funcion juegoPerdido
            if (cell.x === culebra.cells[i].x && cell.y === culebra.cells[i].y) {
                window.cancelAnimationFrame(id);
                juegoPerdido();
            };
        };
    });
    contador(contadorNum);
};
//crea desabilita el canvas, cambia el className a el conetnedor de puntaje y crea un boton de volver
function juegoPerdido() {
    canva.style.display = 'none';
    puntaje.className = 'fin';
    const volverBtn = document.createElement('button');
    volverBtn.id = 'volver'
    volverBtn.textContent = 'Volver';
    document.body.append(volverBtn);
    volverBtn.onclick = function volver() {
        location.reload();
    }
    
};
//ingresa la puntuacion en el contenedor
function contador(contadorNum) {
    puntaje.innerHTML = `<p>${contadorNum-4}</p>`;
};
// para poder mover la culebrita
document.addEventListener('keydown', function(e) {
    //utilizamos el codigo de cada flecha y la letra correspondiente, && para que no pueda ir en direccion opuesta
    // izquierda letra a y arrowleft
    if (e.key === 'a' || e.key === 'ArrowLeft' || e.key === 'A' && culebra.dx === 0) {
        culebra.dx = -avance;
        culebra.dy = 0;
    } 
    // arriba letra w y arrowup
    else if (e.key === 'w'|| e.key === 'ArrowUp' || e.key === 'W' && culebra.dy === 0) {
        culebra.dy = -avance;
        culebra.dx = 0;
    }
    // derecha letra d y arrowright
    else if (e.key === 'd' || e.key === 'ArrowRight' || e.key === 'D' && culebra.dx === 0) {
        culebra.dx = avance;
        culebra.dy = 0;
    }
    //abajo letra s y arrowdown
    else if (e.key === 's' || e.key === 'ArrowDown' || e.key === 'S'  && culebra.dy === 0) {
        culebra.dy = avance;
        culebra.dx = 0;
    }
})
requestAnimationFrame(iniciarJuego)