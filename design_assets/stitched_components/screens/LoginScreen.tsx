import React from 'react';
import { Input } from '../Input';
import { Button } from '../Button';

export const LoginScreen: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-xl p-8">
        <h1 className="font-display-lg text-display-lg mb-2">Staffly</h1>
        <p className="text-body-sm text-on-surface-variant mb-6">Secure Administrative Access</p>
        <form className="space-y-4">
          <Input placeholder="Email" type="email" />
          <Input placeholder="Password" type="password" />
          <Button type="submit">Sign in</Button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
