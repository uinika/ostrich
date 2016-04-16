'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/requirementTotal')
  .get(function(request, response) {
    let head = {},
      body = {};
  });


Router.route('/requirementTotal/department')
  .get(function(request, response) {
    let head = {},
      body = {};
    let datas = JsonLoader.sync(Config.path + 'department/getRequirementTotal.json');
    response.json(datas);
  });
module.exports = Router;
