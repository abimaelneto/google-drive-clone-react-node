import { Button, TextField } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { AuthView } from '../../components/AuthView'
import { useAppDispatch } from '../../../../store/hooks'
import { loginThunk } from '@/modules/auth/store/thunks/login'
import { FormEvent, useState } from 'react'

export const Login = () => {
  const [data, setData] = useState({
    email: '',
    password: '',
  })
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleChange = (e: FormEvent) => {
    const { name, value } = e.target as HTMLInputElement
    setData((old) => ({ ...old, [name]: value }))
  }

  const handleSubmit = async () => {
    try {
      await dispatch(loginThunk(data)).unwrap()
      setData({ email: '', password: '' })
      navigate('/dashboard')
    } catch (err: unknown) {
      console.log(err)
      if ((err as { code: string }).code == 'ERR_BAD_REQUEST') {
        alert('Wrong email or password')
      } else alert('Something went wrong')
    }
  }
  return (
    <AuthView
      form={
        <>
          <TextField
            onInput={handleChange}
            value={data.email}
            name="email"
            type="email"
          />
          <TextField
            onInput={handleChange}
            value={data.password}
            name="password"
            type="password"
          />
        </>
      }
      actions={
        <>
          <Button variant="contained" onClick={handleSubmit}>
            Login
          </Button>
          <Link to="/register">
            <Button>Register</Button>
          </Link>
        </>
      }
    />
  )
}
