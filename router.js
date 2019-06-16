const express = require('express')
const router = express.Router()
const db = require('./models/mysql')


router.get('/', function (req, res, next) {
    db.query('select * from user', [], function (result, fields) {
        res.render('index.html', {
            result: result
        })
    });
})

router.post('/add', function (req, res, next) {
    let body = req.body
    console.log(body)
    let addSql = 'INSERT INTO user(id,username,tel) VALUES(?,?,?)';
    let addSqlParams = [body.id, body.username, body.tel];
    db.query(addSql, addSqlParams, function (result, fields) {
        console.log('添加成功')
        return res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
})

router.get('/delete', function (req, res, next) {
    let deleteSql = 'DELETE FROM user  WHERE id = ?';
    let deleteSqlParams = req.query.id;
    db.query(deleteSql, deleteSqlParams, (err, results) => {
        if (err) {
            console.log(err);
        }
        res.redirect(302, '/');
    })
})


router.get('/fix', function (req, res, next) {
    fixsql = 'SELECT * FROM user WHERE id = ?'
    fixSqlParams = req.query.id
    db.query(fixsql, fixSqlParams, (result) => {
        res.render('fix.html', {
            result: result[0]
        })
    })


})

router.post('/fix', function (req, res, next) {
    console.log(req.body)
    updatasql = 'UPDATE user SET username = ?,tel=? WHERE id = ?';
    updataSqlParams = [req.body.username, req.body.tel, req.body.id];
    db.query(updatasql, updataSqlParams, (err, results) => {
        if (err) {
            console.log(err);
        }
        return res.status(200).json({
            err_code: 0,
            message: 'OK'
        })
    })
})

router.post('/search', function (req, res, next) {
    // console.log(req.body)
    arr = []
    db.query('select * from user', [], function (result, fields) {
        // console.log(result)
        result.forEach(function (e) {
            if (e.id.indexOf(req.body.value) >= 0 || e.username.indexOf(req.body.value) >= 0 || e.tel.indexOf(req.body.value) >= 0) {
                arr.push(e)
            }
        })
        if (arr.length >= 2) {
            if (arr[arr.length - 2].username == arr[arr.length - 1].username) {
                arr.pop()
            }
        }
        return res.status(200).json({
            err_code: 0,
            message: arr
        })
    });

})

router.post('/searchbyname', function (req, res, next) {
    searchbynamesql = 'SELECT * FROM user,extra\n' +
        'WHERE user.username=extra.username\n' +
        'AND user.username=?\n'
    searchbynameParams = req.body.value
    db.query(searchbynamesql, searchbynameParams, function (result, fields) {
        return res.status(200).json({
            err_code: 0,
            message: result
        })
    })
})

module.exports = router;
