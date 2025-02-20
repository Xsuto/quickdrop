import { useState } from 'react'

export function FileRetriever() {
  const [downloadId, setDownloadId] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!downloadId) return
    
    window.location.href = `/api/download/${downloadId}`
  }

  return (
    <div className="text-center space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Have a file ID?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Enter the ID to download your files
        </p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2 justify-center">
        <input
          type="text"
          value={downloadId}
          onChange={(e) => setDownloadId(e.target.value)}
          placeholder="e.g. happy-blue-dolphin"
          className="px-3 py-2 bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg"
        />
        <button
          type="submit"
          disabled={!downloadId}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 dark:disabled:bg-blue-800 text-white rounded-lg transition-colors"
        >
          Download
        </button>
      </form>
    </div>
  )
} 