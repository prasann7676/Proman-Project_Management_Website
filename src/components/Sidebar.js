import { NavLink } from 'react-router-dom';
import Avatar from './Avatar';
import { useAuthContext } from '../hooks/useAuthContext';

//styles
import './Sidebar.css';
import DashboardIcon from '../assets/dashboard_icon.svg'
import AddIcon from '../assets/add_icon.svg'

export default function Sidebar() {

  const { user } = useAuthContext();

  return (
    <div className='sidebar'>
      <div className='sidebar-content'>
        <div className='user'>
            {/* Avatar components here */}
            {/* avatar and username here*/}
            <Avatar src={user.photoURL} />
            <p>Hey {user.displayName}</p>
        </div>  
        <nav className='links'>
            <ul>
              <li>
                <NavLink to="/"> {/*Dashboard link on the navbar with the Dashboard icon */}
                   <img src={DashboardIcon} alt="dashboard icon" /> 
                   <span>Dashboard</span>
                </NavLink>
              </li> 
              <li>
                  <NavLink to="/create"> 
                    <img src={AddIcon} alt="Add project icon" />
                    <span>New Project</span>
                  </NavLink>
              </li>
            </ul>
        </nav>
      </div>
    </div>
  )
}
