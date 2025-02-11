/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const PreloadWebpackPlugin = require('preload-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')

const supportedLocales = ['en-US', 'fr']

module.exports = (env, argv) => {
  const IS_DEV = argv.mode === 'development'

  return {
    stats: 'minimal',
    target: 'web',
    watch: IS_DEV,
    devtool: IS_DEV ? 'inline-source-map' : false,
    output: {
      filename: `[name]-[fullhash:8]-bundle.js`,
      chunkFilename: '[name]-[fullhash:8]-bundle.js',
      path: path.join(__dirname, '..', 'dist', 'client'),
      publicPath: '/'
    },
    resolve: {
      alias: {
        '@client/components': path.resolve(__dirname, '../src/client/ts/components'),
        '@client/containers': path.resolve(__dirname, '../src/client/ts/containers'),
        '@client/ts/shared': path.resolve(__dirname, '../src/client/ts/shared'),
        '@client/store': path.resolve(__dirname, '../src/client/ts/store'),
        '@client/utils': path.resolve(__dirname, '../src/client/ts/utils'),
        '@client': path.resolve(__dirname, '../src/client'),
        '@shared': path.resolve(__dirname, '../src/shared'),
        '@src': path.resolve(__dirname, '../src')
      },
      extensions: ['.tsx', '.scss', '.ts', '.js', '.json']
    },
    entry: {
      main: path.join(__dirname, '..', 'src', 'client', 'ts', 'index.tsx'),
      styles: path.join(__dirname, '..', 'src', 'client', 'scss', 'styles.scss')
    },
    devServer: {
      port: 3000,
      overlay: IS_DEV,
      open: IS_DEV,
      openPage: `http://localhost:${3000}`,
      historyApiFallback: true,
      clientLogLevel: 'silent'
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-typescript', '@babel/preset-react'],
                plugins: [
                  '@babel/plugin-syntax-dynamic-import',
                  '@babel/proposal-class-properties',
                  '@babel/proposal-object-rest-spread',
                  [
                    '@babel/plugin-transform-runtime',
                    {
                      regenerator: true
                    }
                  ]
                ]
              }
            }
          ]
        },
        {
          test: /\.md$/,
          use: [
            {
              loader: 'html-loader'
            },
            {
              loader: 'markdown-loader',
              options: {}
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader
            },
            {
              loader: 'css-loader',
              options: {
                url: false
              }
            },
            {
              loader: 'sass-loader',
              options: {
                additionalData: "@import './src/client/scss/global/mixins';"
              }
            }
          ],
          exclude: /node_modules/
        }
      ]
    },
    performance: {
      assetFilter: function (assetFilename) {
        return !assetFilename.startsWith('fonts')
      }
    },
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM'
    },
    plugins: [
      // new BundleAnalyzerPlugin(),
      new webpack.ContextReplacementPlugin(
        /date\-fns[\/\\]/,
        new RegExp(`[/\\\\\](${supportedLocales.join('|')})[/\\\\\]index\.js$`)
      ),
      new RemoveEmptyScriptsPlugin(),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, '..', 'src', 'client', 'html', 'index.html'),
        env: {
          IS_DEV,
          GA_TRACKING_ID: 'UA-163474835-1'
        }
      }),
      // new PreloadWebpackPlugin(), // try without,
      new MiniCssExtractPlugin({
        filename: '[name].[chunkhash:8].css'
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode)
      }),
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css)$/
      }),
      new CopyPlugin({
        patterns: [
          { from: path.join(__dirname, '..', 'src', 'client', 'img'), to: 'images' },
          { from: path.join(__dirname, '..', 'src', 'client', 'fonts'), to: 'fonts' },
          { from: 'static', to: '.' }
        ]
      })
    ]
  }
}
