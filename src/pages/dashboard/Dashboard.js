import { useState } from 'react';
import ProjectList from '../../components/ProjectList';
import { useCollection } from '../../hooks/useCollection';
import ProjectFilter from './ProjectFilter';
import { useAuthContext } from '../../hooks/useAuthContext';

// styles
import './Dashboard.css';

export default function Dashboard() {

  const { user } = useAuthContext()
  const { documents, error } = useCollection('projects')
  const [currentFilter, setCurrentFilter] = useState('all') // inistial filter will be all, i.e all projects will be seen.
  
  const changeFilter = (newFilter) => {
    setCurrentFilter(newFilter)
  }

  // projects is an array of filtered project, according to a particular filter
  const projects = documents ? documents.filter(document => {
    switch(currentFilter) {
      case 'All':
        return true
      case 'Mine':
        let assignedToMe = false
        document.assignedUsersList.forEach(u => {
          if(u.id === user.uid) {
            assignedToMe = true
          }
        })
        return assignedToMe
      case 'Development':
      case 'Design':
      case 'Sales':
      case 'Marketing':
        console.log(document.category, currentFilter)
        return document.category === currentFilter  // returning if the currentFilter chosen is this current element in the documents
      default:
        return true
    }
  }) : null // we will return null in the projects when documents is empty

  return (
    <div>
      <h2 className='page-title'>Dashboard</h2>
      {error && <p className='error'>{error}</p>}
      {documents && (
        <ProjectFilter currentFilter={currentFilter} changeFilter={changeFilter} />
      )}
      {/*projects is the filtered list of projects(having complete details of the project), according to the particular filter */}
      {projects && <ProjectList projects={projects} />}
    </div>
  )
}
