import Login from '@/components/auth/Login'
import Link from 'next/link'
import React from 'react'

export default function login() {
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='w-[550px] bg-white rounded-xl shadow-md py-5 px-10'>
        <h1 className='text-4xl   font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent text-center bg-clip-text'>Clash</h1>
        <h1 className='text-3xl font-bold'>Login</h1> 
        <p>Welcome Back</p>
        <Login />
        <p>Don't have an account ?{" "}
          <strong>
            <Link href="/register">Register</Link>
          </strong>
        </p>
      </div>
    </div>
  )
}
