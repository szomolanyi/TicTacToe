var webpack = require("webpack");

module.exports = {
    devtool: "source-map",
    entry: "./src/index.js",  //náš vstupní bod aplikace
    output: {
        filename: "bundle.js"   //výstupní balík všech zdrojových kódů
    },
    module: { //sem budeme zanedlouho vkládat transformační moduly
        loaders : [
            {
                test: /.css$/,
                loader: "style!css",
                exclude: "node_modules"
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['eslint-loader', 'babel-loader?presets[]=es2015']
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ]
};
