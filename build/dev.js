process.env.NODE_ENV = 'development';
const chalk = require("chalk");
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackHotMiddleware = require('webpack-hot-middleware');
const render_WebpackConfig = require('./webpack.render.config.js');
const main_WebpackConfig = require('./webpack.main.config.js');

const { spawn } = require('child_process');
const electron = require('electron');
const path = require('path')

// 构建Render进程
function buildRender() {
  return new Promise((resolve, reject) => {
    console.log("=============打包Render开始==================\n");
    const renderCompiler = webpack(render_WebpackConfig);
    new WebpackDevServer(
      renderCompiler, {
      contentBase: render_WebpackConfig.output.path,
      publicPath: render_WebpackConfig.output.publicPath,
      open: true,//打开默认浏览器
      inline: true,//刷新模式
      hot: true,//热更新
      quiet: true,//除第一次编译外，其余不显示编译信息
      progress: true,//显示打包进度
      setup(app) {
        app.use(webpackHotMiddleware(renderCompiler));
        app.use('*', (req, res, next) => {
          if (String(req.originalUrl).indexOf('.html') > 0) {
            console.log(req.originalUrl)
            getHtml(res);
          } else {
            next();
          }
        });
      }
    }
    ).listen(8080, function (err) {
      if (err) {
        reject()
        return console.log(err);
      }
      console.log(`Listening at http://localhost:8080`);
    });
    renderCompiler.hooks.done.tap('doneCallback', (stats) => {
      const compilation = stats.compilation;
      Object.keys(compilation.assets).forEach(key => console.log(chalk.blue(key)));
      compilation.warnings.forEach(key => console.log(chalk.yellow(key)));
      compilation.errors.forEach(key => console.log(chalk.red(`${key}:${stats.compilation.errors[key]}`)));
      console.log(chalk.green(`${chalk.white('渲染进程调试完毕\n')}time:${(stats.endTime - stats.startTime) / 1000} s`));
      resolve()
    });
  })
}
function getHtml(res) {
  http.get(`http://localhost:8080`, (response) => {
    response.pipe(res);
  }).on('error', (err) => {
    console.log(err);
  });
}

// 构建Main进程
function buildMain() {
  return new Promise((resolve, reject) => {
    console.log('=============打包Main开始==================\n');
    let log = '';
    const mainCompiler = webpack(main_WebpackConfig);
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

// 启动Electron
function startElectron() {
  let electronProcess = spawn(electron, [path.join(process.cwd(), 'dist/electron/main.js')]);
  electronProcess.stdout.on('data', data => {
    // 正常输出为蓝色
    electronLog(data, 'blue');
  });
  electronProcess.stderr.on('data', data => {
    // 错误信息为红色
    electronLog(data, 'red');
  });
}

// 美化输出
function electronLog(data, color) {
  let log = '';
  data.toString().split(/\r?\n/).forEach(line => {
    log += `\n${line}`;
  });
  if (/[0-9A-z]+/.test(log)) {
    console.log(
      chalk[color].bold('┏ Electron -------------------') +
      log +
      chalk[color].bold('┗ ----------------------------')
    );
  }
}


// 构建
async function devRun() {
  await buildRender()
  await buildMain()
  startElectron();
}

devRun();
