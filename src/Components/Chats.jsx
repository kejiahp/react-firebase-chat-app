import { doc, onSnapshot } from 'firebase/firestore'
import React from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { AuthContext } from '../Context/AuthContext'
import { ChatContext } from '../Context/ChatContext'
import { db } from '../firebase'

const Chats = () => {
  const [ chats, setChats ] = useState([])
  const { currentUser } = useContext(AuthContext)
  const { dispatch } = useContext(ChatContext)

  useEffect(()=>{
    const getChats = () => {
        const unsub = onSnapshot(doc(db,"userChats", currentUser.uid ), (doc) => {
          setChats(doc.data())
      });
    
      return () => {
        unsub()
      }
    }

    currentUser.uid && getChats()

  }, [currentUser.uid] )

  const handleSelect = (u) => {
    dispatch({type:"CHANGE_USER", payload: u})
  }

  return (
    <div className='chats'>
      {
        Object.entries(chats)?.map((chat) => (

          <div key={chat[0]} className='userChat' onClick={() => handleSelect(chat[1].userInfo) }>
          <img src={chat[1].userInfo.image} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo.name}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>

        ))
      }
      
    </div>
  )
}

export default Chats