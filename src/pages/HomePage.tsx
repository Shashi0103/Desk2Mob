import React from 'react';
import { Link } from 'react-router-dom';
import { Send, Download, Share2, Shield, Clock, QrCode, UserCheck, Database, Monitor, Laptop } from 'lucide-react';
import { GlassCard } from '../components/GlassCard';
import { Footer } from '../components/Footer';
import { NetworkStatus } from '../components/NetworkStatus';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <NetworkStatus />
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6 sticky top-0 z-50 bg-black py-4">
            <Share2 className="w-12 h-12 text-white mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Desk2Mob Share
            </h1>
          </div>
          <p className="text-white/90 text-xl md:text-2xl font-semibold mb-4">
            Transfer files: securely and quickly
          </p>
          <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto">
            Share files securely with unique codes and QR codes. Transfer files from PC to Phone and Phone to PC. No Registration Required.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <GlassCard>
            <div className="text-center">
              <Send className="w-16 h-16 text-blue-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Send Files</h2>
              <p className="text-white/70 mb-8">
                Upload a file and generate a secure code for sharing
              </p>
              <Link
                to="/send"
                className="inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Files
              </Link>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="text-center">
              <Download className="w-16 h-16 text-green-400 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-white mb-4">Receive Files</h2>
              <p className="text-white/70 mb-8">
                Enter a code or scan QR code to download files instantly
              </p>
              <Link
                to="/receive"
                className="inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
              >
                <Download className="w-5 h-5 mr-2" />
                Receive Files
              </Link>
            </div>
          </GlassCard>
        </div>

        <div className="mt-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Secure Sharing</h3>
              <p className="text-white/70 text-sm">Files protected with unique codes and automatic expiration</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <Clock className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Auto-Delete</h3>
              <p className="text-white/70 text-sm">Files automatically deleted after 10 minutes or download</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <QrCode className="w-8 h-8 text-purple-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">QR Code Support</h3>
              <p className="text-white/70 text-sm">Share files easily with generated QR codes</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <UserCheck className="w-8 h-8 text-orange-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">No Registration Required</h3>
              <p className="text-white/70 text-sm">Start sharing files instantly without creating an account</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <Database className="w-8 h-8 text-red-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Temporary Storage</h3>
              <p className="text-white/70 text-sm">Files stored temporarily for maximum privacy and security</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <Monitor className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">Platform Independent</h3>
              <p className="text-white/70 text-sm">Works seamlessly on PC, mobile, tablets, and all devices</p>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 text-center">
              <Laptop className="w-8 h-8 text-pink-400 mx-auto mb-3" />
              <h3 className="text-white font-semibold mb-2">OS Independent</h3>
              <p className="text-white/70 text-sm">Compatible with Windows, macOS, Android, iOS, and more</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-white/60">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              <span>Secure</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-400 rounded-full mr-2"></div>
              <span>Fast</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
              <span>Temporary</span>
            </div>
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};