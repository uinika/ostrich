'use strict';
const Router = require('express').Router(),
      JsonLoader = require('load-json-file'),
      Config = require('../../config');

Router.route('/sys_dict')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = {};
    var category = request.query.dict_category;
    console.log('search dict category by id:' + category);
    if(1 == category) {
       datas = JsonLoader.sync(Config.path + 'common/getShareFrequency.json');
    }
    if(2 == category) {
       datas = JsonLoader.sync(Config.path + 'common/getDataLevel.json');
    }
    if(3 == category) {
       datas = JsonLoader.sync(Config.path + 'common/getShareLevel.json');
    }
    if(4 == category) {
       datas = JsonLoader.sync(Config.path + 'common/getDataStoreType.json');
    }
    if(5 == category) {
       datas = JsonLoader.sync(Config.path + 'common/getSecretFlag.json');
    }
    if(6 == category) {
       datas = JsonLoader.sync(Config.path + 'common/getDataShowFormat.json');
    }
    response.json(datas);
  });

module.exports = Router;
