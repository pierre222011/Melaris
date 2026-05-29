'use client';

import { useEffect, useState } from 'react';
import { grantAdminPrivileges } from '@/app/actions/admin';

export default function KonamiCode() {
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Only mount this listener in development mode
    if (process.env.NODE_ENV !== 'development') return;

    const secretCode = 'melineadminok';
    let typedKeys = '';

    const handleKeyDown = async (e: KeyboardEvent) => {
      // Ignore modifier keys and special keys like Shift, Backspace, etc.
      if (e.key.length !== 1) return;

      typedKeys += e.key.toLowerCase();

      // Keep only the last N characters
      if (typedKeys.length > secretCode.length) {
        typedKeys = typedKeys.substring(typedKeys.length - secretCode.length);
      }

      if (typedKeys === secretCode) {
        // Code matched! Trigger the backdoor
        typedKeys = ''; // reset
        console.log('Secret code activated. Requesting admin privileges...');
        
        try {
          const result = await grantAdminPrivileges();
          if (result.success) {
            setSuccess(true);
            setTimeout(() => setSuccess(false), 5000);
          } else {
            console.error('Failed to grant admin privileges:', result.error);
          }
        } catch (error) {
          console.error('Error in backdoor:', error);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!success) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-green-500/20 text-green-400 border border-green-500/50 px-4 py-2 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.3)] animate-pulse">
      <span className="font-mono text-xs font-bold uppercase tracking-wider">Admin Rights Granted</span>
    </div>
  );
}
