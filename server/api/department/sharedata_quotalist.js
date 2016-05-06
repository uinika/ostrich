'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/sharedata_quotalist')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'department/shareDataQuotaList.json');
    response.json(datas);

  });

module.exports = Router;
