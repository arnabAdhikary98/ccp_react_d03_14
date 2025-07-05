import React from "react";
import axios from "axios";

function TaskList() {
  const [tasks, setTasks] = React.useState([]);       // Initialize as array
  const [error, setError] = React.useState(null);     // Track any fetch error
  const [loading, setLoading] = React.useState(true); // Loading state

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(
        "https://your-firebase-db.firebaseio.com/tasks.json"
      );
      const data = res.data;

      if (!data) {
        setTasks([]); // No tasks in DB
      } else {
        // Convert object returned by Firebase into array
        const taskList = Object.entries(data).map(([key, value]) => ({
          id: key,             // Use Firebase key as unique ID
          ...value,            // Spread task data
        }));
        setTasks(taskList);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError("Failed to load tasks. Please try again."); // Show to user
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
            <li key={task.id}>{task.name}</li> // Unique key = task.id
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
