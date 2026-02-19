import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const authContext = useContext(AuthContext);
    const { register, error, clearErrors, isAuthenticated } = authContext;
    const navigate = useNavigate();

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const { firstName, lastName, email, phone, password, confirmPassword } = user;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
        } else {
            register({ firstName, lastName, email, phone, password });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form" style={{ maxWidth: '500px' }}>
                <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: '2rem' }}>Sign Up</h1>
                <form onSubmit={onSubmit}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input type="text" name="firstName" value={firstName} onChange={onChange} className="auth-input" placeholder="First Name" required />
                        <input type="text" name="lastName" value={lastName} onChange={onChange} className="auth-input" placeholder="Last Name" required />
                    </div>
                    <input type="email" name="email" value={email} onChange={onChange} className="auth-input" placeholder="Email Address" required />
                    <input type="text" name="phone" value={phone} onChange={onChange} className="auth-input" placeholder="Phone Number" required />
                    <input type="password" name="password" value={password} onChange={onChange} className="auth-input" placeholder="Password (6+ characters)" minLength="6" required />
                    <input type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} className="auth-input" placeholder="Confirm Password" minLength="6" required />

                    <input type="submit" value="Register" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem', marginTop: '1rem' }} />
                </form>
                <div style={{ color: '#8c8c8c', marginTop: '2rem' }}>
                    Already have an account? <Link to="/login" style={{ color: '#fff' }}>Sign in now</Link>.
                </div>
            </div>
        </div>
    );
};

export default Register;
