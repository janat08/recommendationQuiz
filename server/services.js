var db = require('./db').db
var selections = require('./db').selections
var options = require('./db').options
var users = require('./db').users
var questions = require('./db').questions
var answers = require('./db').answers
var aql = require('arangojs').aql;


const mq = ""

// const mq = {
//   getAll(){
//     db.query(`
//     FOR q in Questions
//       FOR v, e IN OUTBOUND q
//         RETURN MERGE(q, {
//           questions: DOCUMENT("Answers", v)
//         })
//     `)
//   }
// }
	
// db.query('FOR d IN firstCollection SORT d.value ASC RETURN d._key').then(
//   cursor => cursor.all()
// ).then(
//   keys => console.log('All keys:', keys.join(', ')),
//   err => console.error('Failed to execute query:', err)
// );



	
// collection.remove('firstDocument').then(
//   () => console.log('Document removed'),
//   err => console.error('Failed to remove document', err)
// );

exports.mq = mq
exports.answers