import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Ticket, Mail, Lock, ArrowRight, Zap, BarChart3, Bell, GitBranch, ArrowLeft, Shield, FileText, CheckCircle, FolderOpen, Users, ShieldCheck, Target, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface TicketFlowLoginProps {
  onLogin: (username: string, password: string) => void;
  onBackToHome: () => void;
  moduleType?: 'ticketflow' | 'dms' | 'qms';
}

export const TicketFlowLogin: React.FC<TicketFlowLoginProps> = ({ onLogin, onBackToHome, moduleType = 'ticketflow' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  // Quick-login UI removed; login will call API with entered credentials

  // Module configurations
  const moduleConfig = {
    ticketflow: {
      icon: Shield,
      iconBg: 'from-yellow-400 to-amber-500',
      title: 'TicketFlow',
      heading: 'Modern Support',
      subheading: 'Ticketing System',
      description: 'Streamline your customer support with powerful ticket management, automated workflows, and insightful analytics.',
      features: [
        { icon: GitBranch, iconBg: 'bg-pink-500/20', iconColor: 'text-pink-400', title: 'Smart Routing', desc: 'Auto-assign tickets' },
        { icon: Zap, iconBg: 'bg-orange-500/20', iconColor: 'text-orange-400', title: 'Fast Response', desc: 'SLA tracking' },
        { icon: BarChart3, iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400', title: 'Analytics', desc: 'Real-time insights' },
        { icon: Bell, iconBg: 'bg-yellow-500/20', iconColor: 'text-yellow-400', title: 'Notifications', desc: 'Stay updated' }
      ],
      copyright: '© 2024 TicketFlow. All rights reserved.'
    },
    dms: {
      icon: FileText,
      iconBg: 'from-blue-500 to-cyan-500',
      title: 'Document Management',
      heading: 'Document Management',
      subheading: 'System',
      description: 'Streamline approval workflows, track document status, and maintain compliance with intelligent document management and automated routing.',
      features: [
        { icon: CheckCircle, iconBg: 'bg-green-500/20', iconColor: 'text-green-400', title: 'Approval Workflow', desc: 'Multi-level reviews' },
        { icon: FolderOpen, iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400', title: 'Document Library', desc: 'Organized storage' },
        { icon: Users, iconBg: 'bg-purple-500/20', iconColor: 'text-purple-400', title: 'Role-Based Access', desc: '4 user roles' },
        { icon: BarChart3, iconBg: 'bg-cyan-500/20', iconColor: 'text-cyan-400', title: 'Reports & Stats', desc: 'Real-time tracking' }
      ],
      copyright: '© 2024 Document Management System. All rights reserved.'
    },
    qms: {
      icon: ShieldCheck,
      iconBg: 'from-green-500 to-emerald-500',
      title: 'QualityFlow',
      heading: 'Quality Management',
      subheading: 'System',
      description: 'Ensure quality control with automated inspection, compliance tracking, and continuous improvement tools for operational excellence.',
      features: [
        { icon: ShieldCheck, iconBg: 'bg-green-500/20', iconColor: 'text-green-400', title: 'Quality Assurance', desc: 'Compliance tracking' },
        { icon: Target, iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400', title: 'Process Control', desc: 'Standard procedures' },
        { icon: TrendingUp, iconBg: 'bg-purple-500/20', iconColor: 'text-purple-400', title: 'Continuous Improvement', desc: 'Performance metrics' },
        { icon: BarChart3, iconBg: 'bg-cyan-500/20', iconColor: 'text-cyan-400', title: 'Analytics & Reports', desc: 'Real-time insights' }
      ],
      copyright: '© 2024 QualityFlow QMS. All rights reserved.'
    }
  };

  const config = moduleConfig[moduleType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-white space-y-6 lg:pr-12"
        >
          <div className="space-y-4">
            <div className="inline-block">
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl px-6 py-3 shadow-sm">
                <div className={`w-10 h-10 bg-gradient-to-br ${config.iconBg} rounded-lg flex items-center justify-center shadow-md`}>
                  <config.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-slate-900">{config.title}</span>
              </div>
            </div>
            <h1 className="text-5xl font-bold leading-tight text-slate-900">
              {config.heading}
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
                {config.subheading}
              </span>
            </h1>
            <p className="text-lg text-slate-700">
              {config.description}
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            {config.features.map((feature, index) => (
              <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800/70 transition-all">
                <div className={`w-10 h-10 ${feature.iconBg} rounded-lg flex items-center justify-center mb-3`}>
                  <feature.icon className={`h-5 w-5 ${feature.iconColor}`} />
                </div>
                <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                <p className="text-slate-300 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="relative z-10 text-slate-400 text-sm">
            {config.copyright}
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <div className="w-full">
          <div className="w-full max-w-md mx-auto">
            {/* Back to Home Button - Visible on all screens */}
            <div className="mb-6">
              <Button
                onClick={onBackToHome}
                variant="outline"
                className="gap-2 bg-white/95 text-slate-700 border-slate-300 hover:bg-white hover:text-slate-900 hover:border-slate-400 shadow-md hover:shadow-lg transition-all font-medium"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
                <p className="text-slate-600">Sign in to access your dashboard</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 text-sm font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-slate-50 border-slate-200 focus:border-purple-500 focus:ring-purple-500 h-12"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-slate-700 text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-slate-50 border-slate-200 focus:border-purple-500 focus:ring-purple-500 h-12"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium gap-2 shadow-lg shadow-purple-600/30 hover:shadow-xl hover:shadow-purple-600/40 transition-all"
                >
                  Sign In
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Quick-login removed */}
          </div>
        </div>
      </div>
    </div>
  );
};