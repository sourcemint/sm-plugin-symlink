
const PATH = require("path");
const URL = require("url");


exports.for = function(API, plugin) {

    plugin.resolveLocator = function(locator, options, callback) {
        var self = this;

        if (!locator.url) {
            locator.url = locator.descriptor.pointer;
        }

        locator.getLocation = function(type) {
            var locations = {
                "pointer": locator.url
            };
            locations.symlink = locator.url;
            return (type)?locations[type]:locations;
        }

        return callback(null, locator);
    }

    plugin.download = function(uri, options, callback) {

        var parsedUri = URL.parse(uri);

        if (!API.FS.existsSync(parsedUri.pathname)) {
            return callback(null, {
                status: 404,
                cachePath: parsedUri.pathname
            });
        }
        return callback(null, {
            status: 200,
            cachePath: parsedUri.pathname
        });
    }

    plugin.extract = function(fromPath, toPath, locator, options) {
        if (!API.FS.existsSync(PATH.dirname(toPath))) {
            API.FS.mkdirsSync(PATH.dirname(toPath));
        }
        API.FS.symlinkSync(fromPath, toPath);
        return API.Q.resolve();
    }

}
