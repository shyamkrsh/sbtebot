import React from 'react'
import { FaPlus } from "react-icons/fa";

function Navbar() {
    return (
        <div className='flex items-center justify-between h-[3.8rem] bg-white py-2 px-4 sticky top-0 left-0' style={{boxShadow: '-1px 0px 2px gray'}}>
            <div className='cursor-pointer'>
                <img src="https://i.ibb.co/0RkP7K2z/sbte-logo.png" className='w-[2.5rem] h-[2.5rem]' />
            </div>
            <div className='cursor-pointer cardBtn' onClick={() => {localStorage.removeItem('questions'), localStorage.removeItem('answers')}}>
                <FaPlus className='text-2xl text-white' />
            </div>
        </div>
    )
}

export default Navbar