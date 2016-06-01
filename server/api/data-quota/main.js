'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/menu')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'data-quota/menu.json');
    response.json(datas);
  });
Router.route('/resource/sys_dict')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'data-quota/getDataQuotaList.json');
    response.json(datas);
   });

module.exports = Router;
