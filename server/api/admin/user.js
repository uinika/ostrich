'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/sys_user')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = {};
    var username = request.query.username;
    if(undefined == username) {
      datas = JsonLoader.sync(Config.path + 'admin/getUserList.json');
    }
    if(username != null) {
      datas = JsonLoader.sync(Config.path + 'admin/getUser.json');
    }
    response.json(datas);
});
Router.route('/sys_user')
  .post(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'admin/saveUser.json');
    response.json(datas);
});
Router.route('/sys_user')
  .put(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'admin/updateUser.json');
    response.json(datas);
});
Router.route('/sys_user')
  .delete(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'admin/deleteUser.json');
    response.json(datas);
});
Router.route('/sys_user/count')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'admin/getUserTotal.json');
    response.json(datas);
});
Router.route('/sys_user/password')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'admin/getUserTotal.json');
    response.json(datas);
});
Router.route('/sys_user/password')
  .put(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'admin/getUserTotal.json');
    response.json(datas);
});

Router.route('/sys_dep')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'admin/getDepList.json');
    response.json(datas);
});
module.exports = Router;
