import React from 'react';
import LoginForm from '../components/LoginForm';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#F4F6FB] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md my-auto">
        <LoginForm />
      </div>
    </div>
  );
}
