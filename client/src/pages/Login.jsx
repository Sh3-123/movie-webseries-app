import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const authContext = useContext(AuthContext);
    const { login, error, clearErrors, isAuthenticated } = authContext;
    const navigate = useNavigate();

    const [user, setUser] = useState({
        email: '',
        password: ''
    });

    const { email, password } = user;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        if (email === '' || password === '') {
            alert('Please fill in all fields');
        } else {
            login({ email, password });
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h1 style={{ color: '#fff', fontSize: '2rem', marginBottom: '2rem' }}>Sign In</h1>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={onChange}
                            className="auth-input"
                            placeholder="Email Address"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={onChange}
                            className="auth-input"
                            placeholder="Password"
                            required
                        />
                    </div>
                    <input type="submit" value="Sign In" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem', marginTop: '1rem' }} />
                </form>
                <div style={{ color: '#8c8c8c', marginTop: '2rem' }}>
                    New here? <Link to="/register" style={{ color: '#fff' }}>Sign up now</Link>.
                </div>
            </div>
        </div>
    );
};

export default Login;
