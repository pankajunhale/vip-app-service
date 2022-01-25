var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = (env) => {
  console.log(env);  
  return {
    entry: './src/app.ts',
    target: 'node',
    output: {
      path: path.join(__dirname, 'build'),
      filename: 'backend.js'
    },
    externals: nodeModules,
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: [".ts", ".tsx", ".js"]
    },
    module: {
      rules: [
        // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
        { test: /\.tsx?$/, loader: "ts-loader" }
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env':{          
          "SERVER": JSON.stringify("production"),
          'API_PORT': JSON.stringify(env.port)          
        }
      })
    ]
  }
}
