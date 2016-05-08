'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/data_quota/new')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'common/dashboard/getDataQuotaNew.json');
    response.json(datas);
});
Router.route('/data_quota/Summary')
  .get(function(request, response) {
      let head = {}, body = {};
      let datas = JsonLoader.sync(Config.path + 'common/dashboard/getDataquotaSummary.json');
      response.json(datas);
    });
Router.route('/data_quota')
  .get(function(request, response) {
    let head = {}, body = {};
    console.log('test');
    let datas = JsonLoader.sync(Config.path + 'common/dashboard/getDataQuota.json');
    response.json(datas);
});
Router.route('/data_requiement/new')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'common/dashboard/getDataRequirementNew.json');
    response.json(datas);
});
Router.route('/data_requiement/summary')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'common/dashboard/getDataRequirementSummary.json');
    response.json(datas);
});
Router.route('/user_dep')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'common/dashboard/getUserDep.json');
    response.json(datas);
});
module.exports = Router;
