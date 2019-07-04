function nonNull([, value]) {
  return value != null;
}

function printAttribute([name, value]) {
  return name + '="' + value + '"';
}

export function printAttributes(data, dataAttributeMap = {}) {
  const dataPropToAttr = entry => {
    const mapName = dataAttributeMap[entry[0]];
    return mapName
      ? [mapName, entry[1]]
      : entry;
  };
    
  return Object.entries(data)
    .filter(nonNull)
    .map(dataPropToAttr)
    .map(printAttribute)
    .join(' ');
}