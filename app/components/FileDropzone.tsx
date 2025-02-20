import { useCallback, useState } from 'react'

export function FileDropzone() {
  const [isDragging, setIsDragging] = useState(false)
  const [fileUrl, setFileUrl] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }, [])

  const handleCopy = useCallback(async () => {
    if (fileUrl) {
      await navigator.clipboard.writeText(fileUrl)
    }
  }, [fileUrl])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length === 0) return

    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      const { ids } = await response.json()
      const urls = ids.map((id: string) => `${window.location.origin}/api/download/${id}`)
      setFileUrl(urls.join('\n'))
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }, [])

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`w-full h-64 border-2 border-dashed rounded-lg flex items-center justify-center ${
          isDragging ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300'
        }`}
      >
        <div className="text-center">
          <p className="text-lg">Drop files here</p>
          <p className="text-sm text-gray-500">Files will be available for 1 hour</p>
        </div>
      </div>

      {fileUrl && (
        <div className="flex items-center gap-2 p-4 border rounded-lg">
          <input 
            type="text" 
            value={fileUrl} 
            readOnly 
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={handleCopy}
            className="px-4 py-2 rounded hover:bg-blue-600"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  )
}