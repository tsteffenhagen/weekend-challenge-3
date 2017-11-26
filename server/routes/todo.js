var express = require('express');
var router = express.Router();
var pg = require('pg');
var pool = require('../modules/pool.js');

router.post('/', function (req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database:', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query(`INSERT INTO list (task, description, due_date, completed, work_type)
            VALUES ($1, $2, $3, $4, $5);`, [req.body.task, req.body.description, req.body.dueDate, req.body.completed, req.body.taskType],
                function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(201);
                    }
                });
        }
    })
});//end router.post

router.get('/', function (req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query('SELECT * FROM list ORDER BY due_date DESC;', function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query:', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.send(result.rows);
                }
            })
        }
    })
}); //end router.get

router.delete('/:id', function (req, res) {
    var listItemIdToRemove = req.params.id;

    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query('DELETE FROM list WHERE user_id=$1;', [listItemIdToRemove], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            })
        }
    })
});//end router.delete

router.put('/:id', function (req, res) {
    var listItemIdToChange = req.params.id;

    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query(`UPDATE list SET completed = 'Y', work_time = $1 WHERE user_id= $2;`, [req.body.time, listItemIdToChange], function (errorMakingQuery, result) {
                done();
                if (errorMakingQuery) {
                    console.log('Error making query', errorMakingQuery);
                    res.sendStatus(500);
                } else {
                    res.sendStatus(200);
                }
            });
        }
    })
});// end router.put

module.exports = router;