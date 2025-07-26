import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './store/actions/userActions';

import Home from './components/Home/Home';
import Signup from './components/signup/Signup';
import UserProfile from './components/signup/UserProfile';
import Users from './components/signup/Users';
import NotFound from './components/common/NotFound';
import ProtectedRoute from './components/route/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import LinkedInCallback from './components/common/LinkedInCallback';
import OTPSetup from './components/common/OTPSetup';
import OAuthSuccess from './components/common/OAuthSuccess';
// import { LinkedInCallback } from 'react-linkedin-login-oauth2';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, user } = useSelector(state => state.auth);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      dispatch(loadUser());
      hasLoadedRef.current = true;
    }
  }, [dispatch]);

  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/linkedin" element={<LinkedInCallback />} />
        <Route path="/auth-app" element={<OTPSetup />} />
        <Route path="/success" element={<OAuthSuccess />} />

        <Route path="/user-profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

        {user?.role === 'admin' && (
          <Route path="/users" element={<ProtectedRoute isAdmin={true}><Users /></ProtectedRoute>} />

        )}

        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
