import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className='p-10 flex flex-col items-center'>
      <h1 className='text-2xl md:text-3xl lg:text-5xl'>Taski</h1>
      <p className='mt-2 text-lg'>Get your task done by taski blazing fast</p>
      <Button className='mt-5'>
        <Link href={"/tasks"}>
          Get Start
        </Link>
      </Button>
    </div>
  )
}

export default page