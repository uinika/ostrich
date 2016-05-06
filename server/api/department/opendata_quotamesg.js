'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/opendata_quotamesg')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'department/auditDataQuotaDetail.json');
    response.json(datas);

  });

module.exports = Router;
