'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/data_quota/new')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'common/getDataQuotaNew.json');
    response.json(datas);
});
Router.route('/data_quota/Summary')
  .get(function(request, response) {
      let head = {}, body = {};
      let datas = JsonLoader.sync(Config.path + 'common/getDataquotaSummary.json');
      response.json(datas);
    });
Router.route('/data_quota')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'common/getDataQuota.json');
    response.json(datas);
});
Router.route('/data_requiement/new')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'common/getDataRequirementNew.json');
    response.json(datas);
});
Router.route('/data_requiement/summary')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'common/getDataRequirementSummary.json');
    response.json(datas);
});
Router.route('/user_dep')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'common/getUserDep.json');
    response.json(datas);
});
module.exports = Router;
