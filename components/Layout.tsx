import { ReactNode } from 'react'
import { Navbar } from './Navbar'

type Props = {
  children?: ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
