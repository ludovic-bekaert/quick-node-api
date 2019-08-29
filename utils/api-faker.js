var fs = require("fs");
const database = require('../api/database')();

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

  for (const name in mocks) {
    const currentMock = mocks[name];
    router[currentMock.method.toLowerCase()](currentMock.url, function(req, res, next) {
        const errors = [];
        if (currentMock.request.body) {
          errors.push(...parseRequest(currentMock.request.body, req.body));
        }
        if (currentMock.request.attributes) {
          errors.push(...parseRequest(currentMock.request.attributes, req.query));
        }
        if (errors.length > 0) {
          res.status(400).send(errors);
        } else if(!database[currentMock.model]) {
          res.status(500).json([
            `Table ${currentMock.model} does not exist`,
          ]);
        } else {
          // setTimeout(() => {
            let body = parseResponse(currentMock, req) || currentMock.response.success.body;
            res.status(currentMock.response.success.status).set(currentMock.response.success.headers).json(body);
          // }, 3000);
        }
    });
  }
}

function parseResponse(mock, req) {
  if (mock.method === 'GET') {
    let list = database[mock.model].data;

    if (req.params.id) { // GET
      return list.find((item) => String(item.id) === String(req.params.id));
    } else { // LIST
      for (const key in req.params) {
        list = list.filter((item) => String(item[key]) === String(req.params[key]));
      }
      return list;
    }
  } else if (mock.method === 'POST') {
    if (!database[mock.model].data) {
      database[mock.model].data = [];
    }
    const nextId = database[mock.model].reduce((res, item) => (item.id >= res) ? item.id + 1 : res, 1);
    database[mock.model].data.push({ ...req.body, id: nextId});
    return {...req.body, id: nextId};
  } else if (mock.method === 'PUT') {
    database[mock.model].data = database[mock.model].data.map((item) => {
      if (String(item.id) === String(req.params.id)) {
        return {
          ...item,
          ...req.body,
        }
      }
      return item;
    });
    return database[mock.model].data.find((item) => String(item.id) === String(req.params.id));
  } else if (mock.method === 'DELETE') {
    database[mock.model].data = database[mock.model].data.filter((item) => String(item.id) !== String(req.params.id));
  }
}
