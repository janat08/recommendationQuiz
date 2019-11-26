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


function submit({ name, data }) {
    const answers = []
    R.mapObjIndexed((val, key, obj) => {
        return R.mapObjIndexed((valx, diff, obj) => {
            return valx.filter(x=>x.answer).forEach((x, i) => {
                answers.push({...x, score: data.scores[key][diff], answers: x.answers.filter(y=>y.key == x.answer)[0]})
                // answers.push(x)
            })
        }, val)
    }, data.questions)
    return db.query(aql`
    FOR q IN ${answers}
    
    INSERT {
        from: ${name._id},
        _to: q.answers[0]._id,
        score: q.score,
        scoreTotal: ${data.scoreTotal},
        complete: ${data.complete},
    } INTO selections
        
    RETURN {[topic]: {[diff]: SLICE(tdq[*].res, 0, 4)}}
    `).then(x => x.all())
    .catch(console.log)
}

// sampleSubmit().then(data => {
//     return submit('asdf', data).then(console.log)
// })

function fetchQuestions(user) {
    return db.query(aql `
    LET u = ${user}
    FOR a, s IN OUTBOUND u selections
        FILTER s.complete == false
        FOR q IN INBOUND a options
        RETURN q
    RETURN q
    `)
    .then(x => x.all())
    .then(x=>{
        return getAllQ(x)
    })

}

function login({ name }) {
    return db.query(aql `
    UPSERT {name: ${name}}
    INSERT {name: ${name}}
    UPDATE {name: ${name}} in users
    RETURN NEW
    `)
        .then(x => x.all()[0])
        .then(x => {
            return fetchQuestions(x).then(y => {
                return { user: x, questions: y }
            })
            return x
        })
        .catch(console.log)
}

// login({ name: "asdfs" }).then(console.log)


exports.submit = async(req, res, next) => {
    try {
        const question = await submit(req);
        res.status(200).json({
            success: true,
            data: question
        });
    }
    catch (err) {
        res.status(400).json({
            success: false
        });
    }
};


// // @desc Get single question
// // @route GET /api/v1/questions/:id
exports.login = async(req, res, next) => {
    try {
        const question = await login(req.query)
        res.status(200).json({
            success: true,
            data: question
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
