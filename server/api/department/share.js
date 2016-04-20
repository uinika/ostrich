'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/shareInventory')
  .get(function(request, response) {
    let head = {},
      body = {};
  });


Router.route('/shareInventory/inventoryList')
  .get(function(request, response) {
    let head = {},
      body = {};
    let datas = JsonLoader.sync(Config.path + 'department/getShareInventoryList.json');
    response.json(datas);
  });

  Router.route('/shareInventory/countAll')
    .get(function(request, response) {
      let head = {},
        body = {};
      let datas = JsonLoader.sync(Config.path + 'department/getShareInventoryTotal.json');
      response.json(datas);
    });
module.exports = Router;
