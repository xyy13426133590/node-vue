/*引入express框架*/

const express = require('express');
// const ejs = require('ejs');
var router = express.Router();
const app = express();
/*引入cors*/
const cors = require('cors');
app.use(cors());
/*引入body-parser*/
const badyParser = require('body-parser');
app.use(badyParser.json());
app.use(badyParser.urlencoded({
    extends: true
}));

/*引入mysql*/
const mysql = require('mysql');
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test',
    port:3306,
    multipleStatements: true
})

conn.connect();//连接数据库

/*监听端口*/
app.listen(3000, ()=>{
    console.log('--------- 服务已启动 ---------');
})
app.get('/', (req, res)=>{
    res.send('<p style="color: red">服务已启动</p>');
});

/*查*/
app.get('/api/getUserList', (req, res) =>{
    const sqlStr= 'SELECT * FROM users';
    console.log(sqlStr)
    conn.query(sqlStr, (error, results) =>{
        if(error){
            return res.json({
                code: 404,
                message: error
            })
        }else {
            return res.json({
                code: 200,
                message: results,
                affectedRows: results.affectedRows
            })
        }
    })

})

//条件查找
app.get('/api/getUserListById/:id', (req, res) => {
    const id = req.params.id;
    const sqlStr = 'select * from users where id=?';
    conn.query(sqlStr, id, (err, results) => {
        if (err) return res.json({
            code: 404,
            message: '数据不存在',
            affextedRows: 0
        });
        res.json({
            code: 200,
            message: results,
            affextedRows: results.affextedRows
        });
    })
});

//添加
app.post('/api/addUser', (req, res) =>{
    console.log(req.body);
    const username = req.body.username;
    const sex = req.body.sex;
    const address = req.body.address;
    console.log("username:" + username);

    //插入语句
    const sqlStr = 'insert into users set ?';
    conn.query(sqlStr, req.body, (err, results) => {
        if (err) return res.json({
            code: 404,
            message: err,
            affectedRows: 0
        });
        res.json({
            code: 200,
            message: '添加成功',
            affectedRows: results.affectedRows
        });
    })
})

//删除
app.delete('/api/deleteUser/:id', (req, res) =>{
   const id = req.params.id;
    const sqlStr = 'DELETE FROM USERS WHERE id='+ id;
    conn.query(sqlStr,id, (error, results) =>{
        console.log(results);
        if(error){
            return res.json({
                code: 404,
                message: error,
                affectedRows: 0
            });
        }else{

            res.json({
                code: 200,
                message: "删除成功",
                affectedRows: results.affectedRows
            })
        }
    })

});

//修改
app.post('/api/updateUser', (req, res) =>{
    const id = req.body.id;
    const username = req.body.username;
    const sex = req.body.sex;
    const address = req.body.address;
    const sqlStr = "update users set username='" + username + "',sex='" + sex + "',address='" + address + "'where id=" + id;
    conn.query(sqlStr,(err, results) =>{
        if(err){
            return res.json({
                code: 404,
                message: err,
                affectedRows: 0
            });
        }else{

            res.json({
                code: 200,
                message: "修改成功",
                affectedRows: results.affectedRows
            })
        }
    })


})













