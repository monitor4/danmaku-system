'use strict';
var fs = require('fs');
const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    ctx.body = "ei egg!"
    
  }
}

module.exports = HomeController;
