var path = require('path');

module.exports = function(config) {
    config.set({
        browsers: [
            'PhantomJS'
        ],
        frameworks: ['jasmine'],
        files: ['spec/index.js'],
        reporters: ['coverage-istanbul', 'spec'],
        preprocessors: {
            'spec/index.js': ['webpack']
        },
        webpack: {
            devtool: 'source-map',
            module: {
                rules: [{
                    test: /\.vue$/,
                    loader: 'vue-loader'
                }, {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/
                }, {
                    test: /(\.js|\.vue)$/,
                    enforce: 'post',
                    include: path.resolve('src/'),
                    loader: 'istanbul-instrumenter-loader',
                    query: {
                        esModules: true
                    }
                }]
            }
        },
        coverageIstanbulReporter: {

            // reports can be any that are listed here: https://github.com/istanbuljs/istanbul-reports/tree/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib 
            reports: ['html', 'lcovonly', 'text-summary'],

            // base output directory. If you include %browser% in the path it will be replaced with the karma browser name 
            dir: path.join(__dirname, 'coverage'),

            // if using webpack and pre-loaders, work around webpack breaking the source path 
            fixWebpackSourcePaths: true,

            // stop istanbul outputting messages like `File [${filename}] ignored, nothing could be mapped` 
            skipFilesWithNoCoverage: true,

            // Most reporters accept additional config options. You can pass these through the `report-config` option 
            'report-config': {

                // all options available at: https://github.com/istanbuljs/istanbul-reports/blob/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib/html/index.js#L135-L137 
                html: {
                    // outputs the report in ./coverage/html 
                    subdir: 'html'
                }

            }
        },
        singleRun: true
    })
}
