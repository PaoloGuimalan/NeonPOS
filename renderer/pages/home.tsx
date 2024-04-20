import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Login from './internal/auth/login'

export default function HomePage() {
  return (
    <React.Fragment>
      <Login />
    </React.Fragment>
  )
}
