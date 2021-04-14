const webpack= require('webpack')
const path = require('path')
const TerserPlugin = require("terser-webpack-plugin");
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')

module.exports = {
  mode: 'production',
  target: 'node',
  entry: {
    index: path.resolve(__dirname, "./index.js")
  },
  output: {
		path: path.resolve(__dirname, "./dist/"),    // 打包好的文件输出的路径
		filename: "[name].js",
		// publicPath: "/",                  // 指定 HTML 文件中资源文件 (字体、图片、JS文件等) 的文件名的公共 URL 部分的
		// chunkFilename: 'js/[name].[hash:6].js'      // 按需加载时打包的chunk
  },
	module: {
		rules: [
			{
				test: /.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/
        
			},
		]
	},
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          compress: {
            pure_funcs: ["console.log"]
          }
        }
      }),
      // new OptimizeCssAssetsPlugin()
    ]
  },

  plugins: [
    // new webpack.LoaderOptionsPlugin({ minimize: true }),
    new CleanWebpackPlugin(),
  ]
};