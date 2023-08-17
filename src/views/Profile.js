import React from "react";
import { Container, Row, Col, Button } from "reactstrap";

import Loading from "../components/Loading";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

const ProfileComponent = () => {
  const { user } = useAuth0();

  return (
    <Container className="mb-5">
      <h1 className="mb-5">Mi Perfil</h1> 
      <Row className="align-items-center profile-header mb-5 text-center text-md-left">
      
        <Col md="2">
          <img
            src={user.picture}
            alt="Profile"
            className="rounded-circle img-fluid profile-picture mb-3 mb-md-0"
          />
        </Col>
        <Col md>
          <h2>{user.name}</h2>
          <p className="lead text-muted">{user.email}</p>
        </Col>
      </Row>
      <Row>
      <pre className="p-3 bg-light">
        <code>
          
          <Button className="custom-button">
            <strong>Nombre:</strong>
          </Button>
          {user.given_name} 
          <br />

          <Button className="custom-button">
            <strong>Apellidos:</strong> 
          </Button>
          {user.family_name}
          <br />

          <Button className="custom-button">
            <strong>Correo electrónico:</strong> 
          </Button>
          {user.email}
          <br />

          <Button className="custom-button">
            <strong>Nickname:</strong> 
          </Button>
          {user.nickname}
          <br />

          <Button className="custom-button">
            <strong>Email verificado:</strong>{" "}
          </Button>
          {user.email_verified ? "Sí" : "No"}

        </code>
      </pre>
    </Row>
    </Container>
  );
};

export default withAuthenticationRequired(ProfileComponent, {
  onRedirecting: () => <Loading />,
});
