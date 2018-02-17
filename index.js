const fs = require('fs');
const Path = require('path');
const Handlebars = require('handlebars');
const Promise = require('promise');
const FileTree = require('web-template-file-tree');
const readFile = Promise.denodeify(fs.readFile);

// property "partials" is path to directory of all partial templates, relative to view root
renderView.partials = '.';

function renderView(filePath, options, cb) {
    /*
     this.root is the "views" setting, e.g. "/path/to/views"
     this.defaultEngine is the selected engine, e.g. "html"
     this.ext is the extension, e.g. ".html"
     */

    var didInitialize = false;

    const initialize = () => {
        if (didInitialize) {
            return Promise.resolve(true);
        }
        else {
            var partialsPath = Path.join(this.root, renderView.partials);
            var extension = this.defaultEngine;
            return registerPartials(partialsPath, extension)
                .then(r => {
                    didInitialize = true;
                });
        }
    };

    initialize()
        .then(r => {
            return readFile(filePath);
        })
        .then(data => {
            var output;
            var template = String(data);
            var render = Handlebars.compile(template);
            output = render(options);
            return output;
        })
        .then(r => {
            cb(null, r);
        }, e => {
            cb(e);
        })
    ;
}

function registerPartials(directory, extension) {
    return createFileTree(directory, extension)
        .then(fileTree => {
            Handlebars.registerPartial(fileTree.cache);
        })
        ;
}

function createFileTree(directory, extension) {
    return new Promise((resolve, reject) => {
        var fileTree = new FileTree(directory, {
            extension: extension,
        });
        fileTree.load((err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(fileTree);
            }
        });
    });
}

module.exports = renderView;
