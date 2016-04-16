'use strict';
const Router = require('express').Router(),
      JsonLoader = require('load-json-file'),
      Config = require('../../config');

Router.route('/dict')
  .get(function(request, response) {
    let head = {}, body = {};
    var category = request.query.DICT_CATEGORY;
    let datas = {};
    if(category == '1') {
       datas = JsonLoader.sync(Config.path + 'dict/get1.json');
    }
    if(category == 2) {
       datas = JsonLoader.sync(Config.path + 'dict/get2.json');
    }
    if(category == 3) {
       datas = JsonLoader.sync(Config.path + 'dict/get3.json');
    }
    if(category == 4) {
       datas = JsonLoader.sync(Config.path + 'dict/get4.json');
    }
    if(category == 5) {
       datas = JsonLoader.sync(Config.path + 'dict/get5.json');
    }
    if(category == 6) {
       datas = JsonLoader.sync(Config.path + 'dict/get6.json');
    }
    //let datas = JsonLoader.sync(Config.path + 'dict/get.json');
    response.json(datas);
  });

  Router.route('/dict/:id')
    .get(function(request, response) {
      let head = {}, body = {};
      let datas = JsonLoader.sync(Config.path + 'dict/get.json');
      response.json(datas);
    });

module.exports = Router;
