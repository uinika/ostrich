'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/data_requiement')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'department/dataRequirementList.json');
    response.json(datas);

  });

  Router.route('/data_requiement')
    .post(function(request, response) {
      let head = {}, body = {};
      let datas = JsonLoader.sync(Config.path + 'department/saveDataRequirement.json');
      response.json(datas);

    });

    Router.route('/data_requiement')
      .put(function(request, response) {
        let head = {}, body = {};
        let datas = JsonLoader.sync(Config.path + 'department/updateDataRequirement.json');
        response.json(datas);

      });

module.exports = Router;
