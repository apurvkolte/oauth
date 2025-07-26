// src/pages/OAuthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const OAuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('token');

    if (token) {
      localStorage.setItem('token', token);
      // You can optionally decode the token or fetch user info
      navigate('/'); // Redirect to homepage or dashboard
    } else {
      navigate('/signup'); // Or handle auth error
    }
  }, [navigate]);

  return <p>Logging you in via OAuth...</p>;
};

export default OAuthSuccess;
