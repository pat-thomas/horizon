import Form from "react-bootstrap/form"
import { useState } from "react"

const handleFormChange = (e, setter) => {
  setter(e.target.value)
}

const Login = () => {
  const [emailInput, setEmailInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')
  return (
    <div className="login">
      <Form>
        <Form.Group>
          <Form.Label>Email:</Form.Label>
          <Form.Control type="text" onChange={(e) => handleFormChange(e, setEmailInput)} value={emailInput} />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password:</Form.Label>
          <Form.Control type="text" onChange={(e) => handleFormChange(e, setPasswordInput)} value={passwordInput} />
        </Form.Group>
      </Form>
    </div>
  )
}

export default Login
