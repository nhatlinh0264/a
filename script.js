const listNav = []
function html([first,...strings], ...values) {
    return values.reduce(
        (acc,cur) => acc.concat(cur,strings.shift()),
        [first]
        )
    .join('')
}

function createStore(reducer) {
    let state = reducer()
    const rootElement = new Map()
    

    function render() {
        for (const [root, component] of rootElement) {
            const output = component()
            root.innerHTML = output
        }
    }

    return {
        attach(component, root) {
            rootElement.set( root, component)
            render()
        },
        connect(selector = state => state) {
            return component => (props, ...args) =>
            component(Object.assign({}, props,selector(state), ...args))
        },
        dispatch(action,...args){
            state = reducer(state,action,args)
            render()
        }
    }
}

function reducer(state,action,args) {
    
    switch (action) {
        case 'create':
            const a = document.querySelector('input[type="text"]')
            listNav.unshift(a.value) 
            console.log(listNav, 'add' ,args)
            
            break
        case 'delete':
            listNav.splice(listNav.findIndex( a => a==args),1)
            break
        default:
            return state
            
    }
}



function navElement(){
    return html`
    <input type="text">
    <button onClick="dispatch('create')">ADD</button>
    <p>List to do</p>
    <ul>
        ${listNav.map(navNode =>
            `<li>
            <span>${navNode}</span>
            <button onClick= "dispatch('delete','${navNode}')">x</button>
            `)}
    </ul>
    `
}
const { attach, connect, dispatch } = createStore(reducer)
window.dispatch = dispatch()
rootElement = document.querySelector('#root')
attach(navElement, rootElement)