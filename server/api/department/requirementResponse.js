'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/requirementResponse')
  .get(function(request, response) {
    let head = {},
      body = {};
  });


Router.route('/requirementResponse/department')
  .get(function(request, response) {
    let head = {},
      body = {};
    let datas = JsonLoader.sync(Config.path + 'department/getRequirementResponseTotal.json');
    response.json(datas);
  });
module.exports = Router;
