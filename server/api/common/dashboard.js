'use strict';
const Router = require('express').Router(),
      JsonLoader = require('load-json-file'),
      Config = require('../../config');

Router.route('/dashboard')
  .get(function(request, response) {
    let head = {}, body = {};

  });

Router.route('/dashboard/overview')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'dashboard/overview.json');
    response.json(datas);
  });

module.exports = Router;
