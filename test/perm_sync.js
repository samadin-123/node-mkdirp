var mkdirp = require('../');
var path = require('path');
var fs = require('fs');
var exists = fs.exists || path.exists;
var test = require('tap').test;
var _0777 = parseInt('0777', 8);
var _0755 = parseInt('0755', 8);

test('sync perm', function (t) {
    var file = '/tmp/' + (Math.random() * (1<<30)).toString(16) + '.json';
    
    mkdirp.sync(file, _0755);
    exists(file, function (ex) {
        t.ok(ex, 'file created');
        fs.stat(file, function (err, stat) {
            if (err) throw err
            t.equal(stat.mode & _0777, _0755);
            t.ok(stat.isDirectory(), 'target not a directory');
            t.end()
        });
    });
});

test('sync root perm', function (t) {
    var file = '/tmp';
    mkdirp.sync(file, _0755);
    exists(file, function (ex) {
        t.ok(ex, 'file created');
        fs.stat(file, function (err, stat) {
            if (err) throw err
            t.ok(stat.isDirectory(), 'target not a directory');
            t.end()
        })
    });
});
