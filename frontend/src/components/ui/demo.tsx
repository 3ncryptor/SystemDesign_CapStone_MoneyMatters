"use client";

import React, { useState, useEffect } from "react";
import { Globe, Mail, MessageCircle, Share2 } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import axios from 'axios';

export default function AuthSwitch() {
  const location = useLocation();
  const [isSignUp, setIsSignUp] = useState(location.pathname === '/register');

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const container = document.querySelector(".auth-container");
    if (!container) return;
    if (isSignUp) {
        container.classList.add("sign-up-mode");
        navigate('/register', { replace: true });
    } else {
        container.classList.remove("sign-up-mode");
        if (location.pathname === '/register') {
            navigate('/login', { replace: true });
        }
    }
  }, [isSignUp, navigate, location.pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/login', { email: loginEmail, password: loginPassword });
      const payload = response.data?.data;
      const token = payload?.token ?? response.data?.token;
      const userData = payload?.user ?? response.data?.data;

      if (!token || !userData) throw new Error('Invalid login response from server');

      login(token, { id: userData._id, name: userData.name, email: userData.email });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
      setError(message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await api.post('/auth/register', { name: regName, email: regEmail, password: regPassword });
      setIsSignUp(false);
      setError('');
      alert("Registration successful! Please log in.");
    } catch (err) {
      const message = axios.isAxiosError(err) ? err.response?.data?.message : undefined;
      setError(message || 'Failed to register. Email might already be in use.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .auth-wrapper {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
          width: 100vw;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }

        .auth-container {
          position: relative;
          width: 100%;
          height: 100%;
          background: white;
          border-radius: 0;
          box-shadow: none;
          overflow: hidden;
        }

        .auth-container .forms-container {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }

        .auth-container .signin-signup {
          position: absolute;
          top: 50%;
          transform: translate(-50%, -50%);
          left: 75%;
          width: 50%;
          transition: 1s 0.7s ease-in-out;
          display: grid;
          grid-template-columns: 1fr;
          z-index: 5;
        }

        .auth-container form {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 0 5rem;
          transition: all 0.2s 0.7s;
          overflow: hidden;
          grid-column: 1 / 2;
          grid-row: 1 / 2;
        }

        .auth-container form.sign-up-form {
          opacity: 0;
          z-index: 1;
        }

        .auth-container form.sign-in-form {
          z-index: 2;
        }

        .auth-container .title {
          font-size: 2.2rem;
          color: #111;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .auth-container .input-field {
          max-width: 380px;
          width: 100%;
          background-color: #f0f0f0;
          margin: 10px 0;
          height: 55px;
          border-radius: 55px;
          display: grid;
          grid-template-columns: 15% 85%;
          padding: 0 0.4rem;
          position: relative;
          transition: 0.3s;
        }

        .auth-container .input-field:focus-within {
          background-color: #e8e8e8;
          box-shadow: 0 0 0 2px #111;
        }

        .auth-container .input-field i {
          text-align: center;
          line-height: 55px;
          color: #666;
          transition: 0.5s;
          font-size: 1.1rem;
        }

        .auth-container .input-field input {
          background: none;
          outline: none;
          border: none;
          line-height: 1;
          font-weight: 500;
          font-size: 1rem;
          color: #333;
          width: 100%;
        }

        .auth-container .input-field input::placeholder {
          color: #aaa;
          font-weight: 400;
        }

        .auth-container .btn {
          width: 150px;
          background-color: #111;
          border: none;
          outline: none;
          height: 49px;
          border-radius: 49px;
          color: #fff;
          text-transform: uppercase;
          font-weight: 600;
          margin: 10px 0;
          cursor: pointer;
          transition: 0.5s;
          font-size: 0.9rem;
        }

        .auth-container .btn:hover {
          background-color: #333;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
        }

        .auth-container .btn:disabled {
          background-color: #a0aec0;
          cursor: not-allowed;
        }

        .auth-container .panels-container {
          position: absolute;
          height: 100%;
          width: 100%;
          top: 0;
          left: 0;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
        }

        .auth-container .panel {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-around;
          text-align: center;
          z-index: 6;
        }

        .auth-container .left-panel {
          pointer-events: all;
          padding: 3rem 17% 2rem 12%;
        }

        .auth-container .right-panel {
          pointer-events: none;
          padding: 3rem 12% 2rem 17%;
        }

        .auth-container .panel .content {
          color: #fff;
          transition: transform 0.9s ease-in-out;
          transition-delay: 0.6s;
        }

        .auth-container .panel h3 {
          font-weight: 600;
          line-height: 1;
          font-size: 1.5rem;
          margin-bottom: 10px;
        }

        .auth-container .panel p {
          font-size: 0.95rem;
          padding: 0.7rem 0;
          color: #fff;
        }

        .auth-container .btn.transparent {
          margin: 0;
          background: none;
          border: 2px solid #fff;
          width: 130px;
          height: 41px;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .auth-container .btn.transparent:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .auth-container .right-panel .content {
          transform: translateX(800px);
        }

        .auth-container.sign-up-mode:before {
          transform: translate(100%, -50%);
          right: 52%;
        }

        .auth-container.sign-up-mode .left-panel .content {
          transform: translateX(-800px);
        }

        .auth-container.sign-up-mode .signin-signup {
          left: 25%;
        }

        .auth-container.sign-up-mode form.sign-up-form {
          opacity: 1;
          z-index: 2;
        }

        .auth-container.sign-up-mode form.sign-in-form {
          opacity: 0;
          z-index: 1;
        }

        .auth-container.sign-up-mode .right-panel .content {
          transform: translateX(0%);
        }

        .auth-container.sign-up-mode .left-panel {
          pointer-events: none;
        }

        .auth-container.sign-up-mode .right-panel {
          pointer-events: all;
        }

        .auth-container:before {
          content: "";
          position: absolute;
          height: 2000px;
          width: 2000px;
          top: -10%;
          right: 48%;
          transform: translateY(-50%);
          background: linear-gradient(-45deg, #1a1a1a 0%, #000000 100%);
          transition: 1.8s ease-in-out;
          border-radius: 50%;
          z-index: 6;
        }

        .auth-container .social-text {
          padding: 0.7rem 0;
          font-size: 1rem;
          color: #666;
        }

        .auth-container .social-media {
          display: flex;
          justify-content: center;
          gap: 15px;
        }

        .auth-container .social-icon {
          height: 46px;
          width: 46px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #ddd;
          border-radius: 50%;
          color: #111;
          font-size: 1.2rem;
          transition: 0.3s;
          cursor: pointer;
          text-decoration: none;
        }

        .auth-container .social-icon:hover {
          border-color: #000;
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .auth-container .social-icon svg {
          transition: 0.3s;
        }

        .auth-error {
            color: #ef4444;
            font-size: 0.875rem;
            margin-bottom: 10px;
            text-align: center;
            background: #fee2e2;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            width: 100%;
            max-width: 380px;
        }

        @media (max-width: 870px) {
          .auth-container {
            min-height: 800px;
            height: 100vh;
          }
          .auth-container .signin-signup {
            width: 100%;
            top: 95%;
            transform: translate(-50%, -100%);
            transition: 1s 0.8s ease-in-out;
          }
          .auth-container .signin-signup,
          .auth-container.sign-up-mode .signin-signup {
            left: 50%;
          }
          .auth-container .panels-container {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 2fr 1fr;
          }
          .auth-container .panel {
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            padding: 2.5rem 8%;
            grid-column: 1 / 2;
          }
          .auth-container .right-panel {
            grid-row: 3 / 4;
          }
          .auth-container .left-panel {
            grid-row: 1 / 2;
          }
          .auth-container .panel .content {
            padding-right: 15%;
            transition: transform 0.9s ease-in-out;
            transition-delay: 0.8s;
          }
          .auth-container .panel h3 {
            font-size: 1.2rem;
          }
          .auth-container .panel p {
            font-size: 0.7rem;
            padding: 0.5rem 0;
          }
          .auth-container .btn.transparent {
            width: 110px;
            height: 35px;
            font-size: 0.7rem;
          }
          .auth-container:before {
            width: 1500px;
            height: 1500px;
            transform: translateX(-50%);
            left: 30%;
            bottom: 68%;
            right: initial;
            top: initial;
            transition: 2s ease-in-out;
          }
          .auth-container.sign-up-mode:before {
            transform: translate(-50%, 100%);
            bottom: 32%;
            right: initial;
          }
          .auth-container.sign-up-mode .left-panel .content {
            transform: translateY(-300px);
          }
          .auth-container.sign-up-mode .right-panel .content {
            transform: translateY(0px);
          }
          .auth-container .right-panel .content {
            transform: translateY(300px);
          }
          .auth-container.sign-up-mode .signin-signup {
            top: 5%;
            transform: translate(-50%, 0);
          }
        }

        @media (max-width: 570px) {
          .auth-container form {
            padding: 0 1.5rem;
          }
          .auth-container .panel .content {
            padding: 0.5rem 1rem;
          }
        }
      `}</style>

      <div className="auth-wrapper">
        <div className="auth-container">
          <div className="forms-container">
            <div className="signin-signup">
              {/* Sign In Form */}
              <form className="sign-in-form" onSubmit={handleLogin}>
                <h2 className="title">Sign in</h2>
                {error && !isSignUp && <div className="auth-error">{error}</div>}
                <div className="input-field">
                  <i>📧</i>
                  <input type="email" placeholder="Email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
                </div>
                <div className="input-field">
                  <i>🔒</i>
                  <input type="password" placeholder="Password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                </div>
                <input type="submit" value={isSubmitting ? "Logging in..." : "Login"} className="btn solid" disabled={isSubmitting} />
                <p className="social-text">Or sign in with social platforms</p>
                <div className="social-media">
                  <SocialIcons />
                </div>
              </form>

              {/* Sign Up Form */}
              <form className="sign-up-form" onSubmit={handleRegister}>
                <h2 className="title">Sign up</h2>
                {error && isSignUp && <div className="auth-error">{error}</div>}
                <div className="input-field">
                  <i>👤</i>
                  <input type="text" placeholder="Username" value={regName} onChange={e => setRegName(e.target.value)} required />
                </div>
                <div className="input-field">
                  <i>📧</i>
                  <input type="email" placeholder="Email" value={regEmail} onChange={e => setRegEmail(e.target.value)} required />
                </div>
                <div className="input-field">
                  <i>🔒</i>
                  <input type="password" placeholder="Password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required />
                </div>
                <input type="submit" value={isSubmitting ? "Signing up..." : "Sign up"} className="btn" disabled={isSubmitting} />
                <p className="social-text">Or sign up with social platforms</p>
                <div className="social-media">
                  <SocialIcons />
                </div>
              </form>
            </div>
          </div>

          <div className="panels-container">
            <div className="panel left-panel">
              <div className="content">
                <h3>New here?</h3>
                <p>Join us today and discover a world of possibilities. Create your account in seconds!</p>
                <button className="btn transparent" onClick={() => setIsSignUp(true)}>
                  Sign up
                </button>
              </div>
            </div>

            <div className="panel right-panel">
              <div className="content">
                <h3>One of us?</h3>
                <p>Welcome back! Sign in to continue your journey with us.</p>
                <button className="btn transparent" onClick={() => setIsSignUp(false)}>
                  Sign in
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SocialIcons() {
  return (
    <>
      <a href="#" className="social-icon">
        <Globe size={20} color="#111" />
      </a>
      <a href="#" className="social-icon">
        <MessageCircle size={20} color="#111" />
      </a>
      <a href="#" className="social-icon">
        <Share2 size={20} color="#111" />
      </a>
      <a href="#" className="social-icon">
        <Mail size={20} color="#111" />
      </a>
    </>
  );
}
