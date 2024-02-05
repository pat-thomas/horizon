import {
  useNavigate
} from "react-router-dom"

const isAuthenticated = () => {
  return false
}

const redirectIfNotAuthenticated = () => {
  const navigate = useNavigate()
  if (!isAuthenticated()) {
    return navigate("/login")
  }
}

export {
  redirectIfNotAuthenticated
}
