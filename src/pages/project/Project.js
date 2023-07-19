// deals with the project section of the App

import { useParams } from 'react-router-dom';
import { useDocument } from '../../hooks/useDocument';
import ProjectSummary from './ProjectSummary';
import ProjectComment from './ProjectComment';

// styles
import './Project.css'

export default function Project() {

  const { id } = useParams() // as URL is /projects/:id
  const { document, error } = useDocument('projects', id)

  //another way to write condition statements to display things
  if(error){
    return <div className='error'>{error}</div>
  }

  if(!document){
    return <div className='loading'>Loading...</div>
  }
 
  return (
    <div className='project-details'>
      <ProjectSummary project={document} />
      <ProjectComment project={document} />
    </div>
  )
}
