import { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'

// styles
import './Signup.css'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [thumbnail, setThumbnail] = useState(null) // to set the image/dp/thumbnail of the user logged in.
  const [thumbnailError, setThumbnailError] = useState(null) // to see if there is a thumbnail error, while selecting the file
  const { signup, isPending, error } = useSignup() 
  
  const handleSubmit = (event) => {
    event.preventDefault()
    signup(email, password, displayName, thumbnail)
  }

  const handleFileChange = (event) => {
    setThumbnail(null) //resetting previous thumbnail back to null, beacuse user is choosing a new thumbnail or removing it

    let selected = event.target.files[0] 
    // event.target.files return an array of selected files by the users (as a user can select multiple files)
    // therefore we want the first selected files from it.

    console.log(selected)

    // If no file is being selected (for ex - if one user selects an image then again cancels it, then selected will be null)
    if(!selected) {
      setThumbnailError('Please select a file')
      return
    }

    // if the type of the file is not an image file (i.e if there are audio, video files)
    if(!selected.type.includes('image')){
      setThumbnailError('Selected file must be an image file')
      return
    }

    if(selected.size > 1500000){
      setThumbnailError('Image file size must be less than 1500kb')
      return
    }

    //Now if user has correctly chosen the file
    setThumbnailError(null)
    setThumbnail(selected)
    console.log('thumbnail update')
  
  }

  return (
    <form onSubmit={handleSubmit} className="auth-form">
      <h2>Sign Up</h2>
      <label>
        <span>Email:</span>
        <input
          required 
          type="email" 
          onChange={(event) => setEmail(event.target.value)} 
          value={email}
        />
      </label>
      <label>
        <span>Password:</span>
        <input
          required
          type="password" 
          onChange={(event) => setPassword(event.target.value)} 
          value={password}
        />
      </label>
      <label>
        <span>Display Name:</span>
        <input
          required
          type="text" 
          onChange={(event) => setDisplayName(event.target.value)} 
          value={displayName}
        />
      </label>
      <label>
        <span>Profile Thumbnail:</span>
        <input 
          required
          type="file"  // img file which the user will choose to upload his/her thumbnail
          onChange={handleFileChange}  // This onChange is triggered when the user selects a file or remove it
        />
        {thumbnailError && <div className='error'>{thumbnailError}</div>}
      </label>
      {!isPending && <button className="btn">Sign Up</button>} {/*we only need to show the clickable signup button, when loading is not there
      i.e some asyn process(either for loggin in, or signing in etc) is not running*/}
      {isPending && <button className="btn" disabled>Loading...</button>} {/*When there is loading, showing the unclickable loading button */}
      {error && <div className='error'>{error}</div>}
    </form>
  )
}