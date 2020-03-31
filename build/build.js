/**
* Tip:    打包
* Author: haoluo
* Data:   2019-10-30
**/
process.env.NODE_ENV = 'production';
const chalk = require("chalk");
const webpack = require('webpack');
const renderConfig = require('./webpack.render.config.js');
const builder = require('electron-builder');

function runBuildRender(){
    return new Promise((resolve,reject)=>{
        buildRender().then(data => {
            resolve()
            console.log("\n=============打包输出==================\n", data)
        }).catch(err => {
            console.error("\n=============打包出错==================\n\n", err);
            reject(err)
            process.exit(1);
        });
    })
}
// 构建Render进程
function buildRender() {
    return new Promise((resolve, reject) => {
        console.log("=============打包Render开始==================\n");
        const renderCompiler = webpack(renderConfig);
        renderCompiler.run((err, stats) => {
            if (err) {
                console.log(chalk.red("打包Render进程遇到Error！"));
                reject(chalk.red(err));
            } else {
                let log = "";
                stats.compilation.errors.forEach(key => {
                    log += chalk.red(`${key}:${stats.compilation.errors[key]}`) + "\n";
                })
                stats.compilation.warnings.forEach(key => {
                    log += chalk.yellow(key) + "\n";
                })
                Object.keys(stats.compilation.assets).forEach(key => {
                    log += chalk.blue(key) + "\n";
                })
                log += chalk.green(`打包用时：${(stats.endTime-stats.startTime)/1000} s\n`) + "\n";
                log += "\n=============打包Render完成==================\n";
                
                resolve(`${log}`);
            }
        })
    })
}
// 构建Main进程
function buildMain() {
    return new Promise((resolve, reject) => {
      console.log('=============打包Main开始==================\n');
      const mainWebpackConfig = require('./webpack.main.config.js');
      let log = '';
      const mainCompiler = webpack(mainWebpackConfig);
      mainCompiler.run((err, stats) => {
        let errorInfo = '';
        if (err) {
          console.log('打包Main进程遇到Error！');
          reject(chalk.red(err));
        } else {
          Object.keys(stats.compilation.assets).forEach(key => {
            log += chalk.blue(key) + '\n';
          })
          stats.compilation.warnings.forEach(key => {
            log += chalk.yellow(key) + '\n';
          })
          stats.compilation.errors.forEach(key => {
            errorInfo += chalk.red(`${key}:${stats.compilation.errors[key]}`) + '\n';
          })
          log += errorInfo + chalk.green(`打包用时：${(stats.endTime - stats.startTime) / 1000} s\n`) + "\n";
          console.log('\n=============打包Main完成==================\n', log);
          if (errorInfo) {
            reject(errorInfo)
          } else {
            resolve(log);
          }
        }
      });
    });
  }
// 构建
async function build() {
    await runBuildRender()
    await buildMain()

    builder.build().then(() => {
        // 为了方便，打包完成之后我们打开文件管理器
        openFileManager();
    });
}

build();