import React, { useContext } from 'react'
import { useState } from 'react'
import Attach from '../img/attach.png'
import Img from '../img/img.png'
import { AuthContext } from '../Context/AuthContext'
import { ChatContext } from '../Context/ChatContext'
import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../firebase'
import { v4 as uuid } from 'uuid'
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'

const Input = () => {
  const [img, setImg] = useState(null)
  const [text, setText] = useState("")
  const [err, setError] = useState(false)

  const { data } = useContext(ChatContext)
  const { currentUser } = useContext(AuthContext)

  const handleSend = async () => {
    if(img){

      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on('state_changed', 
        (snapshot) => {
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
        (error) => {
          setError(true)
          console.log(err)
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId ) ,{
              messages: arrayUnion({
                id: uuid(),
                text: text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              })
            } )
          });
        }
      );


    }
    else{
      await updateDoc(doc(db, "chats", data.chatId ) ,{
        messages: arrayUnion({
          id: uuid(),
          text: text,
          senderId: currentUser.uid,
          date: Timestamp.now()
        })
      } )
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId+".lastMessage"] : {
        text
      },
      [data.chatId+".date"]: serverTimestamp()
    })

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId+".lastMessage"] : {
        text
      },
      [data.chatId+".date"]: serverTimestamp()
    })

    setText("")
    setImg(null)
  }
  return (
    <div className='input'>
      <input type="text" placeholder='Type something...' onChange={e=> setText(e.target.value)} value={text}/>
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