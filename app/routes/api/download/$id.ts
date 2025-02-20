import { createAPIFileRoute } from '@tanstack/start/api'
import { redis } from '~/utils/redis'
import JSZip from 'jszip'

export const APIRoute = createAPIFileRoute('/api/download/$id')({
  GET: async ({ params }) => {
    const { id } = params
    console.log('API: Attempting to download files for ID:', id)
    
    try {
      const data = await redis.get(id)
      
      if (!data) {
        console.log('API: No data found in Redis for ID:', id)
        return new Response('File not found', { status: 404 })
      }

      const files = JSON.parse(data)
      
      if (!Array.isArray(files)) {
        const buffer = Buffer.from(files.data, 'base64')
        return new Response(buffer, {
          headers: {
            'Content-Type': files.type,
            'Content-Disposition': `attachment; filename="${files.name}"`,
            'Content-Length': buffer.length.toString()
          }
        })
      }

      const zip = new JSZip()
      
      files.forEach(file => {
        const buffer = Buffer.from(file.data, 'base64')
        zip.file(file.name, buffer)
      })

      const zipBuffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE'
      })

      await redis.del(id)

      return new Response(zipBuffer, {
        headers: {
          'Content-Type': 'application/zip',
          'Content-Disposition': 'attachment; filename="files.zip"',
          'Content-Length': zipBuffer.length.toString()
        }
      })
    } catch (err) {
      console.error('API: Error processing request:', err)
      return new Response('Internal server error', { status: 500 })
    }
  }
}) 