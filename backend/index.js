const express = require('express');
const bodyParser = require('body-parser');
const db = require('./src/db');
const enableCORS = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:4200')
    res.header('Access-Control-Allow-Credentials',true)
    res.header('Access-Control-Allow-Methods','GET, PUT, POST, DELETE')
    res.header('Access-Control-Allow-Headers','Authorization, Content-Type, X-Request-With, X-Session-Id')
    res.header('Access-Control-Expose-Headers', 'Location, X-Session-Id')
    if(req.method === 'OPTIONS') {
        res.status(200).send("OK")
    } else {
        next();
    }
}

var data = {
    tables: {
        Student: [
            {id: 1, name: 'xiaojun'},
            {id: 2, name: 'xiaoming'}
        ],
        Course: [
            {cId: 1, name: 'Web Development', credit: 3},
            {cId: 2, name: 'Database System', credit: 4}
        ],
        StudentCourse: [
            {sId: 1, cId: 1},
            {sId: 2, cId: 2},
            {sId: 1, cId: 2}
        ]
    }
}

db.connect(() => {
    console.log('Successfully connect to MySQL');
    db.setup(db.addInitValues, data);
});

const app = express();
app.use(enableCORS);
app.use(bodyParser.json());
require('./src/student')(app);

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
})