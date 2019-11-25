var arangojs = require("arangojs");
var sample = require("./sample.json") //http://beautifytools.com/excel-to-json-converter.php
var db = new arangojs.Database({ url: "http://localhost:8529" });
var now = Date.now();

db.query({
        query: "RETURN @value",
        bindVars: { value: now }
    })
    .then(function(cursor) {
        console.log('no error')
        return cursor.next().then(function(result) {
            console.log(result)
        });
    })
    .catch(function(err) {
        console.log("err", err.port, err.code, err.syscall)
    });

db.createDatabase('quiz').then(
    () => console.log('Database created'),
    err => console.error('Failed to create database:', )
);

db.useDatabase('quiz');


const edges = ["selections", "options"].map(x => db.edgeCollection(x))
edges.map(create)
const selections = edges[0]
const options = edges[1]


const users = db.collection('users');
const questions = db.collection('questions');
const answers = db.collection('answers');

[users, questions, answers].map(create)

function create(x) {
    return x.create().then(
        () => console.log('Collection created'),
        err => console.error('Failed to create collection:', )
    )
}

exports.selections = selections
exports.options = options
exports.users = users
exports.questions = questions
exports.answers = answers
