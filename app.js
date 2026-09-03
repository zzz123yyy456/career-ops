// Simple to-do app using localStorage
const STORAGE_KEY = 'career-ops.todos'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8)
}

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch (e) {
    return []
  }
}

function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
}

function render() {
  const list = document.getElementById('todo-list')
  const todos = loadTodos()
  list.innerHTML = ''
  todos.forEach(todo => {
    const li = document.createElement('li')
    li.dataset.id = todo.id
    li.className = todo.done ? 'done' : ''

    const cb = document.createElement('input')
    cb.type = 'checkbox'
    cb.checked = !!todo.done
    cb.className = 'todo-checkbox'

    const span = document.createElement('span')
    span.className = 'text'
    span.textContent = todo.text
    span.title = 'Double click to edit'

    const del = document.createElement('button')
    del.className = 'btn delete'
    del.textContent = 'Delete'

    li.appendChild(cb)
    li.appendChild(span)
    li.appendChild(del)
    list.appendChild(li)
  })
}

function addTodo(text) {
  const todos = loadTodos()
  todos.unshift({ id: uid(), text: text.trim(), done: false })
  saveTodos(todos)
  render()
}

function toggleTodo(id) {
  const todos = loadTodos()
  const t = todos.find(x => x.id === id)
  if (t) t.done = !t.done
  saveTodos(todos)
  render()
}

function deleteTodo(id) {
  let todos = loadTodos()
  todos = todos.filter(x => x.id !== id)
  saveTodos(todos)
  render()
}

function editTodo(id) {
  const todos = loadTodos()
  const t = todos.find(x => x.id === id)
  if (!t) return
  const next = prompt('Edit task', t.text)
  if (next === null) return
  t.text = next.trim()
  saveTodos(todos)
  render()
}

function clearCompleted() {
  let todos = loadTodos()
  todos = todos.filter(x => !x.done)
  saveTodos(todos)
  render()
}

function clearAll() {
  if (!confirm('Clear ALL tasks?')) return
  localStorage.removeItem(STORAGE_KEY)
  render()
}

document.addEventListener('DOMContentLoaded', () => {
  render()

  const form = document.getElementById('todo-form')
  const input = document.getElementById('todo-input')
  const list = document.getElementById('todo-list')

  form.addEventListener('submit', e => {
    e.preventDefault()
    const v = input.value
    if (!v.trim()) return
    addTodo(v)
    input.value = ''
    input.focus()
  })

  list.addEventListener('click', e => {
    const li = e.target.closest('li')
    if (!li) return
    const id = li.dataset.id
    if (e.target.classList.contains('delete')) {
      deleteTodo(id)
    } else if (e.target.classList.contains('todo-checkbox')) {
      toggleTodo(id)
    }
  })

  list.addEventListener('change', e => {
    if (e.target.classList.contains('todo-checkbox')) {
      const li = e.target.closest('li')
      toggleTodo(li.dataset.id)
    }
  })

  list.addEventListener('dblclick', e => {
    const li = e.target.closest('li')
    if (!li) return
    editTodo(li.dataset.id)
  })

  document.getElementById('clear-completed').addEventListener('click', clearCompleted)
  document.getElementById('clear-all').addEventListener('click', clearAll)
})
