// For project/:id page, listing of comments related to the project
// and displaying the details for the project.

import Avatar from "../../components/Avatar";
import { projectAuth } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useAuthContext } from "../../hooks/useAuthContext"; // to get info of the current logged in user
import { useNavigate } from 'react-router-dom';

export default function ProjectSummary({ project }) {

  const { deleteDocument } = useFirestore('projects')
  const { user } = useAuthContext()
  const navigate = useNavigate()

  const handleClick = (e) => {
    deleteDocument(project.id)

    navigate('/')
  }


  // Whoever user is a part of a project, whether he has or has not created the project (but is a part of the project)
  // Project should be visible to him. But, If he is not the part of the project, then this project will not be visible in his dashboard
  return (
    <div>
      <div className="project-summary">
          <h2 className="page-title">{project.name}</h2>
          <p>By {project.createdBy.displayName}</p>
          <p className="due-date"> {/*displaying projects's due date */}
              Project due by {project.dueDate.toDate().toDateString()} {/*for this line's explanation see in ProjectList.js */}
          </p>
          <p className="details"> {/*displaying project's details */}
            {project.details}
          </p> 
          <h4>Project is assigned to:</h4> {/*displaying assignedUsers for the project */}
          <div className="assigned-users">
            {project.assignedUsersList.map(user => (
                <div key={user.id}>
                    <Avatar src={user.photoURL} />
                </div>
            ))} 
          </div>
      </div>  
      {/*Now, this button is to delete the particular project from the lists of projects */}
      {/*But, remember this button should only be visible(or this operation can should only be performed) */}
      {/* By the creator of the project. */}    
      {user.uid === project.createdBy.id && (
        <button className="btn" onClick={handleClick}>Mark as Complete</button>
      )}
    </div>
  )
}
