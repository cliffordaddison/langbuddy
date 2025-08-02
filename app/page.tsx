import { Suspense } from 'react'
import Dashboard from '@/components/dashboard'
import LoadingSpinner from '@/components/loading-spinner'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Suspense fallback={<LoadingSpinner />}>
        <Dashboard />
      </Suspense>
    </main>
  )
} 