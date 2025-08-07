import React, { useState } from 'react';
import ManualLogin from './ManualLogin';
import Register from './Register';
import ForgotPassword from './ForgotPassword';

export default function UManage({ backendURL, setUser }) {
  const [view, setView] = useState('login');

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}
    >
      <div
        className="card shadow-lg p-4 text-center"
        style={{ width: '420px', borderRadius: '12px' }}
      >
        {/* Logo & Heading */}
        <img
          src="/images/logo1.png"
          alt="Logo"
          style={{ width: '80px', marginBottom: '15px' }}
        />
        <h3 className="fw-bold text-dark mb-1">
          {view === 'login' && 'Login'}
          {view === 'register' && 'Create Account'}
          {view === 'forgot' && 'Reset Password'}
        </h3>
        <p className="text-muted mb-4" style={{ fontSize: '0.9rem' }}>
          {view === 'login' && 'Welcome back! Please login to continue.'}
          {view === 'register' && 'Join us by creating a new account.'}
          {view === 'forgot' && 'Enter your email to reset your password.'}
        </p>

        {/* Forms */}
        <div className="mb-3 text-start">
          {view === 'login' && <ManualLogin backendURL={backendURL} setUser={setUser} />}
          {view === 'register' && <Register backendURL={backendURL} setUser={setUser} />}
          {view === 'forgot' && <ForgotPassword backendURL={backendURL} />}
        </div>

        {/* Links */}
        <div className="mt-3">
          {view === 'login' && (
            <>
              <a
                href="#"
                className="d-block mb-1 text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setView('forgot');
                }}
              >
                Forgot Password?
              </a>
              <a
                href="#"
                className="d-block text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setView('register');
                }}
              >
                Create New Account
              </a>
            </>
          )}

          {view === 'register' && (
            <>
              <a
                href="#"
                className="d-block mb-1 text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setView('login');
                }}
              >
                Already have an account? Login
              </a>
              <a
                href="#"
                className="d-block text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setView('forgot');
                }}
              >
                Forgot Password?
              </a>
            </>
          )}

          {view === 'forgot' && (
            <>
              <a
                href="#"
                className="d-block mb-1 text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setView('login');
                }}
              >
                Back to Login
              </a>
              <a
                href="#"
                className="d-block text-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setView('register');
                }}
              >
                Create New Account
              </a>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
