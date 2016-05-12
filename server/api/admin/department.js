'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

Router.route('/sys_dep')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = {};
    var depname = request.query.dep_name;
    console.log("23");
    if(undefined == depname) {
      datas = JsonLoader.sync(Config.path + 'admin/getDepList.json');
    }else {
      datas = JsonLoader.sync(Config.path + 'admin/getDep.json');
    }
    response.json(datas);
});
Router.route('/sys_dep/count')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'admin/getDepTotal.json');
    response.json(datas);
});
Router.route('/sys_dict')
  .get(function(request, response) {
    let head = {}, body = {};
    let datas = {};
    var category = request.query.dict_category;
    if(2 == category) {
      datas = JsonLoader.sync(Config.path + 'common/getDataLevel.json');
    }
    if(7 == category) {
      datas = JsonLoader.sync(Config.path + 'common/getDepartments.json');
    }
    response.json(datas);
});
Router.route('/sys_dep')
  .post(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'admin/saveDepartment.json');
    response.json(datas);
});
Router.route('/sys_dep')
  .put(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'admin/updateDepartment.json');
    response.json(datas);
});
Router.route('/sys_dep')
  .delete(function(request, response) {
    let head = {}, body = {};
    let datas = JsonLoader.sync(Config.path + 'admin/deleteDepartment.json');
    response.json(datas);
});
module.exports = Router;
