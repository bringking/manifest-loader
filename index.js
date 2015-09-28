var recursive = require('recursive-readdir');
var loaderUtils = require("loader-utils");
var assign = require("lodash.assign");
/**
 * This is a very naive webpack manifest loader. Given a path of files, it will return a json array of those files to be
 * passed to a resource loader
 * @param source
 * @returns {*}
 */
module.exports = function( source ) {

    var query = loaderUtils.parseQuery(this.query);
    var callback = this.async();
    var configKey = query.config || "manifestLoader";
    var config = {};
    this.cacheable();

    //get the config
    if ( this.options[configKey] ) {
        config = assign(config, this.options[configKey]);
    }

    //add a dep to that path
    this.addDependency(config.assetsPath);

    //read the files
    recursive(config.assetsPath, config.ignore, function( err, files ) {

        //return the error
        if ( err ) {
            callback(err);
        }

        var output;
        //rewrite the paths to be relative
        if ( config.rewritePath ) {
            output = files.map(function( f ) {
                return f.slice(f.indexOf(config.rewritePath), f.length);
            });
        } else {
            output = files;
        }

        //return
        callback(null, output);
    });
};