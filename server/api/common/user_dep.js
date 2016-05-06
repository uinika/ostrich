'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/user_dep')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'common/getUserDep.json');
    response.json(datas);
  });

module.exports = Router;
