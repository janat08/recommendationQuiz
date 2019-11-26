
var User = {}

var api = {
    createUser (){},
    select(){},
    
}


// - key in user id (name)
// - if user id not in data base, create new user and store in graph. Set property "current difficulty " = 1
// - if user id in data base, retrieve "current difficulty"
// - start test at user's current difficulty
// - evaluate test results. If pass test and current difficulty at max difficulty, congratulate user and end programme. If pass test and current difficulty not at max difficulty, increase difficulty and start next test. If user does not pass test, implement training qns at same difficulty and a test there after
// - record whether a user has attempted a qn and whether user answered correctly in latest attempt of question
// - record how many tests users have attempted at each difficultly level and test results