'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/data_quota')
  .get(function(request, response) {
    let head = {},
      body = {};
    let datas = JsonLoader.sync(Config.path + 'department/dataQuotaList.json');
    response.json(datas);

  });

Router.route('/data_quota')
  .post(function(request, response) {
    let datas = JsonLoader.sync(Config.path + 'department/saveDataQuota.json');
    response.json(datas);
  });

Router.route('/data_quota')
  .put(function(request, response) {
    let datas = JsonLoader.sync(Config.path + 'department/deleteDataQuota.json');
    response.json(datas);
  });

module.exports = Router;
