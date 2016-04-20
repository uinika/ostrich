'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/inventory')
  .get(function(request, response) {
    let head = {},
      body = {};

  });

Router.route('/inventory')
  .post(function(request, response) {
    let datas = JsonLoader.sync(Config.path + 'department/post.json');
    response.json(datas);
  });

Router.route('/inventory/department')
  .get(function(request, response) {
    let datas = JsonLoader.sync(Config.path + 'department/getInventoryList.json');
    response.json(datas);
  });

module.exports = Router;
