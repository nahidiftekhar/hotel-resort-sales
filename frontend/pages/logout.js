import { Container } from "react-bootstrap";
import { PropagateLoader } from "react-spinners";
import logoutApi from "./api/logoutApi"

function logout() {
  const handleLogout = async () => {
    const result = await logoutApi();
    // if(result.logoutStatus && typeof window !== 'undefined') window.location.href = "/login";
  }
  handleLogout();

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-70">
      <PropagateLoader color="#0860ae" size={10} />
    </Container>
  )
}

export default logout