import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/auth.css';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP + new password
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0); // 1.5 minutes in seconds

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    // Prevent resend if cooldown is active (only when resending from step 2)
    if (step === 2 && resendCooldown > 0) {
      return;
    }
    
    // Inline validation
    if (!formData.email.trim()) {
      setMessage('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage('Email is invalid');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-reset-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('OTP sent to your email! Check your inbox and spam folder.');
        setStep(2);
        setResendCooldown(90); // Start 1.5 minute cooldown
      } else {
        setMessage(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    // Inline validation
    if (!formData.otp.trim()) {
      setMessage('OTP is required');
      return;
    }
    if (formData.otp.length !== 6) {
      setMessage('OTP must be 6 digits');
      return;
    }
    if (!formData.newPassword) {
      setMessage('New password is required');
      return;
    }
    if (formData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }
    if (!formData.confirmPassword) {
      setMessage('Please confirm your password');
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
          newPassword: formData.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setMessage(data.message || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-logo">R2P</div>
          <h1 className="auth-title">
            {step === 1 ? 'Reset Password' : 'Enter OTP & New Password'}
          </h1>
          <p className="auth-subtitle">
            {step === 1 
              ? 'Enter your email address and we\'ll send you an OTP to reset your password'
              : 'Enter the 6-digit OTP sent to your email and your new password'
            }
          </p>
        </div>

        {message && (
          <div className={`auth-message ${message.includes('successfully') || message.includes('sent') || message.includes('looks good') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="auth-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your email address"
              />
            </div>

            <button 
              type="submit" 
              className={`auth-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="auth-form">
            <div className="form-group">
              <label htmlFor="otp" className="form-label">6-Digit OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={formData.otp}
                onChange={handleChange}
                className="form-input"
                placeholder="OTP"
                maxLength="6"
                style={{ textAlign: 'center', letterSpacing: '0.5rem' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword" className="form-label">New Password</label>
              <div className="password-toggle">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter new password"
                />
                <span 
                  className="password-toggle-icon"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
              <div className="password-toggle">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Confirm new password"
                />
                <span 
                  className="password-toggle-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              className={`auth-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="auth-link">
          {step === 1 ? (
            <>
              Remember your password? <Link to="/login">Sign in</Link>
            </>
          ) : (
            <>
              Didn't receive the OTP? <button 
                type="button" 
                onClick={() => handleSendOTP({ preventDefault: () => {} })}
                disabled={resendCooldown > 0}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: resendCooldown > 0 ? '#999' : '#5170ff', 
                  textDecoration: 'none', 
                  fontWeight: '600', 
                  cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                  fontSize: 'inherit',
                  opacity: resendCooldown > 0 ? 0.6 : 1
                }}
              >
                {resendCooldown > 0 ? `Resend OTP (${formatTime(resendCooldown)})` : 'Resend OTP'}
              </button>
            </>
          )}
        </div>
        
        <div className="auth-link">
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
