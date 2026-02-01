import Header from '@/components/global/header'
import React from 'react'

const BrandingLayout = ({ children } : { children : React.ReactNode}) => {
  return (
    <div className='flex flex-col items-center'>
      <main className="w-full md:max-w-3xl">
        <Header/>
        {children}
      </main>
    </div>
  )
}

export default BrandingLayout