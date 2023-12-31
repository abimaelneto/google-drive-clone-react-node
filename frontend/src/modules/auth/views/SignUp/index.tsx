import { Button, TextField } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { AuthView } from '../../components/AuthView'
import { signUpThunk } from '@/modules/auth/store/thunks/signUp'
import { useAppDispatch } from '@/store/hooks'
import { useState } from 'react'

export const SignUp = () => {
  const [data, setData] = useState({ email: '', name: '', password: '' })
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const handleSubmit = async () => {
    try {
      await dispatch(signUpThunk(data)).unwrap()
      setData({ email: '', password: '', name: '' })
      navigate('/login')
    } catch (err) {
      console.log(err)
      alert('Something went wrong')
    }
  }
  return (
    <AuthView
      form={
        <>
          <TextField label="Name" name="name" />
          <TextField label="Email" name="email" type="email" />
          <TextField label="Password" name="password" type="password" />
          <TextField
            label="Password Confirmation"
            name="passwordConfirmation"
            type="password"
          />
        </>
      }
      actions={
        <>
          <Button variant="contained" onClick={handleSubmit}>
            Register
          </Button>
          <Link to="/login">
            <Button>Login</Button>
          </Link>
        </>
      }
    />
  )
}
