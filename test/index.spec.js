const should = require('should');
const sinon = require('sinon');
require('should-sinon');

var hbsEngine = require('../');

describe('hbsEngine', () => {

    it('should be a function', () => {
        should(hbsEngine).be.a.Function();
    });

    describe('.partials', () => {
        it('should have a default value', () => {
            should(hbsEngine.partials).eql('.');
        });
    });

    describe('rendering index', () => {
        var context, file, options, actualErr, actualData;
        beforeEach((done) => {
            context = {
                root: __dirname + '/views',
                defaultEngine: 'hbs',
            };
            file = __dirname + '/views/index.hbs';
            options = {name: 'Test1'};
            hbsEngine.call(context, file, options, (err, data) => {
                actualErr = err;
                actualData = data;
                done();
            });
        });

        it('should set no error', () => {
            should(actualErr).not.be.ok();
        });

        it('should return correct data', () => {
            should(actualData).eql('This is an example called Test1.\n');
        });

    });

});
