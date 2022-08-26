const listNav = {
    arr: [],
    tog: true
  }
  const $ = document.querySelector.bind(document)
  const $$ = document.querySelectorAll.bind(document)
  
  
  function html([first, ...strings], ...values) {
    return values.reduce(
        (acc, cur) => acc.concat(cur, strings.shift()),
           [first]
      )
      .filter(x => x && x !== true || x === 0)
      .join('')
  }
  
  function createStore(reducer) {
    let state = reducer()
    const rootElement = new Map()
  
  
    function render() {
      for (const [root, component] of rootElement) {
        const output = component()
        root.innerHTML = output
        console.log(rootElement);
      }
    }
  
    return {
      attach(component, root) {
        rootElement.set(root, component)
        render()
      },
      connect(selector = state => state) {
        return component => (props, ...args) =>
          component(Object.assign({}, props, selector(state), ...args))
      },
      dispatch(action, ...args) {
        state = reducer(state, action, args)
        console.log(listNav);
        render()
      }
    }
  }
  
  function reducer(state = {listNav}, action, args) {
  
    switch (action) {
      case 'create':
        const a = $('input[type="text"]')
        console.log(a.value, state);
        if (a.value != '') {
          listNav.arr.push({name:a.value,update: false})
        }
        break
       /* return a != '' && {
          ...state,
          arr: [...state.arr, ab]
        }*/
      case 'delete':
        if (confirm('are you sure') == true)
          listNav.arr.splice(args, 1)
  
        break
      case 'enter':
        if (event.key === 'Enter')
          dispatch('create')
        break
      case 'toggle':
        listNav.tog = !listNav.tog
        break
      case 'update':
        listNav.arr[args].update = !listNav.arr.update
        break
      case 'change':
        if($('#change').value != '')
        {listNav.arr[args].name = $('#change').value
        console.log(listNav.arr[args].name);
        listNav.arr[args].update = !listNav.arr[args].update}
        break
      default:
        return state
  
    }
  }
  
  
  
  
  function inputBar() {
    return `<input type="text" onkeypress="dispatch('enter')">
           <button onClick="dispatch('create')">ADD</button>
           <button onClick="dispatch('toggle')">Edit</button>
      <p>List to do</p> `
  }
  
  function buttonEdit(navNode,i) {
    return html`
                    <span>
                              <button onClick= "dispatch('delete','${i}')">X</button>
                              <button onClick= "dispatch('update','${i}')">/</button>
                    </span>`
  }
  const { attach, connect, dispatch } = createStore(reducer)
  window.dispatch = dispatch()
  const connector = connect()
  
  rootElements = $('#root')
  connector(navElement)
  console.log(connector(navElement));
  attach(navElement, rootElements)
  
  function navElement() {
    return inputBar()+ html`<ul>${listNav.arr.map((navNode,index)=>html`<li> <div class ="lis">${s(navNode, index)}</div></li>`)}</ul>`
  }
  
  
  function listNode(navNode, index) {
    return html`<span>${navNode.name}</span>${listNav.tog && buttonEdit(navNode,index)}</div>`
  }
  
  function updateList(navNode,index) {
    return html`
    <input id ="change" type="text" value="${navNode.name}" ><button onclick="dispatch('change','${index}')">Change</button>
    `
  }
  
  function s(navNode,index) {
     if(navNode.update == false)
           return listNode(navNode,index)
            else
           return updateList(navNode,index)
            
  }
  
  
  
  