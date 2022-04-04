import express from 'express';
import notes from './data.js';
import mysql from 'mysql';

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'stesh',
    password: 'steshdev',
    database: 'notesApp',
    //port: '8889',
    socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock'
});


app.use(express.static('public'));
app.use(express.urlencoded({extended: false}));
app.get('/', (req, res) => {
    res.render('index.ejs')
})

//
app.get('/notes', (req, res) => {
    connection.query(
        'SELECT * FROM notes', (error,results) => {
            res.render('./notes.ejs', {notes: results})
        }
    )
})
//display form to add new note
app.get('/create', (req, res) => {
    res.render('newnote.ejs')
})

//view single note
app.get('/note/:id', (req,res) =>{
   connection.query(
       'SELECT * FROM notes WHERE id = ?', [req.params.id],
       (error,results) => {
           res.render('singlenote.ejs', {note: results[0]})
       }
   ); 
})

//add new note to db
 app.post('/create', (req, res) => {
    connection.query(
        'INSERT INTO notes (title,body) VALUES (?,?)' ,
        [req.body.title, req.body.body], 
        (error, results) => {
            res.redirect('/notes');
        }
    );
})
//edit route 
//display form to add new note
app.get('/edit/:id', (req, res) => {
    connection.query(
        'SELECT * FROM notes WHERE id = ?',
        [req.params.id],
        (error, results) => { 
            res.render('editnote.ejs', {note: results[0]});
        })
})

//editing new note
app.post('/edit/:id', (req, res) => {
    connection.query(
        'UPDATE notes SET title = ?, body = ? WHERE id = ?',
        [req.body.title, req.body.body, req.params.id],
        (error, results) => {
            res.redirect('/notes');
        }
    )
})
//delete a single note 
app.post('/delete/:id', (req, res) => {
    connection.query(
        'DELETE FROM notes WHERE id = ?',
        [req.params.id],
        (error, results) => {
            res.redirect('/notes');
        }
    )
})

//login route
app.get('/login', (req,res) => {
    res.render('login.ejs', {error: false})
})

//authenticating
app.post('/login', (req,res) => {
    let email = req.body.email;
    let password = req.body.password;
    connection.query(
        'SELECT * FROM users WHERE email = ?', [email],
        (error,results) => {
             if(results.length > 0){
                // console.log('user exists');
                if(req.body.password === results[0].password){
                    //console.log('Auth Successfull');
                    res.redirect('/notes');
                }else{
                    //console.log('Auth Failed');
                    let message = 'Email/Password Mismatch.'
                    res.render('login.ejs', {
                        error: true, 
                        errorMessage: message,
                         email: email, 
                         password: password});
                }
             }else{
                 let message = 'Account does not Exist. Please create one.'
                 res.render('login.ejs', {
                    error: true, 
                    errorMessage: message,
                     email: email, 
                     password: password
                 });
                
                 //console.log('User does not exist');
             }
        }
    )
})

//signup
//login route
app.get('/signup', (req,res) => {
    res.render('sign-up.ejs', {error:false})
})

//submit data upon sign up
app.post('/signup', (req,res) => {
    let email = req.body.email,
        username = req.body.username,
        password = req.body.password,
        confirmpassword = req.body.confirmpassword;

    // const emailExists = email => {
    //     connection.query(
    //         'SELECT email FROM users WHERE email = ?', [email],
    //         (error, results) => {
    //             console.log(results.length > 0);
    //         }
    //     )
    // }   
    if(password === confirmpassword){
        //emailExists(email)
        connection.query(
                    'SELECT email FROM users WHERE email = ?', [email],
                    (error, results) => {
                        console.log(results.length > 0);
                    }
                )
    }else {
        let message = 'Password Missmatch! Please ensure your Passwords Match'
        res.render('signup.ejs', {
            error: true,
            errorMessage: message,
            email: email,
            username: username,
            password: password,
            confirmpassword: confirmpassword
        })
    }
    
})
app.get('*', (req,res) => {
    res.render('404.ejs')
})
app.listen(3000);