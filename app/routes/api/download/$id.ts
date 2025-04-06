import { createAPIFileRoute } from '@tanstack/start/api'
import { redis } from '~/utils/redis'
import { checkRateLimit } from '~/utils/rateLimit'
import JSZip from 'jszip'
import { getClientIp } from '~/utils/getClientIp'

export const APIRoute = createAPIFileRoute('/api/download/$id')({
  GET: async ({ params, request }) => {
    const { id } = params
    const clientIp = getClientIp(request)
    console.log('Download IP:', clientIp)
    
    try {
      const isAllowed = await checkRateLimit(clientIp, 'download', 50, 60)
      if (!isAllowed) {
        return new Response('Too many downloads. Please try again later.', { 
          status: 429,
          headers: {
            'Retry-After': '300'
          }
        })
      }

      console.log('API: Attempting to download files for ID:', id)
      
      const files = await redis.get(id)
      
      if (!files) {
        console.log('API: No data found in Redis for ID:', id)
        return new Response('File not found', { status: 404 })
      }

      
      // If there's only one file, return it directly
      if (!Array.isArray(files) || files.length === 1) {
        const file = Array.isArray(files) ? files[0] : files
        const buffer = Buffer.from(file.data, 'base64')
        await redis.del(id)
        
        return new Response(buffer, {
          headers: {
            'Content-Type': file.type,
            'Content-Disposition': `attachment; filename="${file.name}"`,
            'Content-Length': buffer.length.toString()
          }
        })
      }

      // Multiple files - create a zip
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