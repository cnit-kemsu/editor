const colors = [[[0, 0, 0]]];
for (let index = 1; index < 11; index++)
  colors[0].push([0, 0, index * 9]);
colors[0].push([0, 0, 100]);

function pushSL(index, hue) {
  colors[index].push([hue, 100, 25]);
  colors[index].push([hue, 50, 50]);
  colors[index].push([hue, 75, 50]);
  colors[index].push([hue, 100, 50]);
  colors[index].push([hue, 100, 75]);
  colors[index].push([hue, 75, 75]);
}

const hueIndexes = [0, 1, 2, 3, 4, 5, 6, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24];
for (let index = 1; index < 12; index++) {
  colors.push([]); 
  pushSL(index, hueIndexes[index * 2 - 2] * 15);
  pushSL(index, hueIndexes[index * 2 - 1] * 15);
}

export default colors;