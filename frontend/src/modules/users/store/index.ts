import { User } from '@/types/user'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { listUsersThunk } from './thunks/list'
import { getUserThunk } from './thunks/get'

const initialState: { users: User[]; selectedUser: User | null } = {
  users: [],
  selectedUser: null,
}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(
        listUsersThunk.fulfilled,
        (state, action: PayloadAction<User[]>) => {
          state.users = action.payload
        }
      )
      .addCase(getUserThunk.fulfilled, (state, action: PayloadAction<User>) => {
        state.selectedUser = action.payload
      })
  },
})

export const usersReducer = usersSlice.reducer
