import { Link } from 'react-router-dom';
import Avatar from './Avatar';

// styles
import './ProjectList.css';

export default function ProjectList({ projects }) {
  return (
    <div className='project-list'>
        {projects.length === 0 && <p>No projects added yet</p>}
        {/*Remember before applying the map function, make sure the array(here, projects)is not empty */}
        {projects.map(project => (
            // The project Name contains the link to the route, which is defined in the App.js as the route parameter: 'projects/:id'
            <Link to={`/projects/${project.id}`} key={project.id}>
                <h4>{project.name}</h4>
                {/*toDate turns the project.dueDate(which is a firestore timestamp) into a javascript Date object*/}
                {/*toDateString is used to convert the the Date object into a string*/}
                <p>Due by {project.dueDate.toDate().toDateString()}</p>
                <div className='assigned-to'>
                  <ul>
                     {project.assignedUsersList.map(user => (
                        <li key={user.photoURL}> {/*as photoURL is unique for every project, therefore it could be the key */}
                            <Avatar src={user.photoURL} /> {/*This displays the thumbnail of all the users assigned to the project */}
                        </li>
                     ))}
                   </ul>
                </div>
            </Link> 
        ))}
    </div>
  )
}
