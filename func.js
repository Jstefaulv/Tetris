const canvas = document.getElementById("tetris");
const ctx = canvas.getContext('2d');

const scale = 20;

ctx.scale(scale, scale);

const tWidth = canvas.width / scale;
const tHeight = canvas.height / scale;

const piezas = [
    [
        [1, 1],
        [1, 1]
    ],
    [
        [0, 2, 0, 0],
        [0, 2, 0, 0],
        [0, 2, 0, 0],
        [0, 2, 0, 0]
    ],
    [
        [0, 0, 0],
        [3, 3, 0],
        [0, 3, 3]
    ],
    [
        [0, 0, 0],
        [0, 4, 4],
        [4, 4, 0]
    ],
    [
        [5, 0, 0],
        [5, 0, 0],
        [5, 5, 0]
    ],
    [
        [0, 0, 6],
        [0, 0, 6],
        [0, 6, 6]
    ],
    [
        [0, 0, 0],
        [7, 7, 7],
        [0, 7, 0]
    ]
];
const colores = [
    null,
    '#fc0d29', //rojo
    '#0DC2FF', //cyan
    '#10cc49', //verde
    '#782abd', //morado
    '#FF8E0D', //naranjo
    '#FFE138', //amarillo
    '#0242cc' //azul
];

let arena = [];

let rand;

const jugador = {
    pos: {x: 0, y: 1},
    matriz: null,
    color: null
}

rand = Math.floor(Math.random() * piezas.length);
jugador.matriz = piezas[rand];
jugador.color = colores[rand+1];


function dibujarMatriz(matriz, x, y) {
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            if (matriz[i][j])
                ctx.fillRect(x + j, y + i, 1, 1);
        }
    }
}

function rotacion(matriz, dir) {
    let newmatriz = [];

    for (let i in matriz)
        newmatriz.push([]);

    if (dir === 1) {
        for (let i = 0; i < matriz.length; i++) {
            for (let j = 0; j < matriz[i].length; j++) {
                newmatriz[j][matriz.length - i - 1] = matriz[i][j];
            }
        }
    } else {
        for (let i = 0; i < matriz.length; i++) {
            for (let j = 0; j < matriz[i].length; j++) {
                newmatriz[matriz.length - j - 1][i] = matriz[i][j];
            }
        }
    }

    return newmatriz;
}

function choques(jugador, arena) {
    for (let i = 0; i < jugador.matriz.length; i++) {
        for (let j = 0; j < jugador.matriz[i].length; j++) {
            if (jugador.matriz[i][j] && arena[jugador.pos.y + i + 1][jugador.pos.x + j + 1])
                return 1;
        }
    }

    return 0;
}

function unir(matriz, x, y) {
    for (let i = 0; i < matriz.length; i++) {
        for (let j = 0; j < matriz[i].length; j++) {
            arena[y+i+1][x+j+1] = arena[y+i+1][x+j+1] || matriz[i][j];
        }
    }
}

function limpiarBloques() {
    for (let i = 1; i < arena.length-2; i++) {
        let clear = 1;

        for (let j = 1; j < arena[i].length-1; j++) {
            if (!arena[i][j])
                clear = 0;
        }

        if (clear) {
            let r = new Array(tWidth).fill(0);
            r.push(1);
            r.unshift(1);

            arena.splice(i, 1);
            arena.splice(1, 0, r);
        }
    }
}

function dibujarArena() {
    for (let i = 1; i < arena.length-2; i++) {
        for (let j = 1; j < arena[i].length-1; j++) {
            if (arena[i][j]) {
                ctx.fillStyle = colores[arena[i][j]];
                ctx.fillRect(j-1, i-1, 1, 1);
            }
        }
    }
}

function iniciar() {
    arena = [];

    const r = new Array(tWidth + 2).fill(1);
    arena.push(r);

    for (let i = 0; i < tHeight; i++) {
        let row = new Array(tWidth).fill(0);
        row.push(1);
        row.unshift(1);

        arena.push(row);
    }

    arena.push(r);
    arena.push(r);
}

function gameOver() {
    for (let j = 1; j < arena[1].length-1; j++)
        if (arena[1][j])
            return iniciar();

    return;
}

let interval = 1000;
let lastTime = 0;
let count = 0;

function update(time = 0) {

    const dt = time - lastTime;
    lastTime = time;
    count += dt;

    if (count >= interval) {
        jugador.pos.y++;
        count = 0;
    }

    if (choques(jugador, arena)) {
        unir(jugador.matriz, jugador.pos.x, jugador.pos.y-1);
        limpiarBloques();
        gameOver();

        jugador.pos.y = 1;
        jugador.pos.x = 0;

        rand = Math.floor(Math.random() * piezas.length);
        jugador.matriz = piezas[rand];
        jugador.color = colores[rand+1];

        interval = 1000;
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    dibujarArena();
    ctx.fillStyle = jugador.color;
    dibujarMatriz(jugador.matriz, jugador.pos.x, jugador.pos.y);

    requestAnimationFrame(update);
}

document.addEventListener("keydown", event => {

    if (event.keyCode === 37 && interval-1) {
        jugador.pos.x--;
        if (choques(jugador, arena))
            jugador.pos.x++;
    } else if (event.keyCode === 39 && interval-1) {
        jugador.pos.x++;
        if (choques(jugador, arena))
            jugador.pos.x--;
    } else if (event.keyCode === 40) {
        jugador.pos.y++;
        count = 0;
    } else if (event.keyCode === 38) {
        jugador.matriz = rotacion(jugador.matriz, 1);
        if (choques(jugador, arena))
            jugador.matriz = rotacion(jugador.matriz, -1);
    } else if (event.keyCode === 32) {
        interval = 1;
    }

});

iniciar();
update();