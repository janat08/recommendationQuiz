const dba = require('./db.js')
const db = dba.db
const getAllQ = require("./questions.js").getAllQ
var aql = require('arangojs').aql;
const R = require('ramda')


const sample = {
    Difficulty: '3',
    QN: 'Which of the following statements is true when you use 1×1 convolutions in a CNN?',
    Solution: 'D',
    Topic: 'CNN',
    _id: 'questions/22659',
    _key: '22659',
    _rev: '_ZoZ5PUS---',
    answers: [{
            key: 'A',
            value: 'It can help in dimensionality reduction',
            right: false,
            _rev: '_ZoZ5PUq---',
            _key: '23027',
            _to: 'answers/22731',
            _from: 'questions/22659',
            _id: 'options/23027'
        },
        {
            key: 'B',
            value: 'It can be used for feature pooling',
            right: false,
            _rev: '_ZoZ5PUq--A',
            _key: '23028',
            _to: 'answers/22732',
            _from: 'questions/22659',
            _id: 'options/23028'
        },
        {
            key: 'C',
            value: 'It suffers less overfitting due to small kernel size',
            right: false,
            _rev: '_ZoZ5PUq--C',
            _key: '23029',
            _to: 'answers/22733',
            _from: 'questions/22659',
            _id: 'options/23029'
        },
        {
            key: 'D',
            value: 'All of the above',
            right: true,
            _rev: '_ZoZ5PUq--E',
            _key: '23030',
            _to: 'answers/22734',
            _from: 'questions/22659',
            _id: 'options/23030'
        }
    ]
}

const sample2 = {
    Difficulty: '3',
    QN: 'Which of the following would have a constant input in each epoch of training a Deep Learning model?',
    Solution: 'A',
    Topic: 'CNN',
    _id: 'questions/22670',
    _key: '22670',
    _rev: '_ZoZ5PUS--U',
    answers: [{
            key: 'A',
            value: 'Weight between input and hidden layer',
            right: true,
            _rev: '_ZoZ5PUu--g',
            _key: '23066',
            _to: 'answers/22770',
            _from: 'questions/22670',
            _id: 'options/23066'
        },
        {
            key: 'B',
            value: 'Weight between hidden and output layer',
            right: false,
            _rev: '_ZoZ5PUu--i',
            _key: '23067',
            _to: 'answers/22771',
            _from: 'questions/22670',
            _id: 'options/23067'
        },
        {
            key: 'C',
            value: 'Biases of all hidden layer neurons',
            right: false,
            _rev: '_ZoZ5PUu--k',
            _key: '23068',
            _to: 'answers/22772',
            _from: 'questions/22670',
            _id: 'options/23068'
        },
        {
            key: 'D',
            value: 'Activation function of output layer',
            right: false,
            _rev: '_ZoZ5PUu--m',
            _key: '23069',
            _to: 'answers/22773',
            _from: 'questions/22670',
            _id: 'options/23069'
        },
        {
            key: 'E',
            value: 'None of the above',
            right: false,
            _rev: '_ZoZ5PUu--o',
            _key: '23070',
            _to: 'answers/22774',
            _from: 'questions/22670',
            _id: 'options/23070'
        }
    ]
}


// function WrongsampleSubmit() {
//     return getAllQ().then(x => {
//         return R.mapObjIndexed((val, key, obj) => {
//             return R.mapObjIndexed((valx, diff, obj) => {
//                 return valx.map((x, i) => {
//                     if (i < 3) {
//                         x.isRight = true
//                         x.answer = x.Solution
//                     }
//                     return x
//                 })
//             }, x[key])
//         }, x)
//     })
// }


function submit({ user, data }) {
    const completed = data.complete
    if (completed == false){
        console.log("incomplete", user._id)
        return db.query(aql`
            UPDATE ${user._key} WITH {
                incompleteTest : ${data}
            } IN users
        RETURN NEW
        `).then(x => x.all()).then(x=>{console.log(222, x)}).catch(x=>{console.log(x.response.body)})
    } else {
        db.query(aql`
            UPDATE ${user._key} WITH {
                incompleteTest: null
            } IN users
        RETURN NEW`)
    }
    console.log("submitting")
    const answers = []
    R.mapObjIndexed((val, key, obj) => {
        return R.mapObjIndexed((valx, diff, obj) => {
            return valx.forEach((x, i) => {
                answers.push({...x, score: data.scores[key][diff], answerSelected: x.answers.filter(y=>y.key == x.answer)[0]})
                // answers.push(x)
            })
        }, val)
    }, data.questions)
    console.log("constructed")
    console.log("answer", data.questions, data.totalAnswered)
    return db.query(aql`
    LET answers = ${answers}
    FOR q IN answers
    INSERT {
        _from: ${user._id},
        _to: q.answerSelected._id,
        score: q.score,
        totalAnswered: ${data.totalAnswered},
        totalScore: ${data.totalScore},
        complete: ${completed}
    } INTO selections
    RETURN NEW
    `).then(x => x.all()).then(x=>{console.log(222, x)})
    .catch(x=>console.log("submit err",x.response.body))
}

// sampleSubmit().then(data => {
//     return submit('asdf', data).then(console.log)
// })

function fetchQuestions(user) {
    return user.incompleteTest? new Promise(x=>x(user.incompleteTest.questions)) : getAllQ()
    //USERFUL FOR FETCHING QUESTIONS/ANSWERS, ISN'T COMPLETE///////////
    // console.log(user)
    // return db.query(aql `
    // LET u = ${user}
    
    // FOR a, s IN OUTBOUND u selections
    //     FILTER s.complete == false
    //     FOR q IN INBOUND a options
    // RETURN q
    // `)
    // .then(x => x.all())
    // .then(x=>{
    //     console.log("loginquestions", x)
    //     return getAllQ(x)
    // }).catch(x=>console.log('fetchQuestions', x.body))
}
login({name: "test"})
// getAllQ().then(x=>console.log(x))
function login({ name }) {
    return db.query(aql`
    LET name = ${name}
    UPSERT {name: name}
    INSERT {name: name}
    UPDATE {} in users
    RETURN NEW
    `)
        .then(x => x.all().then(x=>x[0]))
        .then(x => {
            console.log('user', x)

            return fetchQuestions(x).then(y => {
                console.log('res', y)
                return { user: x, questions: y }
            })
        })
        .catch(x=>{console.log(x.body)})
}

// login({ name: "asds" }).then(x=>{console.log('res', x)})


exports.submit = async(req, res, next) => {
    try {
        console.log("submit")
        const result = await submit(req.body);
        console.log(333, typeof res, typeof req, typeof next)
        res.send({
            ...result
        });
    }
    catch (err) {
        console.log("error", err, "error")
        res.status(400).json({
            success: false
        });
    }
};


// // @desc Get single question
// // @route GET /api/v1/questions/:id
exports.login = async(req, res, next) => {
    try {
        const question = await login(req.body)
        res.status(200).json({
            ...question
        });
    }
    catch (err) {
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
