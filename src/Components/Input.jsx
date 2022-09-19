import React, { useContext } from 'react'
import { useState } from 'react'
import Attach from '../img/attach.png'
import Img from '../img/img.png'
import { AuthContext } from '../Context/AuthContext'
import { ChatContext } from '../Context/ChatContext'
import { arrayUnion, doc, Timestamp, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { v4 as uuid } from 'uuid'

const Input = () => {
  const [img, setImg] = useState(null)
  const [text, setText] = useState("")

  const { data } = useContext(ChatContext)
  const { currentUser } = useContext(AuthContext)

  const handleSend = async () => {
    if(img){
      
    }
    else{
      await updateDoc(doc(db, "chats", data.chatId ) ,{
        messages: arrayUnion({
          id: uuid,
          text: text,
          senderId: currentUser.uid,
          date: Timestamp.now()
        })
      } )
    }
  }
  return (
    <div className='input'>
      <input type="text" placeholder='Type something...' onChange={e=> setText(e.target.value)}/>
      <div className="send">
        <img src={Attach} alt=""/>
        <input type="file" accept='image/*' style={{display: "none"}} id="file" onChange={e=> setImg(e.target.files[0])} />
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
      
    </div>
  )
}

export default Input