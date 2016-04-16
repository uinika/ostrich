'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/shareTotal')
  .get(function(request, response) {
    let head = {},
      body = {};
  });


Router.route('/shareTotal/department')
  .get(function(request, response) {
    let head = {},
      body = {};
    let datas = JsonLoader.sync(Config.path + 'department/getShareTotal.json');
    response.json(datas);
  });
module.exports = Router;
