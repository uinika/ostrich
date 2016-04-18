'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/getDepWithInventoryNum')
  .get(function(request, response) {
    let datas = JsonLoader.sync(Config.path + 'inventory/getDepWithInventoryNum.json');
    response.json(datas);
  });

module.exports = Router;
