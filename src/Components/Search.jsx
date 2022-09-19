import React from 'react'
import { useState } from 'react'
import {db} from '../firebase'
import { collection,query,where,getDoc,getDocs, doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { useContext } from 'react'
import {AuthContext} from '../Context/AuthContext'
import { ChatContext } from '../Context/ChatContext'

const Search = () => {
  const { currentUser } = useContext(AuthContext)
  const [username, setUserName] = useState("")
  const [user, setUser] = useState(null)
  const [err, setErr] = useState(false)
  const { dispatch } = useContext(ChatContext)

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("name", "==", username))
    
    try{
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach(doc => {
        setUser(doc.data())
      })
    }
    catch(err){
      setErr(true)
    }
  }

  const handleEnter = (e) => {
    e.code === "Enter" && handleSearch();
  }

  const handleSelected = async () => {
    //check whether the chat group exists
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid

    const res = await getDoc(doc(db, "chats", combinedId ))

    if(!res.exists()) {
      //create chat in chats collection for the currentUser and the searched user
      await setDoc(doc(db, "chats", combinedId), {
        messages: []
      })

      //updating the userChat collection and adding the information of the searched user to ther collection
      await updateDoc(doc(db, "userChats", currentUser.uid),{
        [combinedId+".userInfo"] : {
          uid: user.uid,
          name: user.name,
          image: user.image
        },
        [combinedId+".date"] : serverTimestamp()
      } )

      //updating the userChat collection of the user being sent a message 
      await updateDoc(doc(db, "userChats", user.uid), {
        [combinedId+".userInfo"] : {
          uid: currentUser.uid,
          name: currentUser.displayName,
          image: currentUser.photoURL
        }, 
        [combinedId+".date"] : serverTimestamp()
      } )

    }

    dispatch({ type:"CHANGE_USER" , payload:user})

    setUser(null)
    setUserName("")
    
  }

  return (
    <div className='search'>
      <div className="searchForm">
        <input type="text" placeholder='Find a user' onKeyDown={handleEnter} onChange={e => setUserName(e.target.value)} value={username}/>
      </div>
      {err && <p style={{color: 'red'}}> Something went wrong... </p>}

      {user && <div onClick={handleSelected} className='userChat'>
        <img src={user.image} alt="" />
        <div className="userChatInfo">
          <span>{user.name}</span>
        </div>
      </div>}

    </div>
  )
}

export default Search