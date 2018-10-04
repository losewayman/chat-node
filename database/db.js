var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017";

var dbinsert = function(database, table, data, callback) {
    var obj;
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) {
            obj = {
                'status': '0',
                'msg': '数据库连接错误',
                'error': err
            };
            callback(err, obj);
        } else {
            var dbo = db.db(database);
            dbo.collection(table).insertOne(data, function(err, result) {
                if (err) {
                    obj = {
                        'status': '0',
                        'msg': '数据库表连接错误',
                        'error': err
                    };
                    callback(err, obj);
                } else {
                    obj = {
                        'status': '2',
                        'msg': '数据插入成功',
                        'result': result
                    };
                    callback(err, obj);
                }
                db.close();
            });
        }
    });
}

var dbfind = function(database, table, where,callback) {
    var obj;
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) {
            obj = {
                'status': '0',
                'msg': '数据库连接错误',
                'error': err
            };
            callback(err, obj);
        } else {
            var dbo = db.db(database);
            dbo.collection(table).find(where).toArray(function(err, result) {
                if (err) {
                    obj = {
                        'status': '0',
                        'msg': '数据库表连接错误',
                        'error': err
                    };
                    callback(err, obj);
                } else {
                    obj = {
                        'status': '2',
                        'msg': '查询成功',
                        'result': result
                    };
                    callback(err, obj);
                }
                db.close();
            });
        }
    });
}

var dbfindlimit = function(database, table, where,num,callback) {
    var obj;
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) {
            obj = {
                'status': '0',
                'msg': '数据库连接错误',
                'error': err
            };
            callback(err, obj);
        } else {
            var dbo = db.db(database);
            dbo.collection(table).find(where).sort({'_id':-1}).limit(num).toArray(function(err, result) {
                if (err) {
                    obj = {
                        'status': '0',
                        'msg': '数据库表连接错误',
                        'error': err
                    };
                    callback(err, obj);
                } else {
                    obj = {
                        'status': '2',
                        'msg': '查询成功',
                        'result': result
                    };
                    callback(err, obj);
                }
                db.close();
            });
        }
    });
}


var dbdelete = function(database, table, where, callback) {
    var obj;
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) {
            obj = {
                'status': '0',
                'msg': '数据库连接错误',
                'error': err
            };
            callback(err, obj);
        } else {
            var dbo = db.db(database);
            dbo.collection(table).deleteMany(where, function(err, result) {
                if (err) {
                    obj = {
                        'status': '0',
                        'msg': '数据库表连接错误',
                        'error': err
                    };
                    callback(err, obj);
                } else {
                    obj = {
                        'status': '2',
                        'msg': '删除成功',
                        'result': result
                    };
                    callback(err, obj);
                }
                db.close();
            });
        }
    });
}

var dbupdatemany = function(database, table, where, update, callback) {
    var obj;
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) {
            obj = {
                'status': '0',
                'msg': '数据库连接错误',
                'error': err
            };
            callback(err, obj);
        } else {
            var dbo = db.db(database);
            dbo.collection(table).updateMany(where, {$set:update}, function(err, result) {
                if (err) {
                    obj = {
                        'status': '0',
                        'msg': '数据库表连接错误',
                        'error': err
                    };
                    callback(err, obj);
                } else {
                    obj = {
                        'status': '2',
                        'msg': '更新成功',
                        'result': result
                    };
                    callback(err, obj);
                }
                db.close();
            });
        }
    });
}

var db = {
    'insert': dbinsert,
    'find': dbfind,
    'findlimit':dbfindlimit,
    'delete': dbdelete,
    'update': dbupdatemany
}
module.exports = db;