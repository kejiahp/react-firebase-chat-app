import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Link } from 'react-router-dom'

const Login = () => {
  const [error, setError] = useState(false)
  const navigate = useNavigate()


  const handleSubmit = async (e) => {
    e.preventDefault()

    const email = e.target[0].value
    const password = e.target[1].value

    try{
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
    }
    catch(err){
      setError(true)
    }
  }


  return (
    <div className='formContainer'>
        <div className='formWrapper'>

            <span className='logo'>Elijah Chat</span>
            <span className='title'>Login</span>
            <form onSubmit={handleSubmit}>

              { error && <p style={{color: 'red'}}>Something went wrong...</p> }
                <input type='email' placeholder='email'/>
                <input type='password' placeholder='password'/>
            
                <button>Sign up</button>
            </form>

            <p>You don't have an account? <Link to="/register">Register</Link></p>
        </div>
  </div>
  )
}

export default Login