'use strict';
const Router = require('express').Router(),
      JsonLoader = require('load-json-file'),
      Config = require('../../config');

Router.route('/login')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = {};
    var username = request.query.username;
    if("admin"==username){
      datas = JsonLoader.sync(Config.path + 'login1.json');
    }else {
      datas = JsonLoader.sync(Config.path + 'login.json');
    }
    response.json(datas);
  });

module.exports = Router;
