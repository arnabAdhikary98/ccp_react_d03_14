import { useState } from 'react'
import './App.css'
import TaskList from './components/TaskList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <TaskList />
    </>
  )
}

export default App
