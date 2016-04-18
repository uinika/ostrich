'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/user')
  .get(function(request, response) {
    let head = {},
      body = {};
    let datas = JsonLoader.sync(Config.path + 'department/getUserList.json');
    response.json(datas);
  });

  Router.route('/user')
    .post(function(request, response) {
      let head = {},
        body = {};
      let datas = JsonLoader.sync(Config.path + 'department/addUser.json');
      response.json(datas);
    });
module.exports = Router;
