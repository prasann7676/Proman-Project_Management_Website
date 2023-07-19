import { useCollection } from '../hooks/useCollection'

//collection
import Avatar from './Avatar';

// styles
import './OnlineUsers.css';

export default function OnlineUsers() {

    // Get the real-time documents (i.e. all documents in the firestore database)
    // having the collection named users
    const { error, documents } = useCollection('users')

    return (
        <div className='user-list'>
            <h2>All Users</h2>
            {error && <div>{error}</div>}
            {/*if the collection(users) is not null or empty */}
            {/*traverse/map through the document array and display them on the right side */}
            {documents && documents.map(user => (
                <div key={user.id} className='user-list-item'>
                    {user.online && <span className='online-user'></span>}
                    <span>{user.displayName}</span>
                    <Avatar src={user.photoURL} />
                </div>
            ))} 
        </div>
    )
}
