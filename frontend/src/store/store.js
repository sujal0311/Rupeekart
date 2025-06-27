import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'

// Create the Redux store
export const store = configureStore({
  reducer: {
    user: userReducer,
  },
})