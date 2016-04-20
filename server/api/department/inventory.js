'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/inventory')
  .get(function(request, response) {
    let head = {},
      body = {};

  });

Router.route('/inventory')
  .post(function(request, response) {
    let datas = JsonLoader.sync(Config.path + 'department/post.json');
    response.json(datas);
  });

Router.route('/inventory/department')
  .get(function(request, response) {
    let datas = JsonLoader.sync(Config.path + 'department/getInventoryList.json');
    response.json(datas);
  });

Router.route('/inventory/inventoryListByDep')
  .get(function(request, response) {
    let datas = JsonLoader.sync(Config.path + 'department/getInventoryListByDep.json');
    response.json(datas);
  });

Router.route('/inventory/getDepWithInventoryNumByDep')
  .get(function(request, response) {
    let datas = JsonLoader.sync(Config.path + 'department/getDepWithInventoryNumByDep.json');
    response.json(datas);
  });

Router.route('/inventory/getShareDictWithInventoryNumByDep')
  .get(function(request, response) {
    let datas = JsonLoader.sync(Config.path + 'department/getShareDictWithInventoryNumByDep.json');
    response.json(datas);
  });

  Router.route('/inventory/getAreaDictWithInventoryNumByDep')
    .get(function(request, response) {
      let datas = JsonLoader.sync(Config.path + 'department/getAreaDictWithInventoryNumByDep.json');
      response.json(datas);
    });

module.exports = Router;
