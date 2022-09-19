import React, { useState } from 'react'
import Add from '../img/addAvatar.png'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { ref } from 'firebase/storage'
import { uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from '../firebase'
import { doc, setDoc } from "firebase/firestore"; 
import { db } from '../firebase'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'


const Register = () => {
  const [error, setError] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const name = e.target[0].value
    const email = e.target[1].value
    const password = e.target[2].value
    const image = e.target[3].files[0]

    try {
      //This is handling the creation of the user with email and password
      const res = await createUserWithEmailAndPassword(auth, email, password)


      //UPLOADING IMAGES TO FIREBASE
      //Creating a reference for the image, the string is the image name
      const storageRef = ref(storage, name+'_profile_image');

      //attaching the reference to the image file
      const uploadTask = uploadBytesResumable(storageRef, image);

      uploadTask.on('state_changed',//MONITOR UPLOAD 
        (snapshot) => {
          //monitor progress of the upload
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              console.log("Image wasn't uploaded");
              break
          }
        },
        //error handling
        (error) => {
          setError(true)
        }, 
        () => {
          // Handle successful uploads on complete
          //getting the download url of an image
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            //updating user profile after successfull image upload by adding displayname and photourl
            await updateProfile(res.user, {
              displayName: name,
              photoURL: downloadURL
            })

            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              name,
              email,
              image:downloadURL
            })

            await setDoc(doc(db, "userChats", res.user.uid), {
              //empty
            })
            navigate("/")

          });
        }
      );



    }
    catch (err) {
      setError(true)
    }

  }

  return (
    <div className='formContainer'>
      <div className='formWrapper'>

        <span className='logo'>Elijah Chat</span>
        <span className='title'>Register</span>
        <form onSubmit={handleSubmit}>
          {error && <p style={{color:'red'}}>Something went wrong...</p> }
          <input type='text' placeholder='display name'/>
          <input type='email' placeholder='email'/>
          <input type='password' placeholder='password'/>
          <input type='file' style={{display: 'none'}} id="file"/>
          <label htmlFor="file">
            <img src={Add} alt="" />
            <span>Add an avatar</span>
          </label>
          <button>Sign up</button>
        </form>

        <p>You do have an account? <Link to="/login">Login</Link> </p>
      </div>
    </div>
  )
}

export default Register