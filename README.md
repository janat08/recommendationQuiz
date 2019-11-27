DB schema
user>selections(edge)>answers<options(edge)<questions
arrow represents directions of edge

user: name, incompleteTest: {questions}

selections: totalAnswered, totalScore, scores
This is a separate edge, because I though you may to know who else selected that answer,
and how well he did overall on his test

answers: key, value

options: isRight/right

questions: Solution, QN, etc...



Therere some functions for flattening and deflattening questions out of array and into object.object.array on client side.
I considered flattening and deflattening the state on client side, and keeping everything flat on server a little late
