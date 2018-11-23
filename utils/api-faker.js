var fs = require("fs");

exports = module.exports = apiFaker;

var ucfirst = require("../utils/string");
var { validate, isValidationRule } = require("../utils/validator");

parseRequest = function(rules, datas) {
  const errors = [];

  for (const key in rules) {
    if (rules.hasOwnProperty(key)) {
      const element = rules[key];
      const value = datas[key];
      const params = element.split('|');
      params.forEach(param => {
        if (param === 'required' && !value) {
          errors.push(`Missing${ucfirst(key)}`);
        } else {
          if (value && isValidationRule(param) && !validate(param, value)){
            errors.push(`Invalid${ucfirst(key)}`);
          }
        }
      });
    }
  }
  return errors;
}

function apiFaker(router, file){

  var contents  = fs.readFileSync(file);
  var mocks = JSON.parse(contents);

  console.log('Api Faker is running');
  for (const name in mocks) {
    const currentMock = mocks[name];
    router[currentMock.method.toLowerCase()](currentMock.url, function(req, res, next) {
        const errors = [];
        if (currentMock.request.body) {
          errors.push(...parseRequest(currentMock.request.body, req.body));
        }
        if (currentMock.request.attributes) {
          errors.push(...parseRequest(currentMock.request.attributes, req.params));
        }
        if (errors.length > 0) {
          res.status(400).send(errors);
        } else {
          res.status(currentMock.response.success.status).set(currentMock.response.success.headers).json(currentMock.response.success.body);
        }
    });
  }
}
