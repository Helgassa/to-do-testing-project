import React, { useEffect, useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('https://rest-api-example.hexlet.app/tasks');
        if (!response.ok) throw new Error('Не удалось загрузить задачи');
        const data = await response.json();
        const tasksWithStatus = data.tasks.map((task: Task) => ({
          ...task,
          completed: false,
        }));
        setTasks(tasksWithStatus);
      } catch (err) {
        setError('Ошибка при загрузке задач. Отображаем дефолтные задачи.');
        setTasks([
          {
            id: '1',
            title: 'Задача по умолчанию 1',
            description: 'Это задача, добавленная локально',
            completed: false,
          },
          {
            id: '2',
            title: 'Задача по умолчанию 2',
            description: 'Это ещё одна локальная задача',
            completed: false,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const addTask = () => {
    if (!newTaskTitle.trim() || !newTaskDescription.trim()) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTaskTitle,
      description: newTaskDescription,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setNewTaskDescription('');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const toggleTaskCompletion = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  if (loading) {
    return <p data-test-id="loading-message">Загрузка...</p>;
  }

  return (
    <div className="App">
      <h1 data-test-id="title">Список задач</h1>
      {error && <p className="error-message" data-test-id="error-message">{error}</p>}
      <ul data-test-id="task-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={task.completed ? 'completed' : ''}
            data-test-id={`task-${task.id}`}
          >
            <div>
              <h2 data-test-id="todo-title">{task.title}</h2>
              <p data-test-id="todo-description">{task.description}</p>
            </div>
            <div>
              <button data-test-id="toggle-completion" onClick={() => toggleTaskCompletion(task.id)}>
                {task.completed ? 'Снять отметку' : 'Отметить как выполненную'}
              </button>
              <button className="delete" data-test-id="delete-task" onClick={() => deleteTask(task.id)}>Удалить</button>
            </div>
          </li>
        ))}
      </ul>

      <h2 data-test-id="add-task-title">Добавить новую задачу</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        addTask();
      }}>
        <input
          type="text"
          placeholder="Название задачи"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          data-test-id="new-task-title"
        />
        <input
          type="text"
          placeholder="Описание задачи"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          data-test-id="new-task-description"
        />
        <button className="add-task" type="submit" data-test-id="add-task-button">Добавить задачу</button>
      </form>
    </div>
  );
};

export default TaskList;
