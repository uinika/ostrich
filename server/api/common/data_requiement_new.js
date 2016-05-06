'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/data_requiement/new')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'common/getDataRequirementNew.json');
    response.json(datas);
  });

module.exports = Router;
