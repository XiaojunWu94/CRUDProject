const db = require('./db');

const addStudentRecords = (req, res) => {
    const data = req.body;
    db.get().query('INSERT INTO Student SET ?', data, function(err, result) {
        if (err) {
            throw err;
        }
        db.get().query('INSERT INTO StudentCourse SET ?', {sid: result.insertId, cId: 1}, function(err, result) {
            res.sendStatus(200);
        })
    })
}

const updateStudentRecords = (req, res) => {
    const sId = req.params.id;
    const data = req.body;
    db.get().query('UPDATE Student Set name = ? WHERE id = ?', [data.name, sId], function(err, result) {
        if (err) {
            throw err;
        }
        res.status(200).send('Update Successfully');
    })
}

const deleteStudentRecords = (req, res) => {
    const sId = req.params.id;
    db.get().query('DELETE FROM Student WHERE id = ?', sId, function(err, result) {
        if (err) {
            throw err;
        }
        res.status(200).send('Delete Successfully');
    })
}

const getStudentByName = (req, res) => {
    const name = req.params.name;
    db.get().query('SELECT S.id as id, S.name AS studentName, C.name AS courseName, C.credit AS credit ' 
                    + 'FROM Student S, Course C, StudentCourse SC '
                    + 'WHERE S.id = SC.sId and C.cId = SC.cId and S.name LIKE "%"?"%" ', name,
                    function(err, result) {
                        if (err) {
                            throw err;
                        }
                        res.status(200).send(result);
                    }
                )
}

const getAllStudents = (req, res) => {
    db.get().query('SELECT * FROM Student', function(err, result) {
        if (err) {
            throw err;
        }
        res.status(200).send(result);
    })
}

module.exports = (app) => {
    app.post('/students', addStudentRecords);
    app.put('/students/:id', updateStudentRecords);
    app.delete('/students/:id', deleteStudentRecords);
    app.get('/students/:name', getStudentByName);
    app.get('/students', getAllStudents);
}