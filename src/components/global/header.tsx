'use client';

import { useAuthStore } from '@/store/auth-store';
import { Button } from '../ui/button'
import { ThemeToggle } from './theme-toggle'
import { LogInIcon, LogOutIcon } from 'lucide-react'
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import ConfirmationPopup from './confimation-popup';

const Header = () => {

  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();

  const handeLogout = async() => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      logout();
      router.push('/login');
    } catch (error) {
      toast.error("Unable to logout")
    }
  }

  return (
    <header className='w-full p-2 flex items-center justify-between'>
      <h2 className='text-2xl font-semibold'>Taski</h2>
      <div className='flex items-center gap-2'>
        <ThemeToggle />
        {isAuthenticated && user ? (
          <div className='flex items-center gap-2'>
            <span>Welcome! {user.name}</span>
            <ConfirmationPopup 
              title='Logout'
              description='Are you sure want to logout'
              trigger={
                <Button
                  variant="outline"
                  
                >
                  Logout <LogOutIcon />
                </Button>
              }
              onAction={() => handeLogout()}
            />
          </div>
        ) : (
          <Button className='hover:cursor-pointer'>Login <LogInIcon /></Button>
        )}
      </div>
    </header>
  )
}

export default Header