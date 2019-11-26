const dba = require('./db.js')
const db = dba.db
const merge = require('deepmerge')
var aql = require('arangojs').aql;

function getAllQ (questionsList){
    let directSearch = true
    if (typeof questionsList != "undefined"){
        directSearch = false
    }
    return db.query(aql`
    // LET questionsList = ${directSearch}? questions : ${questionsList}
    FOR q IN  ${directSearch}? questions : ${questionsList} 
    SORT RAND()
    LET answers = (FOR a, o IN OUTBOUND q options
        RETURN MERGE(KEEP(a, "key", "value", "_id"), KEEP(o, 'right'))
    )
    LET res = MERGE(q, {answers: answers})
    COLLECT diff = q.Difficulty,
            topic = q.Topic INTO tdq
    LET rest = (FOR qx IN tdq[*] LIMIT 4 return qx)
    RETURN {[topic]: {[diff]: rest[*].res}}
    `).then(x => x.all()).then(x=>{
        return x.reduce((a,x)=>{
            return merge(a, {[Object.keys(x)[0]]: Object.values(x)[0]})
        }, {})
    }).catch(console.log)
}

exports.getAllQ = getAllQ

 getAllQ().then(x=>console.log(x.CNN[3][0]))

function getOne({topic, difficulty}){
        return db.query(aql`
FOR q IN questions
    FILTER q.Topic == ${topic} && q.Difficulty == ${difficulty}
    SORT RAND()
    LIMIT 1
    LET answers = (FOR a, o IN OUTBOUND q options
        RETURN MERGE(KEEP(a, "key", 'value'), KEEP(o, 'right'))
    )
    LET res = MERGE(q, {answers: answers})
    RETURN res
    `)
    .then(x => x.all())
    .then(x=>{
        return x[0]
    })
    .catch(console.log)
}


exports.getAll = async (req, res, next) => {
    try {
        const question = await getAllQ();
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
exports.getQuestion = async (req, res, next) => {
    try {
        const question = await getOne(req.query)
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
