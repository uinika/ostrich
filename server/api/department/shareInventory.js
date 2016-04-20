'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/shareInventory')
  .get(function(request, response) {
  });

  Router.route('/shareInventory/countByShareLevel')
    .get(function(request, response) {
      let datas = JsonLoader.sync(Config.path + 'department/countByShareLevel.json');
      response.json(datas);
    });
    Router.route('/shareInventory/countBySpatial')
      .get(function(request, response) {
        let datas = JsonLoader.sync(Config.path + 'department/countBySpatial.json');
        response.json(datas);
      });
module.exports = Router;
