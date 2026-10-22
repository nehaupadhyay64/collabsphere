const initialState = {
  tasks: [
    {
      id: 1,
      title: "React Practice",
      category: "Coding",
      completed: false,
    },
    {
      id: 2,
      title: "Study",
      category: "Education",
      completed: true,
    },
  ],
};

function taskReducer(state, action) {
  switch (action.type) {
    case "ADD":
      return {
        ...state,
        tasks: [...state.tasks, action.payload],
      };

    case "DELETE":
      return {
        ...state,
        tasks: state.tasks.filter(
          (task) => task.id !== action.payload
        ),
      };

    case "TOGGLE":
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload
            ? {
                ...task,
                completed: !task.completed,
              }
            : task
        ),
      };

    default:
      return state;
  }
}

export { initialState };
export default taskReducer;