'use client'
import React from 'react'
import { Spinner } from 'flowbite-react'
const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen">
        <Spinner aria-label="Default status example" className='text-primary'/>
        </div>
    )
}

export default Loading
