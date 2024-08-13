import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import React from 'react'

export default function register() {
  return (
    <div className='flex justify-center items-center h-screen'>
      <div className='w-[550px] bg-white rounded-xl shadow-md py-5 px-10'>
        <h1 className='text-4xl   font-extrabold bg-gradient-to-r from-pink-400 to-purple-500 text-transparent text-center bg-clip-text'>Clash</h1>
        <h1 className='text-3xl font-bold'>Register</h1> 
        <p>Welcome to clash</p>
        <form >
            <div className='mt-4'>
            <Label htmlFor='name'>Name</Label>
            <Input id='name' type='text' name='name' placeholder='Enter your Name...'/>
          </div>
          <div className='mt-4'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' name='email' placeholder='Enter your Email...'/>
          </div>
          <div className='mt-4'>
            <Label htmlFor='password'>Password</Label>
            <Input id='password'type='password' name='password' placeholder='Enter your Password...'/>
            
          </div>
          <div className='mt-4'>
            <Label htmlFor='cpassword'>Confirm Password</Label>
            <Input id='cpassword'type='password' name='confirm_password' placeholder='Confirm your Password...'/>
            
          </div>
          <div className='mt-4'>
            <Button className='w-full'>Submit</Button>
          </div>
        </form>
        <p>Already have an account ?{" "}
          <strong>
            <Link href="/login">Login</Link>
          </strong>
        </p>
      </div>
    </div>
  )
}
