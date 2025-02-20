import { createFileRoute } from '@tanstack/react-router'
import { FileDropzone } from '~/components/FileDropzone'
import { FileRetriever } from '~/components/FileRetriever'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="max-w-2xl ">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Share Files Instantly
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Drag and drop your files to get a one-time use shareable link valid for one hour
          </p>
        </div>
        <FileDropzone />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 dark:bg-gray-950 px-4 text-sm text-gray-500 dark:text-gray-400">
              or
            </span>
          </div>
        </div>
        <div className="mt-12">
          <FileRetriever />
        </div>
      </div>
    </div>
  )
}
