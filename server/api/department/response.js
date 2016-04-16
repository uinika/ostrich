'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/response')
  .get(function(request, response) {
  });

  Router.route('/response/department')
    .get(function(request, response) {
      let datas = JsonLoader.sync(Config.path + 'department/getResponseList.json');
      response.json(datas);
    });
module.exports = Router;
