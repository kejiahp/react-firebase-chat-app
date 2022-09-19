import { createContext, useReducer } from "react"
import { useContext } from "react"
import { AuthContext } from "./AuthContext"

export const ChatContext = createContext()

export const ChatContextProvider = ({children}) => {

    const { currentUser } = useContext(AuthContext)

    const INITIAL_STATE = {
        user: {},
        chatId: "null"
    }

    const chatContextReducer = (state, action) =>{
        switch(action.type){
            case "CHANGE_USER":
                const combinedId = currentUser.uid > action.payload.uid ? currentUser.uid + action.payload.uid : action.payload.uid + currentUser.uid
                return {
                    user: action.payload,
                    chatId: combinedId
                }
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(chatContextReducer, INITIAL_STATE)

    return (
        <ChatContext.Provider value={ {data:state, dispatch} }>
            {children}
        </ChatContext.Provider>
    )
}