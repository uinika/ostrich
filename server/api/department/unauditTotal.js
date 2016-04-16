'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/unauditTotal')
  .get(function(request, response) {
    let head = {},
      body = {};
  });


Router.route('/unauditTotal/department')
  .get(function(request, response) {
    let head = {},
      body = {};
    let datas = JsonLoader.sync(Config.path + 'department/getUnauditTotal.json');
    response.json(datas);
  });
module.exports = Router;
