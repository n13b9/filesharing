import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuth:boolean;
  user:null|any;
}

const initialState:AuthState = {
    isAuth:false,
    user:null

}

const authSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
        logIn:(state,action:PayloadAction<object>) =>{
            state.isAuth =true;
            state.user=action.payload
        },
        logOut:(state)=>{
            console.log("logout");
            state.isAuth=false;
            state.user=null;
        }
  },
})

export const { logIn,logOut } = authSlice.actions
export default authSlice.reducer