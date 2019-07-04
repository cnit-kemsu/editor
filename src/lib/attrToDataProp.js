export function attrToDataProp(attrs, attr) {
  const [name, _value] = attr.split('=');
  let value = _value.replace(/"/g, '');

  if (value === 'true') value = true;
  else if (value === 'false') value = false;

  return {
    ...attrs,
    [name]: value
  };
}