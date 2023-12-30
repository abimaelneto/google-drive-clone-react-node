import { Button, TextField } from '@mui/material'
import { Link } from 'react-router-dom'
import { AuthView } from '../../components/AuthView'

export const SignUp = () => {
  const handleSubmit = () => {
    console.log('submit')
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
