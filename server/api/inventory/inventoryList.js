'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/inventory/getDepWithInventoryNum')
  .get(function(request, response) {
    let datas = JsonLoader.sync(Config.path + '/inventory/getDepWithInventoryNum.json');
    response.json(datas);
  });

Router.route('/inventory/getShareDictWithInventoryNum')
  .get(function(request, response) {
    let datas = JsonLoader.sync(Config.path + '/inventory/getShareDictWithInventoryNum.json');
    response.json(datas);
  });

Router.route('/inventory/getAreaDictWithInventoryNum')
  .get(function(request, response) {
    let datas = JsonLoader.sync(Config.path + '/inventory/getAreaDictWithInventoryNum.json');
    response.json(datas);
  });

Router.route('/inventory/inventoryList')
  .get(function(request, response) {
    let datas = JsonLoader.sync(Config.path + '/inventory/inventoryList.json');
    response.json(datas);
  });

Router.route('/inventory/updateVisitCount')
  .put(function(request, response) {
    let datas = JsonLoader.sync(Config.path + '/inventory/updateVisitCount.json');
    response.json(datas);
  });

module.exports = Router;
