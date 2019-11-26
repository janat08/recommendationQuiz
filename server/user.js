const dba = require('./db.js')
const db = dba.db
var aql = require('arangojs').aql;

function submit ({name, data}){
    var data = {
        NLP: {
            1: {}
        }
    }
    var name = "asdf"
    return db.query(`
FOR q IN questions 

    RETURN {[topic]: {[diff]: SLICE(tdq[*].res, 0, 4)}}
    `).then(x => x.all()).then(x=>{
        return x.reduce((a,x)=>{
            return merge(a, {[Object.keys(x)[0]]: Object.values(x)[0]})
        }, {})
    }).catch(console.log)
}


function login({name}){
    console.log(name)
    return db.query(aql`
    FOR u IN users
    UPSERT {username: ${name}}
    INSERT {username: ${name}}
    UPDATE {} in users

    RETURN u
    `)
    .then(x => x.all())
    .then(x=>{
        return x
    })
    .catch(console.log)
}
db.query(aql`
    FOR u IN users

    RETURN u
    `)
    .then(x => x.all())
    .then(x=>{
        return console.log(1, x)
    })
login({name: "asdfss"}).then(console.log)


exports.submit = async (req, res, next) => {
    try {
        const question = await submit(req);
        res.status(200).json({
            success: true,
            data: question
        });
    } catch (err) {
        res.status(400).json({
            success: false
        });
    }
};


// // @desc Get single question
// // @route GET /api/v1/questions/:id
exports.login = async (req, res, next) => {
    try {
        const question = await login(req.query)
        res.status(200).json({
            success: true,
            data: question
        });
    } catch (err) {
        res.status(400).json({
            success: false
        });
    }
};

// // @desc Update a question
// // @route PUT /api/v1/questions/:id
// exports.updateQuestion = async (req, res, next) => {
//     try {
//         const question = await Question.findByIdAndUpdate(req.params.id, req.body);

//         if (!question) {
//             return res.status(400).json({
//                 success: false
//             });
//         }
//         res.status(200).json({
//             success: true,
//             data: question
//         });
//     } catch (err) {
//         res.status(400).json({
//             success: false
//         });
//     }
// };

// // @desc Delete a question
// // @route DELETE /api/v1/questions/:id
// exports.deleteQuestion = async (req, res, next) => {
//     try {
//         const question = await Question.findByIdAndDelete(req.params.id);

//         if (!question) {
//             return res.status(400).json({
//                 success: false
//             });
//         }
//         res.status(200).json({
//             success: true,
//             data: question
//         });
//     } catch (err) {
//         res.status(400).json({
//             success: false
//         });
//     }
// };


// - key in user id (name)
// - if user id not in data base, create new user and store in graph. Set property "current difficulty " = 1
// - if user id in data base, retrieve "current difficulty"
// - start test at user's current difficulty
// - evaluate test results. If pass test and current difficulty at max difficulty, congratulate user and end programme. If pass test and current difficulty not at max difficulty, increase difficulty and start next test. If user does not pass test, implement training qns at same difficulty and a test there after
// - record whether a user has attempted a qn and whether user answered correctly in latest attempt of question
// - record how many tests users have attempted at each difficultly level and test results