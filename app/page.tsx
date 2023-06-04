import styles from '@/styles/Home.module.css'
import Navbar from '@/components/Navbar'

export default async function Home() {

  return (
    <>
      {/* @ts-expect-error Async Server Component */}
      <Navbar />
    </>
  )
}
