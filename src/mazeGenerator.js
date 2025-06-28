// src/mazeGenerator.js

export function generateMaze(width, height) {
  const maze = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => 1)
  );

  const dirs = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function carve(x, y) {
    maze[y][x] = 0;
    const directions = [...dirs];
    shuffle(directions);

    for (const [dx, dy] of directions) {
      const nx = x + dx * 2;
      const ny = y + dy * 2;

      if (
        ny >= 0 &&
        ny < height &&
        nx >= 0 &&
        nx < width &&
        maze[ny][nx] === 1
      ) {
        maze[y + dy][x + dx] = 0;
        carve(nx, ny);
      }
    }
  }

  carve(1, 1);
  return maze;
}
