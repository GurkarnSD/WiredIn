'use client';
import styles from '@/styles/Home.module.css'
import Navbar from '@/components/Navbar'
import useCurrentUser from '@/lib/firebase/user'

export default function Home() {

  const user = useCurrentUser()

  return (
    <>
      <Navbar user={user} />
      {user ? <div>Logged In {user.displayName}</div> : <div>Not Logged In</div>}
    </>
  )
}
