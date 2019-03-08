var fs = require('fs');
const Controller = require('egg').Controller;
module.exports = class ApiController extends Controller {
  post() {
    var data = JSON.parse(fs.readFileSync('./app/public/danmaku.json', 'utf8'));
    data.list.push(this.ctx.request.body)
    if (data.list.length > 3000) {
      data.list.shift();
    }
    fs.writeFileSync('./app/public/danmaku.json', JSON.stringify(data));
    this.ctx.body = {
      name: this.ctx.request.body.name,
    }
  }
  get() {
    var data = JSON.parse(fs.readFileSync('./app/public/danmaku.json', 'utf8'));
    this.ctx.body = data;
  }
};