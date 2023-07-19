// styles
import './Avatar.css'


// src is a prop, which contain the imageURL for the specific user who is currently logged in
export default function Avatar({ src }) {
  return (
    <div className='avatar'>
        <img src={src} alt="user avatar" />
    </div>
  )
}

