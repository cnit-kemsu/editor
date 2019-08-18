import { HSLAToRGBA } from './color-parser';

function pushColor(index, hue, saturation, lightness) {
  HSLAToRGBA(hue, saturation, lightness) |> `rgb(${#[0]}, ${#[1]}, ${#[2]})` |> colors[index].push(#);
}

const colors = [[]];
pushColor(0, 0, 0, 0);
for (let index = 1; index < 11; index++) pushColor(0, 0, 0, index * 9);
pushColor(0, 0, 0, 100);

function pushSL(index, hue) {
  pushColor(index, hue, 100, 25);
  pushColor(index, hue, 50, 50);
  pushColor(index, hue, 75, 50);
  pushColor(index, hue, 100, 50);
  pushColor(index, hue, 100, 75);
  pushColor(index, hue, 75, 75);
}

const hueIndexes = [0, 1, 2, 3, 4, 5, 6, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 23, 24];
for (let index = 1; index < 12; index++) {
  colors.push([]); 
  pushSL(index, hueIndexes[index * 2 - 2] * 15);
  pushSL(index, hueIndexes[index * 2 - 1] * 15);
}

export default colors;