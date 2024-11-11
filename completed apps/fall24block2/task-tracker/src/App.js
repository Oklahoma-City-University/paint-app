import { useRef, useState } from "react";
import { Component } from "react";

class TaskItem extends Component{
    constructor(props) {
        super(props);
        //Binding in the constructor
        //This tells JS to always run handleClick with the correct 'this'
        //Think of this as writing your name on your lunch so it doesn't get mixed up with others
        this.handleClick = this.handleClick.bind(this);
    }

    //continue binding in the regular method
    handleClick = (e) => {
        e.stopPropagation();
        this.props.onToggle();
    }

    handleDelete = (e) => {
        e.stopPropagation();
        this.props.onDelete();
    };

    render(){
        //Destructuring props makes our code cleaner
        const { title, priority, completed, reward} = this.props;
    return (
        <div
            className={`task-item ${completed ? 'completed' : ''}`}
            onClick={this.handleClick}
        >
            <h3>{title}</h3>
            <p>Priority: {priority}</p>
            <p>{completed ? 'Complete' : 'Incomplete'}</p>
            <p>Reward: {reward}</p>
            <button onClick={this.handleDelete}>Delete</button>
        </div>
    );
    }
}

function AddTask({onAdd}){
    //state for form inputs
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('Low');
    const [reward, setReward] = useState(0);

    //handle form submission
    const handleSubmit = (e) => {
        //prevent the form from causing a page reload
        e.preventDefault();
        //validation
        if(!title.trim()){
            alert('Please enter a task title');
            return;
        }

    //create new task object
    const newTask = {
        title: title.trim(),
        priority,
        completed: false,
        reward,
        id: Date.now() //simple method for generating a unique id from the current date/time
    }

    //call the onAdd function passed from the parent
    onAdd(newTask);

    //reset the form
    setTitle('');
    setPriority('Low');
    setReward(0)
};

return (
    <form onSubmit={handleSubmit} className="add-task-form">
        
        <div className="form-group">
            <label htmlFor="title">
                Task Title:
                <span className="required">*</span>
            </label>
            <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task title"
            required
            />
        </div>

        <div className="form-group">
            <label htmlFor="priority">Priority Level</label>
            <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
            </select>
        </div>
        <button type="submit">Add Task</button>
        

        <div className="form-group">
          <label htmlFor="reward">Reward Amount</label>
          <input
          id="reward"
          type="number"
          value={reward}
          onChange={(e) => setReward(e.target.value)}
          placeholder="Enter reward amount"
          />
        </div>
        </form>
        
);
}
function TaskList() {
    const [tasks, setTasks] = useState([
        // {id: 1, 
        // title: "Complete React Lab", 
        // priority: "High",
        // completed: false 
        // },
        // {id: 2, 
        // title: "Study Components", 
        // priority: "Medium",
        // completed: false 
        // },
        // {id: 3, 
        // title: "Practice Coding", 
        // priority: "High",
        // completed: false 
        // }
    ]);

    
    const addTask = (newTask) => {
        setTasks(prevTasks => [...prevTasks, newTask]);
    };
    
    //Function to delete a task
    const deleteTask = (taskId) => {
        //optional: add information
        if (window.confirm('Are you sure you want to delete this task?')) {
            //Filter out the task with the matching id
            setTasks(prevTasks =>
             prevTasks.filter(task => task.id !== taskId)
            );
        }
    };
    
    //Function to toggle task completion
    function toggleTask(taskId) {
        //setTasks is our state updater from useState
        setTasks(tasks.map(task => { 
            //For each task, check if it's the one we want to toggle
            if(task.id === taskId){
                //when true, create a new object with all existing properties, but flip completed status
            return {
                ...task,
                completed: !task.completed
            };
            }
            //These are not the tasks you're looking for
            return task;
        }));
    }
          

    return (
    <div className="task-list">
        <AddTask onAdd={addTask} />
        <div className="tasks">
            {tasks.length === 0 ? (
                <p className="no-tasks">No tasks yet. Add some tasks to start taskin'!</p>
            ) : (
                tasks.map(task => (
                    <TaskItem                  
                        key={task.id}
                        title={task.title}
                        priority={task.priority}
                        completed={task.completed}
                        reward={task.reward}
                        onToggle={() => toggleTask(task.id)}
                        onDelete={() => deleteTask(task.id)}
                        />
                ))
            )}
        </div>
    </div>
    )
}

// function UncontrolledTaskForm({onSubmit}){
//     //useRef creates a "box" to hold a value that persists between renders
//     //think of it like a sticky note that doesn't trigger re-renders

//     const titleInputRef = useRef(null);

//     const handleSubmit = (e) => {
//         e.preventDefault(); //stop the form from causing a page reload

