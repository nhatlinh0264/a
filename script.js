const listNav = ['home', 'work list', 'about']
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
            return listNav.push(...args)
        case 'delete':
            console.log(listNav);
            return listNav.pop()
        default:
            return state
            
    }
}



function navElement(){
    return html`
    <button onClick="dispatch('create', 'contact')">ADD</button>
    <button onClick="dispatch('delete')">REMOVE</button>
    <ul>
        ${listNav.map(navNode => `<li>${navNode}</li>`)}
    </ul>
    <p>HELLO</p>
    `
}
const { attach, connect, dispatch } = createStore(reducer)
window.dispatch = dispatch()
rootElement = document.querySelector('#root')
attach(navElement, rootElement)