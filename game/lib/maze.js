const MAZE_ROWS = 10;
const MAZE_COLS = 10;
var MAZE_MATRIX = [];
var visited = new Set();
var frontier = new Set();

function remove_random_wall(cell) {
  let neighbours = [];
  // Northern neighbour
  if (cell.row - 1 >= 0) {
    if (MAZE_MATRIX[cell.row - 1][cell.col].visited) {
      neighbours.push(MAZE_MATRIX[cell.row - 1][cell.col])
    }
  }
  // Eastern neighbour
  if (cell.col + 1 < MAZE_ROWS) {
    if (MAZE_MATRIX[cell.row][cell.col + 1].visited) {
      neighbours.push(MAZE_MATRIX[cell.row][cell.col + 1]);
    }
  }
  // Southern neighbour
  if (cell.row + 1 < MAZE_ROWS) {
    if (MAZE_MATRIX[cell.row + 1][cell.col].visited) {
      neighbours.push(MAZE_MATRIX[cell.row + 1][cell.col]);
    }
  }
  // Western neighbour
  if (cell.col - 1 >= 0) {
    if (MAZE_MATRIX[cell.row][cell.col - 1].visited) {
      neighbours.push(MAZE_MATRIX[cell.row][cell.col - 1]);
    }
  }
  let random_neighbour = neighbours[Math.floor(Math.random() * neighbours.length)];

  if (random_neighbour.col == cell.col && random_neighbour.row < cell.row) {
    random_neighbour.south = false;
    cell.north = false;
  } else if (random_neighbour.col == cell.col && random_neighbour.row > cell.row) {
    random_neighbour.north = false;
    cell.south = false;
  } else if (random_neighbour.col < cell.col && random_neighbour.row == cell.row) {
    random_neighbour.east = false;
    cell.west = false;

  } else {
    random_neighbour.west = false;
    cell.east = false;
  }
}

function add_frontiers(cell) {
  let cell_row = cell.row;
  let cell_col = cell.col;

  // Northern neighbour
  if (cell.row - 1 >= 0) {
    if (!MAZE_MATRIX[cell.row - 1][cell.col].visited) {
      frontier.add(MAZE_MATRIX[cell.row - 1][cell.col]);
    }
  }
  // Eastern neighbour
  if (cell.col + 1 < MAZE_ROWS) {
    if (!MAZE_MATRIX[cell.row][cell.col + 1].visited) {
      frontier.add(MAZE_MATRIX[cell.row][cell.col + 1]);
    }
  }
  // Southern neighbour
  if (cell.row + 1 < MAZE_ROWS) {
    if (!MAZE_MATRIX[cell.row + 1][cell.col].visited) {
      frontier.add(MAZE_MATRIX[cell.row + 1][cell.col]);
    }
  }
  // Western neighbour
  if (cell.col - 1 >= 0) {
    if (!MAZE_MATRIX[cell.row][cell.col - 1].visited) {
      frontier.add(MAZE_MATRIX[cell.row][cell.col - 1]);
    }
  }
}

function generate_maze() {
  for (let i = 0; i < MAZE_ROWS; i++) {
    MAZE_MATRIX.push([]);
    for (let j = 0; j < MAZE_COLS; j++) {
      MAZE_MATRIX[i].push({
        row: i,
        col: j,
        visited: false,
        north: true,
        east: true,
        south: true,
        west: true
      });
    }
  }

  // Choose a cell as the starting point and add it to the visited set
  let start = MAZE_MATRIX[0][0];
  start.visited = true;
  visited.add(start);
  // Add all unvisited cells that are adjacent to the current cell to the frontier set
  add_frontiers(start);

  // Choose a cell randomly from the frontier set and make it the current cell,
  // removing it from the frontier set and adding it to the visited set
  let i = 0;
  while (frontier.size > 0) {
    let current = Array.from(frontier)[[Math.floor(Math.random() * frontier.size)]];
    frontier.delete(current);
    visited.add(current);
    current.visited = true;
    // Remove the wall between the current cell and a random adjacent cell that
    // belongs to the visited set.
    remove_random_wall(current);
    add_frontiers(current);


  }
}

generate_maze();
console.log(MAZE_MATRIX);