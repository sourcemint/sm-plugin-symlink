
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
            locations.archive = locator.url;
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
        var self = this;
        if (!API.FS.existsSync(PATH.dirname(toPath))) {
            API.FS.mkdirsSync(PATH.dirname(toPath));
        }
        /*
        // TODO: If package mapping has relative path then we use relative path here.
        // NOTE: We don't use a relative symlink by default even if link is internal to package.
        //       This is important as the final package may be linked together from various directories
        //       causing relative links to point to wrong location.
        if (self.node.parent && fromPath.substring(0, self.node.parent.path.length) === self.node.parent.path) {
            API.FS.symlinkSync(PATH.relative(PATH.dirname(self.node.path), fromPath), toPath);
        } else {
            API.FS.symlinkSync(fromPath, toPath);
        }
        */
        API.FS.symlinkSync(fromPath, toPath);
        return API.Q.resolve();
    }
}