//     //get the current value from our ref (sticky note)
//     const title = titleInputRef.current.value;
//     onSubmit(title);
//     }

//     return(
//         <form onSubmit={handleSubmit}>
//             <input
//             type="text"
//             ref={titleInputRef}
//             defaultValue=""
//             />
//             <button type="submit">Add Task</button>
//         </form>
//     )
// }

// //Controlled component example
// function ControlledTaskForm({onSubmit}){
//     //useState creates a "watched" value that triggers re-renders
//     const [title, setTitle] = useState('');
    
//     const handleSubmit = (e) => {
//         e.preventDefault();
//         onSubmit(title);
//         setTitle(''); // Clear the input after submission
//     };

//     //every keystroke updates our state
//     const handleChange = (e) => {
//         setTitle(e.target.value);
//     }

//     return (
//         <form onSubmit={handleSubmit}>
//             <input
//                 type="text"
//                 value={title}
//                 onChange={handleChange}
//             />
//             <button type ="submit">Add Task</button>
//         </form>
//     );
// }

// Validation function that returns an object of errors
const validateForm = (formData) => {
    // Initialize empty errors object
    // We'll add error messages to this if we find problems
    const [errors, setErrors] = {};
    
    // Check for empty title after trimming whitespace
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    // Check title length
    // This prevents users from entering extremely long titles
    if (formData.title.length > 50) {
      errors.title = 'Title must be less than 50 characters';
    }
    
    // If priority isn't one of our valid options
    // This prevents manipulation of select values
    if (!['Low', 'Medium', 'High'].includes(formData.priority)) {
      errors.priority = 'Invalid priority level';
    }
    
    // If dueDate is provided, ensure it's not in the past
    if (formData.dueDate) {
      const today = new Date();
      const dueDate = new Date(formData.dueDate);
      if (dueDate < today) {
        errors.dueDate = 'Due date cannot be in the past';
      }
    }
    
    // Return the errors object
    // Will be empty if no validation errors found
    return errors;
  };
  
  
function AddTaskForm({ onAdd }) {
    // Initialize all form fields in one state object
    // This is more maintainable than separate useState for each field
    const [formData, setFormData] = useState({
      title: '',        // Store the task title
      priority: 'Medium', // Default priority value
      dueDate: '',      // Optional due date field
      reward: ''        //set reward amount
    });
  
    // Universal change handler for all form inputs
    // This saves us from writing separate handlers for each input
    const handleChange = (e) => {
      // Destructure the event target properties we need
      const { name, value } = e.target;
      
      // Update state using the functional update pattern
      // This ensures we're always working with the latest state
      setFormData(prevData => ({
        ...prevData,     // Spread all existing form data
        [name]: value    // Update only the field that changed
                        // [name] is a computed property name - it uses the actual
                        // value of 'name' as the key
      }));
    };
  
    const handleSubmit = (e) => {
      // Prevent the default form submission
      // This stops the page from reloading
      e.preventDefault();
      
      // Form validation
      // trim() removes whitespace from both ends of the string
      if (!formData.title.trim()) {
        alert('Please enter a task title');
        return;  // Exit early if validation fails
      }
  
      // If we get here, validation passed
      // Call the function passed from parent with our form data
      onAdd(formData);
  
      // Reset form to initial state
      // This gives users immediate feedback that their submission worked
      setFormData({
        title: '',
        priority: 'Medium',
        dueDate: '',
        reward: ''
      });
    };
  
    return (
      // The className helps with styling and identifying the form
      <form onSubmit={handleSubmit} className="add-task-form">
        {/* Each form group is wrapped in a div for styling/structure */}
        <div className="form-group">
          <label htmlFor="title">
            Task Title: {/* htmlFor matches input id for accessibility */}
            <span className="required">*</span> {/* Visual required indicator */}
          </label>
          <input
            id="title"           // Matches the htmlFor in label
            name="title"         // Matches the property name in formData
            type="text"
            value={formData.title} // Controlled input - React controls the value
            onChange={handleChange} // Called on every keystroke
            placeholder="Enter task title" // Helper text for users
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="priority">Priority Level:</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            {/* Each option represents a priority level */}
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="reward">Reward Amount:</label>
          <input
          id="reward"
          name="reward"
          value=""
          onChange={handleChange}
           />
        </div>
  
        <div className="form-group">
          <label htmlFor="dueDate">Due Date:</label>
          <input
            id="dueDate"
            name="dueDate"
            type="date"         // HTML5 date picker
            value={formData.dueDate}
            onChange={handleChange}
            // min={new Date().toISOString().split('T')[0]} // Optional: Prevent past dates
          />
        </div>
  
        <button type="submit">Add Task</button>
      </form>
    );
  }

export default function App() {
    return(
    <div className="app">
        <TaskList />
    </div>
    );
}