import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, User as UserIcon, ShieldCheck, Eye, EyeOff, ArrowLeft, ArrowRight, Sparkles, Chrome, AlertCircle, CheckCircle2, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Login = ({ onLoginSuccess }) => {
    const [mode, setMode] = useState('login'); // 'login', 'register', 'forgot', 'reset'
    const [formData, setFormData] = useState({ username: '', email: '', password: '', resetToken: '', newPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState({ show: false, message: '', type: '' }); // type: 'error' or 'success'

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: '' }), 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === 'login') {
                const { data } = await axios.post(`${API_BASE_URL}/users/login`, { email: formData.email, password: formData.password });
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                onLoginSuccess(data.user);
            } else if (mode === 'register') {
                await axios.post(`${API_BASE_URL}/users/`, { username: formData.username, email: formData.email, password: formData.password });
                setMode('login');
                showToast('Vault created! Please sign in.', 'success');
            } else if (mode === 'forgot') {
                const { data } = await axios.post(`${API_BASE_URL}/users/forgot-password`, { email: formData.email });
                showToast(data.message, 'success');
                setMode('reset');

            } else if (mode === 'reset') {
                await axios.post(`${API_BASE_URL}/users/reset-password`, {
                    email: formData.email,
                    resetToken: formData.resetToken,
                    newPassword: formData.newPassword
                });
                setMode('login');
                showToast('Vault updated! Sign in now.', 'success');
            }
        } catch (err) {
            showToast(err.response?.data?.error || 'Vault Access Denied', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper animate-fade">
            {/* AUTHENTICATION TOP TEXT */}
            <div className="auth-nav-top">
                <div className="back-btn">
                    <ArrowLeft size={18} />
                </div>
                {/* <span>Authentication</span> */}
                <div style={{ width: 38 }}></div> {/* Spacing spacer for centering */}
            </div>

            {/* Main Branding */}
            <div className="auth-branding">
                <div className="branding-logo">
                    <Sparkles size={32} color="white" />
                </div>
                <h1 className="branding-title">InstaVibe</h1>
                <p className="branding-subtitle">Private. Sophisticated. Yours.</p>
            </div>

            {/* Main Auth Card */}
            <div className="auth-card-v3">
                {/* Card Tabs - Only show for login/register modes */}
                {(mode === 'login' || mode === 'register') && (
                    <div className="auth-tabs-v3">
                        <div
                            className={`tab-v3 ${mode === 'login' ? 'active' : ''}`}
                            onClick={() => setMode('login')}
                        >
                            Login
                        </div>
                        <div
                            className={`tab-v3 ${mode === 'register' ? 'active' : ''}`}
                            onClick={() => setMode('register')}
                        >
                            Register
                        </div>
                        <div className="tab-indicator" style={{ transform: `translateX(${mode === 'login' ? '0' : '100'}%)` }}></div>
                    </div>
                )}

                <div className="auth-form-body">
                    <form onSubmit={handleSubmit}>
                        {/* REGISTER FIELDS */}
                        {mode === 'register' && (
                            <div className="input-group-v3">
                                <label className="input-label-v3">Identity</label>
                                <div className="input-container-v3">
                                    <UserIcon className="input-icon-v3" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Create a screen name"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {/* EMAIL / IDENTITY FIELD (Show in Reset mode as well, but labeled) */}
                        <div className="input-group-v3">
                            <label className="input-label-v3">
                                {mode === 'reset' ? 'Account Registry' : 'Identity'}
                            </label>
                            <div className={`input-container-v3 ${mode === 'reset' ? 'opacity-50 pointer-events-none' : ''}`}>
                                <Mail className="input-icon-v3" size={18} />
                                <input
                                    type="text"
                                    placeholder="@ Username or Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    readOnly={mode === 'reset'}
                                />
                            </div>
                        </div>

                        {/* PASSWORD FIELD */}
                        {(mode === 'login' || mode === 'register') && (
                            <div className="input-group-v3">
                                <label className="input-label-v3">Security</label>
                                <div className="input-container-v3">
                                    <Lock className="input-icon-v3" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter Secret Key"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                    />
                                    <div
                                        className="input-eye-v3"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* RESET PASSWORD FIELDS */}
                        {mode === 'reset' && (
                            <>
                                <div className="input-group-v3">
                                    <label className="input-label-v3">Reset Code</label>
                                    <div className="input-container-v3">
                                        <ShieldCheck className="input-icon-v3" size={18} />
                                        <input
                                            type="text"
                                            placeholder="Enter Vault Code"
                                            value={formData.resetToken}
                                            onChange={(e) => setFormData({ ...formData, resetToken: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="input-group-v3">
                                    <label className="input-label-v3">New Security Key</label>
                                    <div className="input-container-v3">
                                        <Lock className="input-icon-v3" size={18} />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.newPassword}
                                            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* HELPERS ROW (Login Only) */}
                        {mode === 'login' && (
                            <div className="form-helpers">
                                <label className="checkbox-row">
                                    <input type="checkbox" style={{ accentColor: 'var(--primary)' }} />
                                    Remember me
                                </label>
                                <span className="forgot-link" onClick={() => setMode('forgot')}>Forgot Access?</span>
                            </div>
                        )}

                        {/* SUBMIT BUTTON */}
                        <button type="submit" className="submit-btn-v3" disabled={loading}>
                            {loading ? 'Validating Vault...' : (
                                <>
                                    {mode === 'login' ? 'Sign In' : mode === 'register' ? 'Sign Up' : mode === 'forgot' ? 'Get Reset Link' : 'Secure Vault'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Back to login for forgot/reset modes */}
                    {(mode === 'forgot' || mode === 'reset') && (
                        <div className="auth-footer-v3" style={{ marginTop: '20px' }}>
                            Remembered? <span className="footer-highlight" onClick={() => setMode('login')}>Sign In</span>
                        </div>
                    )}

                    {/* DIVIDER */}
                    <div className="divider-v3">Secure Vault</div>

                    {/* SOCIAL BUTTONS */}
                    <div className="social-row-v3">
                        <div className="social-btn-v3">
                            <div style={{ width: 16, height: 16, background: 'white', borderRadius: '4px' }}></div>
                            Apple
                        </div>
                        <div className="social-btn-v3">
                            <Chrome size={18} color="#4285F4" />
                            Google
                        </div>
                    </div>
                </div>
            </div>

            {/* FOOTER LINK */}
            <div className="auth-footer-v3">
                New to the scene? <span className="footer-highlight" onClick={() => setMode('register')}>Create an Invite</span>
            </div>

            {/* Premium Toast Notification Popup */}
            {toast.show && (
                <div className={`vault-toast toast-${toast.type} animate-fade`}>
                    {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                    <span style={{ flex: 1 }}>{toast.message}</span>
                    <X size={16} className="cursor-pointer" style={{ opacity: 0.5 }} onClick={() => setToast({ ...toast, show: false })} />
                </div>
            )}
        </div>
    );
};

export default Login;
