export default function RGBAToHexA(r, g, b, a) {
  r = parseInt(r, 10).toString(16);
  g = parseInt(g, 10).toString(16);
  b = parseInt(b, 10).toString(16);
  a = parseInt(a, 10).toString(16);

  if (r.length == 1) r = `0${r}`;
  if (g.length == 1) g = `0${g}`;
  if (b.length == 1) b = `0${b}`;

  return `#${r}${g}${b}`;
}
