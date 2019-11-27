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
                testCount: ${user.testCount+1}
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
        complete: ${completed},
        testCount: ${user.testCount}
    } INTO selections
    RETURN NEW
    `).then(x => x.all()).then(x=>{console.log(222, x)})
    .catch(x=>console.log("submit err",x.response.body))
}

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


function login({ name }) {
    return db.query(aql`
    LET name = ${name}
    UPSERT {name: name}
    INSERT {
        name: name,
        testCount: 0,
    }
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
