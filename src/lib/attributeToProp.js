export function attributeToProp(attributes, current) {
  const [name, _value] = current.split('=');
  let value = _value.substring(1, _value.length - 1);

  if (value === 'true') value = true;
  else if (value === 'false') value = false;

  return {
    ...attributes,
    [name]: value
  };
}