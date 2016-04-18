'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

  Router.route('/audit')
    .get(function(request, response) {
      let head = {},
        body = {};
      let datas = JsonLoader.sync(Config.path + 'department/getAuditTotal.json');
      response.json(datas);
    });

    Router.route('/audit/shareLevelFilter')
      .get(function(request, response) {
        let head = {},
          body = {};
        let datas = JsonLoader.sync(Config.path + 'department/getShareLevelFilter.json');
        response.json(datas);
      });

      Router.route('/audit/areaPeriodFilter')
        .get(function(request, response) {
          let head = {},
            body = {};
          let datas = JsonLoader.sync(Config.path + 'department/getAreaPeriodFilter.json');
          response.json(datas);
        });

        Router.route('/audit/auditStatusFilter')
          .get(function(request, response) {
            let head = {},
              body = {};
            let datas = JsonLoader.sync(Config.path + 'department/getAuditStatusFilter.json');
            response.json(datas);
          });
          Router.route('/audit/auditList')
            .get(function(request, response) {
              let head = {},
                body = {};
              let datas = JsonLoader.sync(Config.path + 'department/getAuditList.json');
              response.json(datas);
            });
module.exports = Router;
