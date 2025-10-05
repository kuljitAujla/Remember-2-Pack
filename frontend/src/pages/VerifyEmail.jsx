import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/auth.css';

export default function VerifyEmail() {

  const [formData, setFormData] = useState({
    otp: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const sendOtp = async () => {
      try {
        await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-verify-otp`, {
          method: 'POST',
          credentials: 'include'
        });
      } catch (error) {
        console.log('error sending verification OTP: ', error)
      }
    };
    
    sendOtp();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //inline messages for validation
    if (!formData.otp) {
      setMessage('OTP Required')
      return;
    }

    setLoading(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/verify-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          otp: formData.otp,
        })
      });

      const data = await response.json();

      if (data.success) {

        setMessage('Account verified successfully! Redirecting to dashboard...');
        setTimeout(() => {
          navigate('/app');
        }, 1500);
      } else {
        setMessage(data.message || "Error, please retry");
      }

    } catch (error) {
      console.log('login error:', error);
      setMessage('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleResendOTP = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/send-verify-otp`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setMessage('OTP sent to email successfully');
      } else {
        setMessage(data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.log('error sending verification OTP: ', error);
      setMessage('Network error. Please check your connection and try again.');
    }
  }

  return (
    <div className="auth-page">
          <div className="auth-container">
            <div className="auth-header">
              <div className="auth-logo">R2P</div>
              <h1 className="auth-title">Email Verification</h1>
              <p className="auth-subtitle">Please enter the OTP sent to the email you signed up with</p>
            </div>
    
            {message && (
              <div className={`auth-message ${message.includes('successful') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
    
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="otp" className="form-label">Email Address</label>
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
    
    
              <button 
                type="submit" 
                className={`auth-button ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </form>

            <div className="auth-link" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="/">← Back to Home</Link>
              <button 
                onClick={handleResendOTP}
                className="auth-button secondary"
                style={{ padding: '8px 16px', fontSize: '14px', minWidth: 'auto', maxWidth: '50%', marginTop: '0px' }}
              >
                Resend OTP
              </button>
            </div>
          </div>
        </div>
  );
}
