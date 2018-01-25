const mysql = require('mysql');
const async = require('async');

const db = 'CRUDProject';

var state = {
    connection: null
};

exports.connect = (done) => {
    state.connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123',
    });
    
    done();
}

exports.get = () => {
    return state.connection;
}

exports.setup = (done, initValues) => {
    const connection = state.connection;   
    connection.query('CREATE DATABASE IF NOT EXISTS ??', db, function(err) {
        if (err) {
            throw err;
        }
        connection.changeUser({database: db}, function(err) {
            if (err) {
                throw err;
            }
            
            var promises = [];
            promises.push(new Promise((resolve, reject) => {
                connection.query('CREATE TABLE IF NOT EXISTS Student('
                    + 'id INT NOT NULL AUTO_INCREMENT,'
                    + 'PRIMARY KEY (id),'
                    + 'name VARCHAR(30)'
                    +  ')', function(err, result) {
                        if(err) {
                            throw err;
                        }
                        resolve(result);
                });
            }))

            promises.push(new Promise((resolve, reject) => {
                connection.query('CREATE TABLE IF NOT EXISTS Course(' 
                    + 'cId INT NOT NULL AUTO_INCREMENT,' 
                    + 'PRIMARY KEY (cId),' 
                    + 'name VARCHAR(30) NOT NULL,'
                    + 'credit INT NOT NULL'
                    + ')', function(err, result) {
                        if (err) {
                            throw err;
                        }
                        resolve(result);
                });
            }));

            promises.push(new Promise((resolve, reject) => {
                connection.query('CREATE TABLE IF NOT EXISTS StudentCourse('
                    + 'sid INT NOT NULL,'
                    + 'cId INT NOT NULL,' 
                    + 'FOREIGN KEY (sId) REFERENCES Student(id) ON DELETE CASCADE,' 
                    + 'FOREIGN KEY (cId) REFERENCES Course(cId),'
                    + 'CONSTRAINT pId PRIMARY KEY (sId, cId)' 
                    + ')', function(err, result) {
                        if (err) {
                            throw err;
                        }
                        resolve(result);
                })
            }))

            Promise.all(promises).then(() => {
                return done(initValues, function(err) {
                    if (err) {
                        throw err;
                    }
                    console.log('Initialize database successfully.')
                    return "";
                });
            })
        })
        
    })
}

exports.addInitValues = (data) => {
    const connection = state.connection;
    var tables = Object.keys(data.tables);
    async.each(tables, function(table) {
        async.each(data.tables[table], function(row) {
            connection.query('INSERT IGNORE INTO ?? SET ?', [table, row]);
        })
    })
}