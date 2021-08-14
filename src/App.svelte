<script lang="ts">
  import type { Todo, VisibilityType } from "./types"

  const ENTER_KEY = 13
  const ESCAPE_KEY = 27

  let todos: Todo[] = []
  let newTodo: string = ""
  let editedId: number = -1
  let visibility: VisibilityType = "all"
  const filters = {
    all: (todos: Todo[]) => todos,
    active: (todos: Todo[]) => todos.filter((todo) => !todo.completed),
    completed: (todos: Todo[]) => todos.filter((todo) => todo.completed),
  }

  $: filteredTodos = filters[visibility](todos)
  $: remaining = filters.active(todos).length

  // add todo
  function addTodo(e) {
    if (e.keyCode === ENTER_KEY) {
      const value = newTodo.trim()
      if (!value) return
      todos = todos.concat({
        id: todos.length + 1,
        title: value,
        completed: false,
      })
      newTodo = ""
    }
  }
  // toggle all
  function handleToggleAll(e) {
    todos = todos.map((todo) => ({ ...todo, completed: e.target.checked }))
  }
  // edit todo
  function handleEdit(e) {
    const keyCode = e.keyCode
    if (keyCode === ESCAPE_KEY) {
      editedId = -1
    } else if (keyCode === ENTER_KEY) {
      e.target.blur()
    }
  }
  function handleBlur(e) {
    const value = e.target.value && e.target.value.trim()
    if (value) {
      todos = todos.map((todo) => {
        if (todo.id === editedId) {
          return {
            ...todo,
            title: value,
          }
        }
        return todo
      })
    } else {
      handleDelete(editedId)
    }

    editedId = -1
  }
  // delete todo
  function handleDelete(id: number) {
    todos = todos.filter((todo) => todo.id !== id)
  }
  // clear completed
  function handleClear() {
    todos = todos.filter((todo) => !todo.completed)
  }
</script>

<main class="todoapp">
  <header class="header">
    <h1>todos</h1>
    <!-- svelte-ignore a11y-autofocus -->
    <input
      class="new-todo"
      placeholder="What needs to be done?"
      autofocus
      bind:value={newTodo}
      on:keyup={addTodo}
    />
  </header>

  {#if todos.length > 0}
    <section class="main">
      <input
        id="toggle-all"
        class="toggle-all"
        type="checkbox"
        checked={remaining === 0}
        on:change={handleToggleAll}
      />
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        {#each filteredTodos as todo (todo.id)}
          <li
            class="todo"
            class:completed={todo.completed}
            class:editing={todo.id == editedId}
          >
            <div class="view">
              <input
                class="toggle"
                type="checkbox"
                bind:checked={todo.completed}
              />
              <!-- svelte-ignore a11y-label-has-associated-control -->
              <label on:dblclick={() => (editedId = todo.id)}
                >{todo.title}</label
              >
              <button class="destroy" on:click={() => handleDelete(todo.id)} />
            </div>
            {#if editedId === todo.id}
              <!-- svelte-ignore a11y-autofocus -->
              <input
                class="edit"
                type="text"
                autofocus
                value={todo.title}
                on:keyup={handleEdit}
                on:blur={handleBlur}
              />
            {/if}
          </li>
        {/each}
      </ul>
    </section>
    <footer class="footer">
      <!-- This should be `0 items left` by default -->
      <span class="todo-count"
        ><strong>{remaining}</strong> item{remaining > 1 ? "s" : ""} left</span
      >
      <!-- Remove this if you don't implement routing -->
      <ul class="filters">
        <li>
          <!-- svelte-ignore a11y-missing-attribute -->
          <a
            class:selected={visibility === "all"}
            on:click={() => (visibility = "all")}>All</a
          >
        </li>
        <li>
          <!-- svelte-ignore a11y-missing-attribute -->
          <a
            class:selected={visibility === "active"}
            on:click={() => (visibility = "active")}>Active</a
          >
        </li>
        <li>
          <!-- svelte-ignore a11y-missing-attribute -->
          <a
            class:selected={visibility === "completed"}
            on:click={() => (visibility = "completed")}>Completed</a
          >
        </li>
      </ul>
      <!-- Hidden if no completed items are left ↓ -->
      <button class="clear-completed" on:click={handleClear}
        >Clear completed</button
      >
    </footer>
  {/if}
</main>
<footer class="info">
  <p>Double-click to edit a todo</p>
  <p>Written by <a href="https://github.com/yangyang121">yangyang121</a></p>
  <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
</footer>

<style>
  .todo-list li .edit {
    display: block;
  }
</style>
