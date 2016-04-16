'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/dep')
  .get(function(request, response) {
    let datas = JsonLoader.sync(Config.path + 'department/getDepartmentList.json');
    response.json(datas);
  });

module.exports = Router;
