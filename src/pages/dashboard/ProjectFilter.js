//List of atributes according to which we want to filter the projects
const filterList = ['All', 'Mine', 'Development', 'Design', 'Marketing', 'Sales']

export default function ProjectFilter({ currentFilter, changeFilter }) {

  const handleClick = (newFilter) => {
      changeFilter(newFilter)
  }  

  return (
    <div className="project-filter">
      <nav>
        <p>Filter By: </p>
        {filterList.map((f) => (
            //we apply the active class to the button when the current selected filter is the current map element
            <button key={f} onClick={() => handleClick(f)} className={currentFilter === f ? 'active' : ''}>
                {f} 
            </button>
        ))}
      </nav> 
    </div>
  )
}
