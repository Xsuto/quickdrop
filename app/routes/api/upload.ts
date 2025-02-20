import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { redis } from '~/utils/redis'
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator'

function generateFriendlyId() {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: '-',
    length: 3,
    style: 'lowerCase'
  })
}

export const APIRoute = createAPIFileRoute('/api/upload')({
  POST: async ({ request }) => {
    try {
      console.log('Starting file upload process')
      const formData = await request.formData()
      const files = formData.getAll('files')
      console.log(`Received ${files.length} files`)

      const fileId = generateFriendlyId()
      
      const processedFiles = await Promise.all(
        files.map(async (file) => {
          if (!(file instanceof File)) {
            throw new Error('Invalid file upload')
          }
          
          const buffer = await file.arrayBuffer()
          const base64Data = Buffer.from(buffer).toString('base64')
          console.log(`File ${file.name} size:`, buffer.byteLength, 'bytes')
          
          return {
            name: file.name,
            type: file.type,
            data: base64Data
          }
        })
      )

      await redis.set(fileId, JSON.stringify(processedFiles), 3600)

      return json({ id: fileId })
    } catch (error) {
      console.error('Error during file upload:', error)
      return json({ error: 'Failed to upload files' }, { status: 500 })
    }
  }
}) 
