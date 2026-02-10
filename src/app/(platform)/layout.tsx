import Header from '@/components/global/header'
import React from 'react'
import { PlatformContextProvider } from '@/context/platformContextProvider'

const TasksLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex flex-col items-center'>
      <main className="w-full md:max-w-7xl">
        <Header />
        <PlatformContextProvider>
          {children}
        </PlatformContextProvider>
      </main>
    </div>
  )
}

export default TasksLayout