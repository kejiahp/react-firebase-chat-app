import React from 'react'

const Navbar = () => {
  return (
    <div className='navbar'>
      <span className='logo'>Elijah Chat</span>
      <div className='user'>
        <img src="https://images.pexels.com/photos/13292768/pexels-photo-13292768.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load" alt="" />
        <span>John</span>
        <button>logout</button>
      </div>
    </div>
  )
}

export default Navbar