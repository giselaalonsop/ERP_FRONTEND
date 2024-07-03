'use client'
import React from 'react'
import { Spinner } from 'flowbite-react'
const Loading = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">  
    <Spinner aria-label="Default status example" /></div>
  )
}
export default Loading