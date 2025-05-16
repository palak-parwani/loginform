import React from "react";
import LoginForm2 from "./components/LoginForm2";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  return (
    <GoogleOAuthProvider
      clientId="291233503922-f7d9126a3a6d0i2khj9977mie3mfdod4.apps.googleusercontent.com"
    >
      <LoginForm2 />
    </GoogleOAuthProvider>
  );
}

export default App;
