/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = {};
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1551690431206_1266';
  config.security = {
    csrf:false
  }
  // add your middleware config here
  config.middleware = [];
  config.static = {
    // 静态化访问前缀,如：`http://127.0.0.1:7001/static/images/logo.png`
    prefix: '/',  // `String` or `Array:[dir1, dir2, ...]` 静态化目录,可以设置多个静态化目录
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  
  
  return {
    ...config,
    ...userConfig,
  };
};