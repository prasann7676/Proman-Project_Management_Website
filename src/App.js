import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './hooks/useAuthContext'; 

//styles
import './App.css'

//pages and components imported
import Dashboard from './pages/dashboard/Dashboard'
import Create from './pages/create/Create'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Project from './pages/project/Project'
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import OnlineUsers from './components/OnlineUsers';

function App() {

  const { user, authIsReady } = useAuthContext();

  return (
    <div className="App">
      {console.log(user, authIsReady)}
      {authIsReady && ( // when authIsReady, that is we will only render when it is known that, a user is currently logged in.
      // or a user has not refreshed, while he/she is logged in
      // so if we refreshed a page in which we are currently logged in, our user becomes null 
      // and authIsready becomes false(as set as default values in AuthContext)
      // so at that fraction of second when authIsready is false, if we render the current page in which previously we were logged in
      // so we will be rendered a page in which is will show that we are not logged in, so it will show a login page
      // which is wrong as we know before refreshing the page we were loggedin
      // when we refresh a page, the particular component undergoes unmounting, and we have a cleanup function while unmounting 
      // which reassigns the prev user state to the global user state again.
      // This takes time, so between this time user will be empty, we want no rendering happening during this time.
      // So, to avoid rendering of the page when user refreshes for a fraction of second, we use this global state -> authIsReady.
      // So, after the unmounting process is completely done, and dispatch function is completed, user will be assigned the prev user cred
      // and authIsready will be true(as it is passed in dispatch function while unmounting in AuthContext.js)
      <BrowserRouter>
        {/*Only when user is logged in sidebar will be invoked */}
        {user &&  <Sidebar />}  {/*Sidebar component on the left of the screen */}
        <div className='container'>
          <Navbar /> {/*Navbar will be show according to, if user if logged in or not */}
          <Routes>
            {console.log(user)}
            <Route path="/" element={user ?<Dashboard /> : <Navigate to="/login" />}>
              {/* if not loggen in, then when accessing the dashboard, Navigate them
              If user is currecntly logged, in that only we have to show the Dashboard */}
            </Route>
            <Route path="/create" element={user ? <Create /> : <Navigate to="/login" />}>
            </Route>
            <Route path="/projects/:id" element={user ? <Project /> : <Navigate to="/login" />}> Route parameter with name id
            </Route>
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />}>
              {/* If user is logged in donot show the log in button again, rather navigate them to the dashboard */}
            </Route>
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />}>
            </Route>
          </Routes>
        </div>
        {user && <OnlineUsers />} 
        {/* If user is logged in, then display all users(with the status that they are online or offline)   */}
      </BrowserRouter>
      )}
    </div>
  );
}

export default App
