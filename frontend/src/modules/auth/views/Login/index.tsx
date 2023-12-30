import { Button, TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import { AuthView } from '../../components/AuthView'

export const Login = () => {
  const handleSubmit = () => {
    console.log('submit')
  }
  return (
    <AuthView
      form={
        <>
          <TextField name="email" type="email" />
          <TextField name="password" type="password" />
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
