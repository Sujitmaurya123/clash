

import Register from '@/components/auth/Register'
import Link from 'next/link'
import React from 'react'

export default function register() {
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='w-[550px] bg-white rounded-xl shadow-md py-5 px-10'>
        <h1 className='text-4xl   font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent text-center bg-clip-text'>Clash</h1>
        <h1 className='text-3xl font-bold'>Register</h1> 
        <p>Welcome to clash</p>
          <Register />
        <p className='text-center mt-2'>Already have an account ?{" "}
          <strong>
            <Link href="/login">Login</Link>
          </strong>
        </p>
      </div>
    </div>
  )
}
