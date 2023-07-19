import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext';

import './Navbar.css';
import Temple from '../assets/temple.svg'; // importing logo for navbar

export default function Navbar() {

  const { logout, isPending } = useLogout();
  const { user } = useAuthContext();

  return (
    <div className='navbar'>
      <ul>
        <li className='logo'>
              <img src={Temple} alt="proman logo" />
              <span>The Proman</span>
        </li>
        {!user && (
          <>  
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}
        {user && (
          <>
            <li>
                {!isPending && <button className='btn' onClick={logout}>Logout</button>}
                {isPending && <button className='btn' disabled>Logging Out...</button>}
            </li>
          </>
        )}
      </ul>  
    </div>
  )
}
