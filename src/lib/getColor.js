import { HSLToRGB } from './HSLToRGB';

function HSLAToRGBA(h, s, l, a) {
  return [
    ...HSLToRGB(h, s, l),
    a
  ];
}

const extractRGBA = /^rgb(a)?\((?<red>\d+),(?<green>\d+),(?<blue>\d+)(,(?<alpha>\d+(\.\d+)?))?\)$/;
function getRGBA(value) {
  const RGBA = value.replace(/\s/g, '') |> extractRGBA.exec(#)?.groups;
  if (RGBA === undefined) return undefined;
  let { red, green, blue, alpha = 1 } = RGBA;
  red = Number(red);
  green = Number(green);
  blue = Number(blue);
  alpha = Number(alpha);
  if (red > 255 || green > 255 || blue > 255 || alpha > 1) return undefined;
  return [red, green, blue, alpha];
}

const extractHSLA = /^hsl(a)?\((?<hue>\d+),(?<saturation>\d+)%,(?<lightness>\d+)%(,(?<alpha>\d+(\.\d+)?))?\)$/;
function getHSLA(value) {
  const HSLA = value.replace(/\s/g, '') |> extractHSLA.exec(#)?.groups;
  if (HSLA === undefined) return undefined;
  let { hue, saturation, lightness, alpha = 1 } = HSLA;
  hue = Number(hue);
  saturation = Number(saturation);
  lightness = Number(lightness);
  alpha = Number(alpha);
  if (hue > 360 || saturation > 100 || lightness > 100 || alpha > 1) return undefined;
  return HSLAToRGBA(hue, saturation, lightness, alpha);
}

const extractHEXA = /^#(?<red>[0-9A-Fa-f])(?<green>[0-9A-Fa-f])(?<blue>[0-9A-Fa-f])(?<alpha>[0-9A-Fa-f])?$/;
const extractHEXA2 = /^#(?<red>[0-9A-Fa-f]{2})(?<green>[0-9A-Fa-f]{2})(?<blue>[0-9A-Fa-f]{2})(?<alpha>[0-9A-Fa-f]{2})?$/;
function getHEXA(value) {
  const HEXA = value.replace(/\s/g, '')
  |> extractHEXA.exec(#)?.groups || extractHEXA2.exec(#)?.groups;
  console.log(HEXA);
  if (HEXA === undefined) return undefined;
  let { red, green, blue, alpha = 'FF' } = HEXA;
  red = parseInt(red, 16);
  green = parseInt(green, 16);
  blue = parseInt(blue, 16);
  alpha = parseInt(alpha, 16) / 255;
  //if (red > 255 || green > 255 || blue > 255 || alpha > 1) return undefined;
  return [red, green, blue, alpha];
}

const colorNames = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgrey: '#d3d3d3',
  lightgreen: '#90ee90',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370d8',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#d87093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32'
};

function colorNameToRgb(value) {
  const hex = colorNames[value];
  if (hex === undefined) return undefined;
  return getHEXA(hex);
}

export function getColor(value) {

  let color = getRGBA(value);
  if (color !== undefined) return color;

  color = getHEXA(value);
  if (color !== undefined) return color;

  color = getHSLA(value);
  if (color !== undefined) return color;

  color = colorNameToRgb(value);
  if (color !== undefined) return color;

  return undefined;
}