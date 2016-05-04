'use strict';
const Router = require('express').Router(),
      JsonLoader = require('load-json-file'),
      Config = require('../../config');

Router.route('/sys_dict')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'common/getSysDict.json');
    response.json(datas);
  });

module.exports = Router;
