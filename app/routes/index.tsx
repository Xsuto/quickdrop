import { createFileRoute } from '@tanstack/react-router'
import { FileDropzone } from '~/components/FileDropzone'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold mb-4">Quick File Share</h3>
      <FileDropzone />
    </div>
  )
}
