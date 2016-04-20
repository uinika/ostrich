'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/requirement')
  .get(function(request, response) {
    let head = {},
      body = {};
  });


Router.route('/requirement/getRequirementListByDep')
  .get(function(request, response) {
    let head = {},
      body = {};
    let datas = JsonLoader.sync(Config.path + 'department/getRequirementListByDep.json');
    response.json(datas);
  });

  Router.route('/requirement')
    .post(function(request, response) {
      let head = {},
        body = {};
      let datas = JsonLoader.sync(Config.path + 'department/publishRequirement.json');
      response.json(datas);
    });
module.exports = Router;
