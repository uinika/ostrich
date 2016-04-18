'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/openInventory')
  .get(function(request, response) {
    let head = {},
      body = {};
  });
Router.route('/openInventory/countAll')
  .get(function(request, response) {
    let head = {},
      body = {};
    let datas = JsonLoader.sync(Config.path + 'department/getAuditTotal.json');
    response.json(datas);
  });

Router.route('/openInventory/countByShareLevel')
  .get(function(request, response) {
    let head = {},
      body = {};
    let datas = JsonLoader.sync(Config.path + 'department/getShareLevelFilter.json');
    response.json(datas);
  });

Router.route('/openInventory/countBySpatial')
  .get(function(request, response) {
    let head = {},
      body = {};
    let datas = JsonLoader.sync(Config.path + 'department/getSpatialFilter.json');
    response.json(datas);
  });

Router.route('/openInventory/countByAuditStatus')
  .get(function(request, response) {
    let head = {},
      body = {};
    let datas = JsonLoader.sync(Config.path + 'department/getAuditStatusFilter.json');
    response.json(datas);
  });
Router.route('/openInventory/inventoryList')
  .get(function(request, response) {
    let head = {},
      body = {};
    let datas = JsonLoader.sync(Config.path + 'department/getAuditList.json');
    response.json(datas);
  });
module.exports = Router;
