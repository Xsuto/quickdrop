import { createAPIFileRoute } from '@tanstack/start/api'
import { redis } from '~/utils/redis'

export const APIRoute = createAPIFileRoute('/api/download/$id')({
  GET: async ({ params }) => {
    const { id } = params
    console.log('API: Attempting to download file for ID:', id)
    
    try {
      const data = await redis.get(id)
      
      if (!data) {
        console.log('API: No data found in Redis for ID:', id)
        return new Response('File not found', { status: 404 })
      }

      const file = JSON.parse(data)
      console.log(`Processing ${file.name}`)

      // Decode base64 data
      const buffer = Buffer.from(file.data, 'base64')
      console.log('Decoded file size:', buffer.length, 'bytes')

      await redis.del(id)
      
      // Create response with proper headers
      return new Response(buffer, {
        headers: {
          'Content-Type': file.type,
          'Content-Disposition': `attachment; filename="${file.name}"`,
          'Content-Length': buffer.length.toString()
        }
      })
    } catch (err) {
      console.error('API: Error processing request:', err)
      return new Response('Internal server error', { status: 500 })
    }
  }
}) 