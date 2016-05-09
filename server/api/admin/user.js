'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/sys_user-sys_dep')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'admin/getUserList.json');
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

Router.route('/sys_dep')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'admin/getDepList.json');
    response.json(datas);
});
module.exports = Router;
