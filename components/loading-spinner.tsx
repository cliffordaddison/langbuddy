export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
        <div className="mt-4 text-center text-gray-600 dark:text-gray-400">
          <p className="text-lg font-medium">Loading LangBuddy...</p>
          <p className="text-sm">Preparing your French learning experience</p>
        </div>
      </div>
    </div>
  )
} 