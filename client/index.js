import React from 'react'
import { render } from 'react-dom'
import { useLocalStore, observer, } from "mobx-react-lite"
import sample from '../server/sample.json'
import { observable, toJS, autorun } from 'mobx';
import * as R from 'ramda'
// class HelloMessage extends Nerv.Component {
//   render() {
//     return <div>Hello {this.props.name}</div>
//   }
// }
const lg = console.log

const storeContext = React.createContext(null)

export const StoreProvider = ({ children }) => {
    const store = useLocalStore(createStore)
    return <storeContext.Provider value={store}>{children}</storeContext.Provider>
}

export const useStore = () => {
    const store = React.useContext(storeContext)
    if (!store) {
        // this is especially useful in TypeScript so you don't need to be checking for null all the time
        throw new Error('useStore must be used within a StoreProvider.')
    }
    return store
}

const questions = [
    {
        "Topic": "CNN",
        "QN": "Which of the following statements is true when you use 1×1 convolutions in a CNN?",
        answers: [{ key: "A", value: "It can help in dimensionality reduction" },
        { key: "B", value: "It can be used for feature pooling" },
        { key: "C", value: "It suffers less overfitting due to small kernel size" },
        { key: "D", value: "All of the above", }],
        "Solution": "D",
        "Difficulty": "3"
    }, {
        "Topic": "CNN",
        "QN": "a of the following statements is true when you use 1×1 convolutions in a CNN?",
        answers: [{ key: "A", value: "It can help in dimensionality reduction" },
        { key: "B", value: "It can be used for feature pooling" },
        { key: "C", value: "It suffers less overfitting due to small kernel size" },
        { key: "D", value: "All of the above", }],
        "Solution": "D",
        "Difficulty": "3"
    }, {
        "Topic": "ABC",
        "QN": "s of the following statements is true when you use 1×1 convolutions in a CNN?",
        answers: [{ key: "A", value: "It can help in dimensionality reduction" },
        { key: "B", value: "It can be used for feature pooling" },
        { key: "C", value: "It suffers less overfitting due to small kernel size" },
        { key: "D", value: "All of the above", }],
        "Solution": "D",
        "Difficulty": "3"
    },
]


function score(ans) {
    const noEmpty = ans.filter(x => x.answer != null).map((x, i) => {
        if (x.answer == x.Solution) {
            return true
        } else {
            return false
        }

    })
    const sc = noEmpty.filter(x => x)
    const res = sc.length / noEmpty.length
    return isNaN(res) ? 100 : res * 100
}

function addFields(x){ 
    x.answer = null; x.isRight = false; 
    return x 

}

function formatQuestions(questions) {
    const a = questions.map(addFields)
    return R.groupBy((x => x.Topic), a)
}

function getQuestion() {
    return new Promise((re) => {
        re(addFields(questions[0]))
    })
}

function createStore() {
    const a = observable({
        name: "",
        loginStatus: false,
        setName(ev) {
            this.name = ev.target.value
        },
        login() {
            //http
            this.loginStatus = !this.loginStatus
        },
        questions: formatQuestions(questions),
        get scores() {
            return R.mapObjIndexed((val, key, obj) => {
                return score(val)
            }, this.questions)
        },
        get answered() {
            return R.mapObjIndexed((val, key, obj) => {
                return val.filter(x => x.answer != null).length
            }, this.questions)
        },
        get scoresTotal() {
            const a = score(R.flatten(R.values(this.questions)))
            return a
        },
        answer(key, ind) {
            return (e) => {
                const val = e.currentTarget.value
                const tar = this.questions[key][ind]
                this.questions[key][ind].answer = val
                this.questions[key][ind].isRight = val == tar.Solution
            }
        },
        get topics() {
            return R.groupWith(R.equals, this.questions.map(x => x.Topic))
        }
    })
    //fetch more questions if grade is bad for a topic
    autorun((() => {
        R.mapObjIndexed((val, key, obj) => {
            if (a.answered[key] > 1 && a.answered[key] == a.questions[key].length) {
                if (val < 80){
                    getQuestion().then(x=>{
                        a.questions[key].push(x)
                    })
                }
            }
        }, a.scores)
    }))
    window.a = a
    return a
}

const App = observer(() => {
    const store = useStore()
    return (
        <>
            <input onChange={store.setName} value={store.name}></input>
            <button onClick={store.login}>{store.loginStatus ? "Log off" : "Log In"}</button>
            {store.scoresTotal}
            {R.values(R.mapObjIndexed((val, key, obj) => {
                return val.map((x, i) => {
                    const onChange = store.answer(key, i)
                    const answered = x.answer != null
                    return (
                        <div key={x.QN}>
                            {x.Topic}: {x.QN}
                            {x.answers.map((y, yi) => {
                                const checked = y.key == x.answer
                                const wrong = x.Solution != y.key
                                return (
                                    <div key={y.key}>
                                        <input type="radio" disabled={answered} value={y.key} onChange={onChange} checked={checked} />
                                        <label>{answered && checked ? store.scores[key] + (wrong ? " Wrong: " : " Right: ") : ""}{y.value}</label>
                                    </div>
                                )
                            })}
                        </div>

                    )
                })
            }, store.questions))
            }
        </>
    )
})

render(
    <StoreProvider>
        <App />
    </StoreProvider>,
    document.getElementById('root')
)