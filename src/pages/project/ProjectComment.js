import { useState } from "react";
import Avatar from "../../components/Avatar";
import { timestamp } from '../../firebase/config';
import { Timestamp, serverTimestamp } from "firebase/firestore";
import { useAuthContext } from '../../hooks/useAuthContext';
import { useFirestore } from "../../hooks/useFirestore";
import formatDistanceToNow from "date-fns/formatDistanceToNow"; // This is a builtin library(inside date-fns package(to be installed))
// so as to show time like - added 2 min ago, or a sec ago, or 2 months ago, in this type of format


export default function ProjectComment({ project }) {

  const { updateDocument, response } = useFirestore('projects') // to update the comments of the project
  const [newComment, setNewComment] = useState('')
  const { user } = useAuthContext()

  const handleSubmit = async (e) => {
      e.preventDefault()
      
      // Comments object which stored the comments to be added, including its meta data(data of data)
      const commentToAdd = {
        disPlayName: user.displayName,
        photoURL: user.photoURL,
        content: newComment,
        createdAt: Timestamp.now(),
        id: Math.random()
      }

      console.log(commentToAdd)

    //   console.log(project.id)
      
      await updateDocument(project.id, {
          comments: [...project.comments, commentToAdd]
          // updating the comments, by adding the new comment into the previous set of comments for the project
      })

      if(!response.error){
          setNewComment('') 
          // so that the user can add a new comment, after submitting the previous comment
          // comments section will be become empty after submitting a comment.
      }
  }

  return (
    <div className="project-comments">
        <h4>Project Comments</h4>

        <ul>
          {/*If comments is not empty fisplay it */}
          {project.comments.length > 0 && project.comments.map(comment => (
              <li key={comment.id}>
                  <div className="comment-author">
                      <Avatar src={comment.photoURL} />
                      <p>{comment.disPlayName}</p>
                  </div>
                  <div className="comment-date">
                      {/*createdAt is an attribute in the project object, denoting the time of comment */}
                      {/*addSuffix add things like, ago at the end of time, For ex - 2 minutes ago */}
                      <p>{formatDistanceToNow(comment.createdAt.toDate(), {addSuffix: true})}</p>
                  </div>
                  <div className="comment-content">
                      <p>{comment.content}</p>
                  </div>
              </li>
          ))}  
        </ul>

        <form className="add-comment" onSubmit={handleSubmit}> 
          <label>
              <span>Add new comment:</span>
              <textarea 
                required
                onChange={(e) => setNewComment(e.target.value)}
                value={newComment}
              ></textarea>
          </label>  
          <button className="btn">Add Comment</button>
        </form>
    </div>
  )
}
