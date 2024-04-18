import React from 'react'
import Link from 'next/link'
import Terminal from '../../components/widgets/terminal'

export default function NextPage() {
  return (
    <React.Fragment>
      <div className="mt-1 w-full flex-wrap flex flex-col justify-center items-center gap-[10px] pt-[5px]">
        <Link href="/home">
          <a className="btn-blue w-fit">Home</a>
        </Link>
        <Terminal />
      </div>
    </React.Fragment>
  )
}
