import React, { useState } from 'react';
import { QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ClassroomQRGenerator = () => {
  const [roomCode, setRoomCode] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = () => {
    if (!roomCode.trim()) {
      setError('กรุณาป้อนรหัสห้องเรียน');
      setIsGenerated(false);
      return;
    }
    
    setError('');
    setIsGenerated(true);
  };

  const handleRoomCodeChange = (e) => {
    setRoomCode(e.target.value);
    setIsGenerated(false);
    setError('');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>สร้าง QR Code เข้าห้องเรียน</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="ป้อนรหัสห้องเรียน"
            value={roomCode}
            onChange={handleRoomCodeChange}
            className="flex-1"
          />
          <Button onClick={handleGenerate}>
            สร้าง QR Code
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isGenerated && roomCode && (
          <div className="flex flex-col items-center gap-4">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <QrCode size={200} />
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500">รหัสห้องเรียน</div>
              <div className="text-2xl font-bold">{roomCode}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClassroomQRGenerator;
