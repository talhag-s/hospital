import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  AlertCircle, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  X,
  HeartPulse,
  ArrowRight
} from 'lucide-react';
import { validateEmailFormat, validatePassword, findUserByEmail, resetUserPassword } from '../utils/auth';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';

// Simple inline PasswordInput with toggle visibility
function PasswordInput({ id, label, value, onChange, onBlur, error, disabled, placeholder = "Enter your password" }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
        <input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete="current-password"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
            error ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
          } ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'bg-white text-slate-800'}`}
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
          tabIndex={-1}
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs font-medium text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{error}</p>}
    </div>
  );
}

export default function LoginForm({ selectedModule }) {
  const navigate = useNavigate();
  const { login, rememberedEmail } = useAuth();
  const { settings } = useData();

  const [email, setEmail]           = useState('admin@hospital.com');
  const [password, setPassword]     = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [formError, setFormError]   = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isLoading, setIsLoading]   = useState(false);

  // Forgot Password Modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: Code & New Pass, 3: Success
  const [resetEmail, setResetEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [generatedCode, setGeneratedCode] = useState('849201');
  const [forgotError, setForgotError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  useEffect(() => {
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, [rememberedEmail]);

  useEffect(() => {
    if (selectedModule) {
      const modLower = selectedModule.toLowerCase();
      if (modLower.includes('doctor')) {
        setEmail('amir@gmail.com');
        setPassword('password123');
      } else if (modLower.includes('reception')) {
        setEmail('reception@hospital.com');
        setPassword('password123');
      } else if (modLower.includes('nurse')) {
        setEmail('nurse@hospital.com');
        setPassword('password123');
      } else {
        setEmail('admin@hospital.com');
        setPassword('password123');
      }
    }
  }, [selectedModule]);

  const validateEmailField = (v) => {
    if (!v.trim()) return 'Email address is required.';
    if (!validateEmailFormat(v)) return 'Please enter a valid email address.';
    return '';
  };

  const validatePasswordField = (v) => {
    if (!v) return 'Password is required.';
    if (!validatePassword(v)) return 'Password must be at least 6 characters.';
    return '';
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setFormError('');
    setFormSuccess('');
    if (emailTouched) setEmailError(validateEmailField(e.target.value));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setFormError('');
    setFormSuccess('');
    if (passwordTouched) setPasswordError(validatePasswordField(e.target.value));
  };

  const handleOpenForgotModal = () => {
    setResetEmail(email || 'admin@hospital.com');
    setForgotStep(1);
    setForgotError('');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    setShowForgotModal(true);
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setForgotError('');

    if (!resetEmail.trim()) {
      setForgotError('Please enter your email address.');
      return;
    }
    if (!validateEmailFormat(resetEmail)) {
      setForgotError('Please enter a valid email format.');
      return;
    }

    setResetLoading(true);
    await new Promise(r => setTimeout(r, 600));

    const foundUser = findUserByEmail(resetEmail);
    if (!foundUser) {
      setForgotError(`No registered staff account found for "${resetEmail}". Please verify your email.`);
      setResetLoading(false);
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setResetCode(code);
    setForgotStep(2);
    setResetLoading(false);
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError('');

    if (!resetCode.trim()) {
      setForgotError('Please enter the 6-digit verification code.');
      return;
    }

    if (resetCode.trim() !== generatedCode) {
      setForgotError('Invalid verification code. Please check and try again.');
      return;
    }

    if (!newPassword) {
      setForgotError('Please enter a new password.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setForgotError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotError('Passwords do not match. Please verify your confirm password.');
      return;
    }

    setResetLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const ok = resetUserPassword(resetEmail, newPassword);
    setResetLoading(false);

    if (ok) {
      setForgotStep(3);
    } else {
      setForgotError('Failed to update password. Please try again.');
    }
  };

  const handleFinishReset = () => {
    setEmail(resetEmail);
    setPassword(newPassword);
    setShowForgotModal(false);
    setFormSuccess('Your password has been successfully reset! Click "Sign In" below to log in.');
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);
    const errEmail = validateEmailField(email);
    const errPass  = validatePasswordField(password);
    setEmailError(errEmail);
    setPasswordError(errPass);
    if (errEmail || errPass) return;

    setIsLoading(true);
    setFormError('');
    setFormSuccess('');
    try {
      const res = await login(email, password, rememberMe);
      if (res.success && res.targetPath) {
        navigate(res.targetPath);
      } else {
        setFormError(res.message || 'Invalid email or password. Please try again.');
      }
    } catch {
      setFormError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-[#002868] text-white p-6 text-center relative">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/90 flex items-center justify-center mx-auto mb-3 shadow-md border border-blue-400/30">
          <HeartPulse className="w-7 h-7 text-white stroke-[2.2]" />
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          {settings?.hospitalName || 'CityCare Hospital'}
        </h2>
        <p className="text-xs text-blue-200 font-medium mt-1">
          Staff Portal & Clinical System Sign In
        </p>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <form onSubmit={handleSubmit} noValidate autoComplete="off" className="space-y-4">
          {/* Form Success Alert */}
          {formSuccess && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-medium">{formSuccess}</span>
            </div>
          )}

          {/* Form Error Alert */}
          {formError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{formError}</span>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => { setEmailTouched(true); setEmailError(validateEmailField(email)); }}
                disabled={isLoading}
                placeholder="staff@hospital.com"
                className={`w-full pl-10 pr-3 py-2.5 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${
                  emailError ? 'border-red-400 bg-red-50/20' : 'border-slate-300'
                } ${isLoading ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'bg-white text-slate-800'}`}
              />
            </div>
            {emailError && (
              <p className="mt-1 text-xs font-medium text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {emailError}
              </p>
            )}
          </div>

          {/* Password Field */}
          <PasswordInput
            id="password"
            label="Password"
            value={password}
            onChange={handlePasswordChange}
            onBlur={() => { setPasswordTouched(true); setPasswordError(validatePasswordField(password)); }}
            error={passwordError}
            disabled={isLoading}
          />

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-600 hover:text-slate-900 select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                disabled={isLoading}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition-colors"
              />
              Remember my session
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#1A73E8] hover:bg-[#1557B0] active:scale-[0.99] text-white text-sm font-bold rounded-xl transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 mt-2"
          >
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* ── FORGOT PASSWORD MODAL ── */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowForgotModal(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* STEP 1: VERIFY EMAIL */}
            {forgotStep === 1 && (
              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                  <KeyRound className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Forgot Password?</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Enter your registered staff email address to receive a password reset verification code.
                  </p>
                </div>

                {forgotError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Staff Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => { setResetEmail(e.target.value); setForgotError(''); }}
                      placeholder="e.g. admin@hospital.com"
                      className="w-full pl-10 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 py-2.5 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    {resetLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      'Send Reset Code'
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: ENTER CODE & NEW PASSWORD */}
            {forgotStep === 2 && (
              <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100">
                  <ShieldCheck className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Set New Password</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Verification code sent for <span className="font-semibold text-slate-800">{resetEmail}</span>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-slate-500">Security Code:</span>{' '}
                    <strong className="font-mono text-sm tracking-widest text-blue-700">{generatedCode}</strong>
                  </div>
                  <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded font-bold">Auto Verified</span>
                </div>

                {forgotError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{forgotError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">6-Digit Code</label>
                  <input
                    type="text"
                    value={resetCode}
                    onChange={(e) => { setResetCode(e.target.value); setForgotError(''); }}
                    placeholder="Enter 6-digit code"
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <PasswordInput
                  id="newPassword"
                  label="New Password"
                  placeholder="Enter new password (min 6 chars)"
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setForgotError(''); }}
                  disabled={resetLoading}
                />

                <PasswordInput
                  id="confirmPassword"
                  label="Confirm New Password"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setForgotError(''); }}
                  disabled={resetLoading}
                />

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="py-2.5 px-4 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="flex-1 py-2.5 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 disabled:opacity-60"
                  >
                    {resetLoading ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Save New Password'
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: SUCCESS CONFIRMATION */}
            {forgotStep === 3 && (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Password Reset Successful!</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Your password for <strong className="text-slate-800">{resetEmail}</strong> has been updated.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleFinishReset}
                  className="w-full py-3 rounded-xl bg-[#1A73E8] hover:bg-[#1557B0] text-white font-bold text-sm transition-colors shadow-md shadow-blue-500/20"
                >
                  Continue to Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
