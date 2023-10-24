const express = require('express')
const app = express()
const PORT = 3019;
const bodyParser = require('body-parser')

const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('DBPosts');

const bcrypt = require('bcryptjs')

app.use(bodyParser.json())


app.get('/getAllUsers', (req,res) => {
    db.all("SELECT * FROM users", (err,data)=> {
        // console.log(data);
        res.json(data)
        })
})

app.get('/getAllPosts', (req,res) => {
    db.all("SELECT posts.id,text,name FROM posts JOIN users ON posts.user_id=users.id", (err,data)=> {
        res.json(data);
        })
})

app.post('/checkUser', (req,res)=> {
    // console.log(req.body);
    const {name, password} = req.body

    db.get(`SELECT * FROM users WHERE name='${name}'`, (err,data)=> {
        
        if(bcrypt.compareSync(password,data.password)){
        
         return res.sendStatus(202)
        }
        else {
            res.sendStatus(401)
            console.log(err);
        }
    })
    
})

app.post('/addUser', (req,res)=> {
    // console.log(req.body);
    const {name, password} = req.body

    db.all(`SELECT * FROM users WHERE name='${name}'`, (err,data)=> {
        console.log(data);
        if(!data.length){
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt)
        db.run(`INSERT INTO users (name,password) VALUES ('${name}','${hash}')`)
         return res.sendStatus(200)
        }
        else {
            res.sendStatus(400)
            console.log(err);
        }
    })
    
})
app.get('/deletePost/:id', (req, res) => {
    db.run(`DELETE FROM posts WHERE id=${req.params.id}`)
    db.all("SELECT posts.id,text,name FROM posts JOIN users ON posts.user_id=users.id", (err,data)=> {
        res.json(data);
        })
})




app.listen(PORT, ()=> {
    console.log(`http://localhost:${PORT}`);
})
 