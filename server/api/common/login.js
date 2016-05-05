'use strict';
const Router = require('express').Router(),
      JsonLoader = require('load-json-file'),
      Config = require('../../config'),
      mongo = require('../mongo.js');

Router.route('/login')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'login.json');
    response.json(datas);
  });

module.exports = Router;
