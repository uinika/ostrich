'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/dataAuditInfoTotal')
  .get(function(request, response) {
    let head = {},
      body = {};
  });
Router.route('/dataAuditInfoTotal/department')
  .get(function(request, response) {
    let head = {},
      body = {};
    let datas = JsonLoader.sync(Config.path + 'department/getDataAuditInfoTotal.json');
    response.json(datas);
  });
module.exports = Router;
