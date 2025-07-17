import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ value, size = 128 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    }
  }, [value, size]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="p-4 bg-white rounded-xl shadow-lg">
        <canvas ref={canvasRef} />
      </div>
      <p className="text-white/70 text-sm text-center">
        Scan this QR code to download the file
      </p>
    </div>
  );
};