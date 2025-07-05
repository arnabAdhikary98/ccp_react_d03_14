# Debugging and Fixing React TaskList Component (Firebase)

## Problem Statement

The following React component has bugs:

```jsx
function TaskList() {
  const [tasks, setTasks] = React.useState([]);

  const fetchData = () => {
    axios("https://your-firebase-db.firebaseio.com/tasks.json")
      .then((response) => setTasks(response.data)) // Error here?
      .catch((error) => console.log("Error fetching tasks:", error));
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.name}</li> // Error here?
        ))}
      </ul>
    </div>
  );
}
```

### Issues to Fix

* The tasks state is not correctly set; parse the Firebase response properly.
* Each `<li>` must have a unique key prop.
* Add error handling to display an error message when data fetching fails.

## Improved Solution

Below is the fixed and improved version of the component:

```jsx
import React from "react";
import axios from "axios";

function TaskList() {
  const [tasks, setTasks] = React.useState([]);
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        "https://your-firebase-db.firebaseio.com/tasks.json"
      );
      const data = res.data;

      if (!data) {
        setTasks([]);
      } else {
        const taskList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setTasks(taskList);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>Task List</h1>

      {loading && <p>Loading tasks…</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.name}</li>
          ))}
        </ul>
      )}

      {!loading && !error && tasks.length === 0 && (
        <p>No tasks found.</p>
      )}
    </div>
  );
}

export default TaskList;
```

## Fixes and Improvements

### ✅ Parse Firebase Response Correctly

Firebase returns data as an object. We convert it to an array using:

```js
const taskList = Object.entries(data).map(([key, value]) => ({
  id: key,
  ...value,
}));
```

### ✅ Unique Key Prop

We now use `task.id` as the unique key prop for `<li>`, ensuring React can properly track items.

### ✅ Error Handling

* Added error state to show an error message to users.
* Display "Failed to load tasks" if fetching fails.

### ✅ Loading State

Displays "Loading tasks…" while data is being fetched.

### ✅ Empty Data Handling

Displays "No tasks found." if the database returns no tasks.

## ✅ Conclusion

With these changes, the `TaskList` component now properly fetches and displays tasks from Firebase, handles errors, shows loading states, and uses unique keys to prevent React warnings.

---

**Note:** Remember to replace `https://your-firebase-db.firebaseio.com/tasks.json` with your actual Firebase Realtime Database URL.
