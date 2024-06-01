import { createSlice } from '@reduxjs/toolkit'
import { IAuthState } from '../../../common/types/auth'

const initialState: IAuthState = {
    user: {
        email: '',
        name: '',
        surname: '',
        sex: '',
        birth_date: '',
        phone_number: '',
        created_at: '',
    },
    isLogged: false
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state, action) {
            state.user = action.payload
            state.isLogged = true
        }
    }
})

export const {login} = authSlice.actions
export default authSlice.reducer