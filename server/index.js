const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')

const questionsController = require('./questions.js')
// require('./db.js')


const app = express();
app.use(cors({
    origin: '*'
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var base = express.Router()
app.use('/api/v1', base)

// var questionsAPI = express.Router()
// base.use('/questions', questionsAPI)
// questionsAPI.use('/', questionsController)

base.route('/questions').
    get((req,res)=>{
        res.json({
             message: 'GET request successfulll!!!!'
        })
    })


// app.route('/api/answer')
//     // GET endpoint 
//     .get((req, res) => {
//         // Get all contacts            
//         res.status(200).send({
//             message: 'GET request successfulll!!!!'
//         })
//     })
//     // POST endpoint
//     .post((req, res) => {
//         // Create new contact         
//         res.status(200).send({
//             message: 'POST request successfulll!!!!'
//         })
//     })

// app.use('/api/v1/answers', questions)


app.get('/', (req, res) => {
    res.send('Hello World, from express');
});
// app.use(bundler.middleware());
app.listen(8001, ()=>{
    console.log("8001")
});
