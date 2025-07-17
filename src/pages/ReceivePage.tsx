import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, AlertCircle, CheckCircle, QrCode } from 'lucide-react';
import { supabase, formatFileSize, isFileExpired } from '../lib/supabase';
import { GlassCard } from '../components/GlassCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { NetworkStatus } from '../components/NetworkStatus';
import type { FileShare } from '../types';

export const ReceivePage: React.FC = () => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState<FileShare | null>(null);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const validateCode = async () => {
    if (!code || code.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('file_shares')
        .select('*')
        .eq('code', code)
        .single();

      if (fetchError || !data) {
        setError('Invalid code or file not found');
        setLoading(false);
        return;
      }

      if (data.downloaded) {
        setError('This file has already been downloaded');
        setLoading(false);
        return;
      }

      if (isFileExpired(data.expires_at)) {
        setError('This file has expired');
        setLoading(false);
        return;
      }

      setFileData(data);
    } catch (error) {
      console.error('Error validating code:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async () => {
    if (!fileData) return;

    setDownloading(true);
    setError('');

    try {
      // Download file from storage
      const { data: fileBlob, error: downloadError } = await supabase.storage
        .from('files')
        .download(fileData.storage_path);

      if (downloadError) throw downloadError;

      // Create download link
      const url = URL.createObjectURL(fileBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileData.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Mark as downloaded and delete from storage
      await supabase
        .from('file_shares')
        .update({ downloaded: true, download_count: 1 })
        .eq('id', fileData.id);

      await supabase.storage
        .from('files')
        .remove([fileData.storage_path]);

      setFileData({ ...fileData, downloaded: true });
    } catch (error) {
      console.error('Download failed:', error);
      setError('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleCodeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    if (value.length === 6) {
      setTimeout(() => validateCode(), 500);
    }
  };

  const resetForm = () => {
    setCode('');
    setFileData(null);
    setError('');
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
            <h1 className="text-3xl font-bold text-white mb-2">Receive Files</h1>
            <p className="text-white/70">
              Enter the 6-digit code or scan QR code to download
            </p>
          </div>

          {!fileData ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <button
                    onClick={() => setShowScanner(false)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      !showScanner 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    Enter Code
                  </button>
                  <button
                    onClick={() => setShowScanner(true)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      showScanner 
                        ? 'bg-white/20 text-white' 
                        : 'text-white/70 hover:text-white'
                    }`}
                  >
                    <QrCode className="w-4 h-4 mr-2 inline" />
                    Scan QR
                  </button>
                </div>

                {!showScanner ? (
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={code}
                        onChange={handleCodeInput}
                        placeholder="Enter 6-digit code"
                        className="w-full px-6 py-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/50 text-center text-2xl font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-400"
                        maxLength={6}
                      />
                      {loading && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                          <LoadingSpinner size="sm" color="text-white" />
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={validateCode}
                      disabled={code.length !== 6 || loading}
                      className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Validating...' : 'Find File'}
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="bg-white/20 rounded-xl p-8 mb-4">
                      <QrCode className="w-16 h-16 text-white/60 mx-auto mb-4" />
                      <p className="text-white/70">
                        QR Scanner functionality would be implemented here
                      </p>
                      <p className="text-white/50 text-sm mt-2">
                        For now, please use the code input above
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center justify-center p-4 bg-red-400/20 border border-red-400/30 rounded-xl">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                  <span className="text-white">{error}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {!fileData.downloaded ? (
                <>
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-white font-semibold text-lg mb-2">File Found!</h3>
                  </div>

                  <div className="bg-white/20 rounded-xl p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-white/70">Filename:</span>
                        <span className="text-white font-medium">{fileData.filename}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Size:</span>
                        <span className="text-white font-medium">{formatFileSize(fileData.file_size)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Type:</span>
                        <span className="text-white font-medium">{fileData.file_type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/70">Expires:</span>
                        <span className="text-white font-medium">
                          {new Date(fileData.expires_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-400/20 border border-yellow-400/30 rounded-xl p-4">
                    <p className="text-white/90 text-sm text-center">
                      <strong>Note:</strong> This file can only be downloaded once. 
                      After download, it will be permanently deleted.
                    </p>
                  </div>

                  <button
                    onClick={downloadFile}
                    disabled={downloading}
                    className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {downloading ? (
                      <>
                        <LoadingSpinner size="sm" color="text-white" />
                        <span className="ml-2">Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5 mr-2" />
                        Download File
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
                  <h3 className="text-white font-semibold text-lg">Download Complete!</h3>
                  <p className="text-white/70">
                    The file has been downloaded and permanently deleted from our servers.
                  </p>
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-green-600 transition-all duration-200"
                  >
                    Download Another File
                  </button>
                </div>
              )}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  );
};