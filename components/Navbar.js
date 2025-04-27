import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (

    <nav className='bg-[#F5EDFA] text-white flex h-[70] py-4 px-10 justify-between '>
      
      <Link href='/' className='flex'>
        <img className='h-8 w-8 mr-2' src='/logo.png'/>
        <h1 className='text-3xl text-[#6300B3] font-bold'>TalentGrid</h1>
        <h4 className='text-light_yellow pt-6 font-semibold'></h4>
      </Link>

      <ul className='flex gap-8 items-center text-md'>

        <li>
          <Link href='/' className=' text-[#6300B3] transition-all duration-200'>Home</Link>
        </li>
        <li>
          <Link href='/about' className=' text-[#6300B3] transition-all duration-200'>About</Link>
        </li>
        <li>
          <Link href='/contact' className=' text-[#6300B3] transition-all duration-200'>Contact</Link>
        </li>
      </ul>

      {/* Auth Section */}
      <div className='flex gap-3 md:gap-5 justify-center items-center mt-4 md:mt-0 flex-shrink-0'>
        <Link className=' text-[#6300B3] transition-all duration-200' href='/login'>Login</Link>
        <button className='rounded-full bg-[#6300B3] text-white px-5 py-2 md:p-3 transition-all duration-200'>
          <Link href='/join'>Signin</Link>
        </button>
      </div>
    </nav>
  )
}

export default Navbar
