import React from 'react'

function Home() {
  return (
    <div className={`w-full h-full bg-primary absolute flex flex-1 flex-row`}>
        <div className='flex bg-accent-secondary flex flex-1 flex-col max-w-[80px] items-center pt-[15px]'>
            <span>Home</span>
        </div>
    </div>
  )
}

export default Home