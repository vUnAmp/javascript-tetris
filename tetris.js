const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');

context.scale(20, 20);

const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0],
];

const player = {
  pos: { x: 5, y: 5 },
  matrix: matrix,
};
// Player Activity METHOD

function playerMove(dir) {
  player.pos.x += dir;
  if (collide(arena, player)) {
    player.pos.x -= dir;
  }
  console.log(player.pos.x);
}

function playerDrop() {
  player.pos.y++;
  dropTime = 0;
  if (collide(arena, player)) {
    player.pos.y--;
    merge(arena, player);
    console.table(arena);
    player.pos.y = 0;
  }
}

function playerRotate(dir) {
  rotate(player.matrix, dir);
  const pos = player.pos.x;
  let offset = 1;
  while (collide(arena, player)) {
    player.pos.x += offset;
    offset = -(offset + (offset > 0 ? 1 : -1));
    console.log(offset);
    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir);
      player.pos.x = pos;
      return;
    }
  }
}
function rotate(matrix, dir) {
  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < y; x++) {
      [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
    }
  }
  if (dir > 0) {
    matrix.forEach((row) => row.reverse());
  } else {
    matrix.reverse();
  }
}

// collide ( Va chạm ) method
function collide(arena, player) {
  const [m, o] = [player.matrix, player.pos];
  for (let y = 0; y < m.length; ++y) {
    for (let x = 0; x < m[y].length; ++x) {
      if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
        return true;
      }
    }
  }
  return false;
}

// createMatrix Method

function createMatrix(w, h) {
  const matrix = [];
  while (h--) {
    matrix.push(new Array(w).fill(0));
  }
  return matrix;
}

function draw() {
  context.fillStyle = 'deeppink';
  context.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(arena, { x: 0, y: 0 });
  drawMatrix(player.matrix, player.pos);
}

function merge(arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value;
      }
    });
  });
}

function drawMatrix(matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        context.fillStyle = 'white';
        context.fillRect(x + offset.x, y + offset.y, 1, 1);
      }
    });
  });
}

let startTime = 0;
let dropTime = 0;
let dropLoop = 1000;
function update(timestamp = 0) {
  const elapsedTime = timestamp - startTime;
  startTime = timestamp;
  dropTime += elapsedTime;
  if (dropTime > dropLoop) {
    player.pos.y++;
    dropTime = 0;
  }

  draw();
  requestAnimationFrame(update);
}

const arena = createMatrix(12, 20);

document.addEventListener('keydown', (event) => {
  if (event.code === 'ArrowRight') {
    playerMove(1);
  } else if (event.code === 'ArrowLeft') {
    playerMove(-1);
  } else if (event.code === 'ArrowDown') {
    playerDrop();
  } else if (event.code === 'KeyQ') {
    playerRotate(-1);
  } else if (event.code === 'KeyE') {
    playerRotate(1);
  }
});

update();

// console.log(createMatrix(3, 5));
