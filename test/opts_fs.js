var mkdirp = require('../');
var path = require('path');
var test = require('tap').test;
var _0777 = parseInt('0777', 8);
var _0755 = parseInt('0755', 8);

test('opts.fs', function (t) {
    var x = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
    var y = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
    var z = Math.floor(Math.random() * Math.pow(16,4)).toString(16);
    
    var fs = require('fs')
    var file = '/beep/boop/' + [x,y,z].join('/');
    var calledMockMkdir = false
    var calledMockMkdirSync = false
    var calledMockStat = false
    var calledMockStatSync = false
    var xfs = {
        ...fs,
        stat: function (path, callback) {
            calledMockStat = true
            return fs.stat(__dirname, callback)
        },
        statSync: function (path) {
            calledMockStatSync = true
            return fs.statSync(__dirname)
        },
        mkdir: function (path, options, callback) {
            calledMockMkdir = true
            process.nextTick(callback)
        },
        mkdirSync: function (path, options) {
            calledMockMkdirSync = true
        },
    }
    t.test('async', t => {
        mkdirp(file, { fs: xfs, mode: _0755 }, function (err) {
            if (err) throw err
            fs.exists(file, function (ex) {
                t.ok(!ex, 'did not create actual file');
                xfs.stat(file, function (err, stat) {
                    if (err) throw err;
                    t.ok(calledMockStat, 'called mock stat');
                    t.ok(calledMockMkdir, 'called mock mkdir');
                    t.equal(stat.mode & _0777, _0755);
                    t.ok(stat.isDirectory(), 'target is a directory');
                    t.end()
                });
            });
        });
    });
    t.test('sync', t => {
        mkdirp.sync(file, { fs: xfs, mode: _0755 })
        fs.exists(file, function (ex) {
            t.ok(!ex, 'did not create actual file');
            var stat = xfs.statSync(file)
            t.ok(calledMockStatSync, 'called mock statSync');
            t.ok(calledMockMkdirSync, 'called mock mkdirSync');
            t.equal(stat.mode & _0777, _0755);
            t.ok(stat.isDirectory(), 'target is a directory');
            t.end()
        });
    });
    t.end()
});
