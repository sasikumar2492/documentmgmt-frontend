import React from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { FileText, HelpCircle, ArrowRight, ArrowLeft, Shield, Users, CheckCircle, UserCheck, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '../types';
import { authService } from '../services/authService';
import { showApiError } from '../utils/apiError';
import fedhubLogo from 'figma:asset/959a9d3635cfe8c94a3f28db7f3ab3925aae9843.png';

interface SignInPageProps {
  loginData: { username: string; password: string; rememberMe: boolean; role?: UserRole };
  onLoginDataChange: (data: { username: string; password: string; rememberMe: boolean; role?: UserRole }) => void;
  // onSignIn can receive optional credentials to avoid relying on parent state update timing
  onSignIn: (e?: React.FormEvent, creds?: { username: string; password: string; rememberMe: boolean }) => void;
  onBackToHome?: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ loginData, onLoginDataChange, onSignIn, onBackToHome }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [rememberPassword, setRememberPassword] = React.useState(false);
  const [showForgotPasswordDialog, setShowForgotPasswordDialog] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState('');

  // No demo accounts: use the entered email/password to sign in.

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    // Use entered email as username for the login flow and call parent sign-in with credentials
    const creds = { username: email, password, rememberMe: rememberPassword };
    onLoginDataChange({
      ...loginData,
      ...creds
    });
    // pass credentials directly to avoid waiting for parent's state update
    onSignIn?.(e, creds);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;
    try {
      await authService.forgotPassword(resetEmail);
      alert(`Password reset link sent to ${resetEmail}`);
      setShowForgotPasswordDialog(false);
      setResetEmail('');
    } catch (err: any) {
      console.error('Forgot password failed', err);
      showApiError(err, { defaultMessage: 'Failed to send reset link' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl flex gap-12 items-center">
          {/* Left Side - Branding & Features */}
          <div className="flex-1 space-y-8">
            {/* Logo */}
            <div className="inline-flex items-center gap-3 bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">DMS Portal</span>
            </div>

            {/* Title */}
            <div className="space-y-3">
              <h1 className="text-5xl font-bold text-slate-900 leading-tight">
                Document Management
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed max-w-md">
                Streamline your approval workflows, track document status, and maintain compliance with intelligent document management and automated routing.
              </p>
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              {/* Approval Workflow */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <div className="text-2xl">✅</div>
                </div>
                <h3 className="text-slate-900 font-semibold mb-1">Approval Workflow</h3>
                <p className="text-slate-500 text-sm">Multi-level reviews</p>
              </div>

              {/* Document Library */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <div className="text-2xl">📂</div>
                </div>
                <h3 className="text-slate-900 font-semibold mb-1">Document Library</h3>
                <p className="text-slate-500 text-sm">Organized storage</p>
              </div>

              {/* Role-Based Access */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <div className="text-2xl">👥</div>
                </div>
                <h3 className="text-slate-900 font-semibold mb-1">Role-Based Access</h3>
                <p className="text-slate-500 text-sm">4 user roles</p>
              </div>

              {/* Reports & Stats */}
              <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group">
                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <div className="text-2xl">📊</div>
                </div>
                <h3 className="text-slate-900 font-semibold mb-1">Reports & Stats</h3>
                <p className="text-slate-500 text-sm">Real-time tracking</p>
              </div>
            </div>
          </div>

          {/* Right Side - Login Card */}
          <div className="w-full max-w-md space-y-6">
            {/* Login Card */}
            <Card className="shadow-2xl border-0 bg-white">
              <CardHeader className="space-y-1 pb-6">
                <CardTitle className="text-2xl text-slate-900">Welcome Back</CardTitle>
                <CardDescription className="text-slate-600">
                  Sign in to access your dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email & Password Login Form */}
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700 font-medium">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700 font-medium">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-11 pr-11 h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Password & Forgot Password */}
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="remember"
                        checked={rememberPassword}
                        onCheckedChange={(checked) => setRememberPassword(checked as boolean)}
                      />
                      <Label 
                        htmlFor="remember" 
                        className="text-sm text-slate-600 cursor-pointer font-normal"
                      >
                        Remember password
                      </Label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordDialog(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Sign In Button */}
                  <Button 
                    type="submit" 
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-blue-500/30 transition-all"
                  >
                    Sign In
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>

                {/* Demo block removed - form submits entered credentials on submit */}
              </CardContent>
            </Card>

            {/* Footer */}
            <p className="text-center text-xs text-slate-500">
              Version 1.0.0 • Powered by FEDHUB Software
            </p>
          </div>
        </div>
      </div>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full flex items-center justify-center shadow-lg transition-all hover:shadow-blue-500/50">
        <HelpCircle className="w-6 h-6 text-white" />
      </button>

      {/* Forgot Password Dialog */}
      {showForgotPasswordDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-800">Reset Password</CardTitle>
              <CardDescription className="text-slate-500">
                Enter your email address and we'll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-slate-700 font-medium">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="Enter your email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="pl-11 h-11 border-slate-300 focus:border-indigo-500 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    onClick={() => {
                      setShowForgotPasswordDialog(false);
                      setResetEmail('');
                    }}
                    className="flex-1 h-11 bg-slate-200 text-slate-700 hover:bg-slate-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-11 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white shadow-lg"
                  >
                    Send Reset Link
                  </Button>
                </div>
              </form>

              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-xs text-blue-800">
                  <strong>Demo Mode:</strong> In production, this would send a password reset email to your registered email address.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};