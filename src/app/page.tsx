import ProtectedRoute from '@/components/protectedRoute'
import Image from 'next/image'

export default function Home() {
  return (
    <ProtectedRoute>
      <main></main>
    </ProtectedRoute>
  )
}
