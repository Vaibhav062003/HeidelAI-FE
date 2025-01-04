'use client';
import {toast, Toaster} from 'sonner';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/components/firebase';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login'); // Redirect to login if not logged in
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className='bg-white text-black h-[100vh]'>
      <Toaster position='top-center' richColors/>
      <h1>Dashboard</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  );
}
