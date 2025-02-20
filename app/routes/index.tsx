import { createFileRoute } from '@tanstack/react-router'
import { FileDropzone } from '~/components/FileDropzone'

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
            Drag and drop your files to get a one-time use shareable link that expires in 1 hour
          </p>
        </div>
        <FileDropzone />
      </div>
    </div>
  )
}
