'use strict';
const Router = require('express').Router(),
      JsonLoader = require('load-json-file'),
      Config = require('../../config');

Router.route('/dict')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'dict/get.json');
    response.json(datas);
  });

  Router.route('/dict/:id')
    .get(function(request, response) {
      let head = {}, body = {};
      let datas = JsonLoader.sync(Config.path + 'dict/get.json');
      response.json(datas);
    });

module.exports = Router;
