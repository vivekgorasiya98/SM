// Login.js
import React, { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function Login({ setUser, setMessage, setFiles, backendURL }) {
  useEffect(() => {
    /* global google */
    window.google?.accounts.id.initialize({
      client_id: '396821862592-fuge0oq6pr40t3lc61ig80qcid7sm6iq.apps.googleusercontent.com',
      callback: handleGoogleLogin
    });

    window.google?.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "outline", size: "large" }
    );
  }, []);

  const handleGoogleLogin = async (response) => {
    const userObject = jwtDecode(response.credential);
    setUser(userObject);
    setMessage('✅ Logged in successfully.');

    try {
      const res = await fetch(`${backendURL}/files/`);
      const data = await res.json();
      if (data.status === 'success') setFiles(data.files);
    } catch (err) {
      console.error('Error fetching files:', err);
    }
  };

  return (
    <div>
      <h2>Login with Google</h2>
      <div id="googleSignInDiv"></div>
    </div>
  );
}
