'use strict';
const Router = require('express').Router(),
  JsonLoader = require('load-json-file'),
  Config = require('../../config');

// Router.route('/upload')
//   .get(function(request, response) {
//     let head = {}, body = {};
//
//   });
//
//   Router.route('/upload/excel')
//     .post(function(request, response) {
//       let head = {}, body = {};
//       let datas = JsonLoader.sync(Config.path + 'department/uploadExamples.json');
//       response.json(datas);
//
//     });

module.exports = Router;
