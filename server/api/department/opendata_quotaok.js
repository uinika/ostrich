'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

/* 指标审核 */
Router.route('/opendata_quotaok')
  .put(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'department/updateDataQuotaAudit.json');
    response.json(datas);

  });

module.exports = Router;
