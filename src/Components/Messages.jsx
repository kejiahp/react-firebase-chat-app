import { doc, onSnapshot } from 'firebase/firestore'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useContext } from 'react'
import { ChatContext } from '../Context/ChatContext'
import { db } from '../firebase'
import Message from './Message'

const Messages = () => {
  const { data } = useContext(ChatContext)
  const [messages, setMessages] = useState([])

  useEffect(()=>{
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc)=> {
      doc.exists() && setMessages(doc.data().messages)
    })

    return () => {
      unSub()
    }
  } , [data.chatId])

  return (
    <div className='messages'>

      {
        messages.map(m => <Message key={m.id} message={m}/>)
      }
        
    </div>
  )
}

export default Messages