import { useCallback, useState } from 'react'

export function FileDropzone() {
  const [isDragging, setIsDragging] = useState(false)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [fileId, setFileId] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showResult, setShowResult] = useState(false)

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
    setIsUploading(true)
    setFileUrl(null)
    setFileId(null)
    setShowResult(false)

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
      const { id } = await response.json()
      const url = `${window.location.origin}/api/download/${id}`
      setFileUrl(url)
      setFileId(id)
      setTimeout(() => setShowResult(true), 100)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setIsUploading(false)
    }
  }, [])

  return (
    <div className="space-y-6">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`
          w-full h-80 border-2 border-dashed rounded-xl 
          transition-all duration-200 ease-in-out
          ${isDragging
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          }
        `}
      >
        <div className="h-full flex flex-col items-center justify-center">
          {isUploading ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-600 dark:text-gray-400">Uploading files...</p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto">
                <svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-xl font-medium text-gray-900 dark:text-white">Drop files here</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Files will be available for 1 hour</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`
        transition-all duration-500 ease-out
        ${showResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
      `}>
        {(fileUrl && fileId) && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border dark:border-gray-700 overflow-hidden">
            <div className="p-6 text-center space-y-4">
              <div className="animate-fade-in">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Your File ID</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1 animate-slide-up">{fileId}</p>
              </div>
              <div className="max-w-md mx-auto animate-slide-up delay-150">
                <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900 rounded-lg p-2">
                  <input
                    type="text"
                    value={fileUrl}
                    readOnly
                    className="flex-1 bg-transparent border-0 text-sm text-gray-600 dark:text-gray-400 px-2"
                  />
                  <button
                    onClick={handleCopy}
                    className="shrink-0 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
