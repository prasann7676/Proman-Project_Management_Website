import { useEffect, useState } from 'react';
import Select from 'react-select';
import { timestamp } from '../../firebase/config';
import { useCollection } from '../../hooks/useCollection';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from '../../hooks/useFirestore';
import { useNavigate } from 'react-router-dom';


import { serverTimestamp } from 'firebase/firestore';


// styles
import './Create.css'


// These are set of options, 
const categories = [
  { value: 'Development', label: 'Development' },
  { value: 'Design', label: 'Design' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Marketing', label: 'Marketing' },
]

export default function Create() {

  const navigate = useNavigate() // here it is used to redirect user to the dashboard, when there no error in adding the project in the firestore database
  const { addDocument, response } = useFirestore('projects') // the collection  projects will be made when we first add a document 

  const { documents } = useCollection('users')
  const [users, setUsers] = useState([])
  const { user } = useAuthContext()
   

  // form field values
  const [name, setName] = useState('') //for name of he project
  const [details, setDetails] = useState('') // for detailed comments for the project to be added
  const [dueDate, setDueDate] = useState('') // to keep track of the date input of the form
  const [category, setCategory] = useState('') // category of the project, upon which it is based on
  const [assignedUsers, setAssignedUsers] = useState([]) //to keep track of set of users who are selected by the current logged in user, to be assigned the particular project. 
  const [formError, setFormError ] = useState(null) // to catch is the Select field is empty(not filled by the user)

  // useEffect to assign the list of current users, to the options array, which will be used in Select for the Assign to input
  // So, whenever documents is accessed or updated(or formed) this useEffect will execute, creating the options array with real-time updation.
  useEffect(() => {
    if(documents) {
      const options = (documents.map(user => {
        return {value: user, label: user.displayName}
        // value will include all details of the user(displayName, id, online and photoURL)
        // label will be the displayName of the user
      }))
      setUsers(options)
    }
  }, [documents])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null) 
    // after every submit first, reset the previous error shown to null, if there would be an error in current submission
    // it would be updated accordingly, but we donot want the previous error to be shown, while loading of the form after submittion

    if(!category){ // of category is null, i.e. category field is left unfilled
      setFormError('Please select a project category')
      return
    } 

    if(assignedUsers.length < 1){ //If assigned user is left unfilled
      setFormError('Please assign the project to atleast 1 user')
      return
    }


    // object which stores the info of the user who is currently logged in or making changes to the Add project 
    const createdBy = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid
    }

    // we store info for the assigned users, (except the online property as we dont need it)
    // so we cleaned the information stored in the assignedUser property, to take inly the info we need
    const assignedUsersList = assignedUsers.map((u) => {
      return {
        displayName: u.value.displayName,
        photoURL: u.value.photoURL,
        id: u.value.id
      }
    })

    // This project object will be sent to the firebase, so that This information about the project
    // submitted by the user, can be stored according to the user and can be displayed whenever the particular user login
    const project = {
      name,
      details, // details of the project that the user inputed in the form
      category: category.value,
      dueDate: serverTimestamp(), // This is the timestamp of sue date filled by the user for the project 
      comments: [], // set of comments, made by the assigned users of the particular project
      createdBy, // user info for the user who created the project
      assignedUsersList //list of users contributing in the project, who could comment
    }

    // console.log("dueDate", dueDate)

    await addDocument(project)  // adding the project object as a document in the projects collection

    if(!response.error) {
      navigate('/') //If there is no error in adding the project in the firestore database, then redirect the user to the dashboard
      // where he/she could see the added project.
    }

  }

  return (
    <div className="create-form">
      <h2 className="page-title">Create a new Project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project name:</span>
          <input
            required 
            type="text" 
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label>
          <span>Project Details:</span>
          <textarea 
            required
            onChange={(e) => setDetails(e.target.value)}
            value={details} 
          ></textarea>
        </label>
        <label>
          <span>Set due date:</span>
          <input
            required 
            type="date" 
            onChange={(e) => setDueDate(e.target.value)} 
            value={dueDate}
          />
        </label>
        <label>
          <span>Project category:</span>
          {/* Options array should contain objects which have 2 properties {value, label} */}
          {/* select is a inbuilt react library to show select option in the forms */}
          {/* Remember required field donot work with Select, therefore we have to manually check if these inputs are filled or not */}
          {/* So that we could, display an error, if this field is empty */}
          <Select 
            onChange={(option) => setCategory(option)}
            options={categories}
          />
        </label>
        <label>
          <span>Assign to:</span>
          <Select 
            onChange={(option) => setAssignedUsers(option)}
            options={users}
            isMulti // This allow multiple options to be selected
          />
        </label>
        <button className="btn">Add Project</button>

        {formError && <p className='error'>{formError}</p>}
      </form>
    </div>
  )
}