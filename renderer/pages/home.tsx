import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function HomePage() {
  return (
    <React.Fragment>
      <Head>
        <title>Neon Shell (Init)</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full text-center p-[20px]">
        <span>Neon Shell (Init)</span>
      </div>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/internal/next">
          <a className="btn-blue">Terminal</a>
        </Link>
      </div>
    </React.Fragment>
  )
}
