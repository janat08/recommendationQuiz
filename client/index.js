import React from 'react'
import { render } from 'react-dom'
import { useLocalStore, observer } from "mobx-react-lite"
import sample from '../server/sample.json'
import { action, observable  } from 'mobx';
// class HelloMessage extends Nerv.Component {
//   render() {
//     return <div>Hello {this.props.name}</div>
//   }
// }

function createStore() {
    return observable({
        questions: [],
        name: "",
        setName(ev){
            this.name = ev.target.value
            console.log(this.name)
        },
        get named() {
            return name != ""
        },
        loggedIn: false
    })
}

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
const App = observer(()=> {
    const store = useStore()
    store.name = "abc"
    return (
        <>
        <input onChange={store.setName} value={store.name}></input>
            {store.name}
        </>
    )
})

render(
    <StoreProvider>
        <App />
    </StoreProvider>,
    document.getElementById('root')
)