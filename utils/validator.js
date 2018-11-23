
exports.validate = validate;
exports.isValidationRule = isValidationRule;

function validate (rule, value, options) {
  if (!value) {
    return false;
  }
  switch (rule) {
    case 'email':
      return value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/gi);
    case 'string':
    default:
      return true;
  }
}

function isValidationRule (rule) {
  const rules = [
    'string', 'email',
  ];

  return rules.indexOf(rule) !== -1;
}
