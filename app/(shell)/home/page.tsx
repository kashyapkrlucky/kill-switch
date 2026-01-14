import { Button } from "@/components/ui/Button";
import { ButtonOutline } from "@/components/ui/ButtonOutline";
import PageLink from "@/components/ui/PageLink";
import { Flag, FolderOpen, Shield, Zap, ChevronRight, CheckCircle, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2 mb-6">
            <Zap className="w-4 h-4 text-emerald-500" />
            <span className="text-emerald-400 text-sm font-medium">Powerful Feature Flag Management</span>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Control Your Features
            <span className="text-emerald-500"> With Confidence</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Manage feature flags across all your projects with our intuitive dashboard. 
            Deploy safely, test confidently, and control features in real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-4 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Button>
            <ButtonOutline 
              size="lg" 
              className="border-slate-600 text-gray-300 hover:bg-slate-800 hover:text-white px-8 py-4 rounded-xl transition-all duration-200"
            >
              View Documentation
            </ButtonOutline>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Everything You Need to Manage Features</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful tools designed for modern development teams
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-slate-600 transition-all duration-200">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-6">
                <Flag className="w-6 h-6 text-emerald-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Feature Flags</h3>
              <p className="text-gray-400 mb-4">
                Create and manage feature flags across all your projects with real-time control.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Real-time toggling</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Environment-specific</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Audit logs</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-slate-600 transition-all duration-200">
              <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-6">
                <FolderOpen className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Project Management</h3>
              <p className="text-gray-400 mb-4">
                Organize your feature flags by projects with team collaboration features.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Team collaboration</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Role-based access</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Project analytics</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-slate-600 transition-all duration-200">
              <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Enterprise Security</h3>
              <p className="text-gray-400 mb-4">
                Bank-level security with SOC 2 compliance and advanced encryption.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">End-to-end encryption</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">SSO integration</span>
                </li>
                <li className="flex items-center gap-2 text-gray-300">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm">Audit trails</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-500/30 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Take Control of Your Features?
            </h2>
            <p className="text-gray-300 mb-8 text-lg">
              Join thousands of teams who trust Kill Switch for their feature flag management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-8 py-4 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
              >
                Start Free Trial
                <ChevronRight className="w-5 h-5" />
              </Button>
              <ButtonOutline 
                size="lg" 
                className="border-slate-600 text-gray-300 hover:bg-slate-800 hover:text-white px-8 py-4 rounded-xl transition-all duration-200"
              >
                Schedule Demo
              </ButtonOutline>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Kill Switch</span>
            </div>
            <div className="flex items-center gap-6">
              <PageLink href="/projects" className="text-gray-400 hover:text-white transition-colors">
                Projects
              </PageLink>
              <PageLink href="/flags" className="text-gray-400 hover:text-white transition-colors">
                Feature Flags
              </PageLink>
              <span className="text-gray-400">© 2024 Kill Switch. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
