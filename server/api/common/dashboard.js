'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/inventory')
  .get(function(request, response) {
    let datas = JsonLoader.sync(Config.path + 'dashboard/getInventory.json');
    response.json(datas);
  });

Router.route('/inventory/overview')
  .get(function(request, response) {
    let datas = JsonLoader.sync(Config.path + 'dashboard/getInventoryOverview.json');
    response.json(datas);
  });

Router.route('/requirement')
  .get(function(request, response) {
    let datas = JsonLoader.sync(Config.path + 'dashboard/getRequirement.json');
    response.json(datas);
  });

Router.route('/requirement/overview')
  .get(function(request, response) {
    let datas = JsonLoader.sync(Config.path + 'dashboard/getRequirementOverview.json');
    response.json(datas);
  });

Router.route('/requirement/overview')
  .get(function(request, response) {
    let datas = JsonLoader.sync(Config.path + 'dashboard/getRequirementOverview.json');
    response.json(datas);
  });

module.exports = Router;
