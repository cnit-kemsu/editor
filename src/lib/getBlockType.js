function toTypes(block) {
  return block.getType();
}

function equalToFirst(value, index, array) {
  return value === array[0];
}

export function getBlockType(blocks) {
  return blocks.map(toTypes)
  |> #.every(equalToFirst) && #[0] || null;
}