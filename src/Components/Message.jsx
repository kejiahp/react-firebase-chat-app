import React from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../Context/AuthContext'
import { ChatContext } from '../Context/ChatContext'

const Message = ({message}) => {
  const { data } = useContext(ChatContext)
  const { currentUser } = useContext(AuthContext)

  const ref = useRef()

  useEffect(() => {
    ref.current?.scrollIntoView({ behaviour:"smooth" })
  }, [])


  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && 'owner' }`}>
      <div className="messageInfo">
        <img src={message.senderId === currentUser.uid ? currentUser.photoUrl: data.user.image} alt="" />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  )
}

export default Message