import React from 'react'

const Footer = () => {
  return (
    <div className='bg-primary-dark h-16 border-t-[1px] border-primary flex items-center justify-center'>
      <p className='text-secondary-gray text-sm'>
        &copy; {new Date().getFullYear()} Innate Gaming. All rights reserved.
      </p>
    </div>
  )
}

export default Footer
