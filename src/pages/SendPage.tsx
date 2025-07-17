import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Copy, Check, Clock, Download } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { supabase, generateCode, formatFileSize } from '../lib/supabase';
import { GlassCard } from '../components/GlassCard';
import { FileUpload } from '../components/FileUpload';
import { ProgressBar } from '../components/ProgressBar';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { NetworkStatus } from '../components/NetworkStatus';

export const SendPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [shareCode, setShareCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const code = generateCode();
      const fileId = uuidv4();
      const filePath = `uploads/${fileId}`;

      // Upload file to Supabase Storage with progress tracking
      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        });

      // Simulate progress for better UX since Supabase doesn't provide native progress
      const simulateProgress = () => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15;
          if (progress >= 90) {
            setUploadProgress(90);
            clearInterval(interval);
          } else {
            setUploadProgress(Math.floor(progress));
          }
        }, 200);
        return interval;
      };

      const progressInterval = simulateProgress();

      if (uploadError) throw uploadError;

      // Complete the progress
      setUploadProgress(95);

      // Create database record
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      
      const { error: dbError } = await supabase
        .from('file_shares')
        .insert([
          {
            id: fileId,
            code,
            filename: selectedFile.name,
            file_size: selectedFile.size,
            file_type: selectedFile.type,
            storage_path: filePath,
            expires_at: expiresAt.toISOString(),
            downloaded: false,
            download_count: 0
          }
        ]);

      if (dbError) throw dbError;

      setUploadProgress(100);
      setShareCode(code);
      setUploadComplete(true);

      // Start countdown timer
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = async () => {
    if (shareCode) {
      await navigator.clipboard.writeText(shareCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black p-4">
      <NetworkStatus />
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Link
            to="/"
            className="flex items-center text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </div>

        <GlassCard>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Send Files</h1>
            <p className="text-white/70">
              Upload a file and share it with a unique code
            </p>
          </div>

          {!uploadComplete ? (
            <div className="space-y-6">
              <FileUpload onFileSelect={handleFileSelect} />
              
              {selectedFile && (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-white/70 mb-2">File selected:</p>
                    <p className="text-white font-medium">{selectedFile.name}</p>
                    <p className="text-white/60 text-sm">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  
                  {uploading && (
                    <div className="space-y-2">
                      <ProgressBar progress={uploadProgress} />
                      <p className="text-white/70 text-sm text-center">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}
                  
                  <button
                    onClick={uploadFile}
                    disabled={uploading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {uploading ? (
                      <>
                        <LoadingSpinner size="sm" color="text-white" />
                        <span className="ml-2">Uploading...</span>
                      </>
                    ) : (
                      'Upload File'
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-green-400 mr-2" />
                  <span className="text-white font-semibold text-lg">File uploaded successfully!</span>
                </div>
                
                <div className="flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-yellow-400 mr-2" />
                  <span className="text-white/70">
                    Expires in: {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="text-center">
                  <h3 className="text-white font-semibold mb-4">Share Code</h3>
                  <div className="bg-white/20 rounded-xl p-6 mb-4">
                    <p className="text-3xl font-mono font-bold text-white tracking-widest">
                      {shareCode}
                    </p>
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center w-full px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>

                <div className="text-center">
                  <h3 className="text-white font-semibold mb-4">QR Code</h3>
                  <QRCodeDisplay value={shareCode} size={120} />
                </div>
              </div>

              <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-xl p-4">
                <p className="text-white/90 text-sm text-center">
                  <strong>Important:</strong> This file can only be downloaded once within 10 minutes.
                  After that, it will be automatically deleted.
                </p>
              </div>

              <div className="text-center">
                <Link
                  to="/"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-200"
                >
                  Send Another File
                </Link>
              </div>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};