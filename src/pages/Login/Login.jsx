import React from 'react';
import { useSearchParams } from 'react-router-dom';
import LoginForm from '../../components/LoginForm';

export default function Login() {
  const [searchParams] = useSearchParams();
  const selectedModule = searchParams.get('module') || '';

  return (
    <div className="min-h-[calc(100vh-120px)] bg-[#F4F6FB] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md my-auto">
        <LoginForm selectedModule={selectedModule} />
      </div>
    </div>
  );
}
