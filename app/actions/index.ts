'use server'

export const generateImage = async (text: string): Promise<string> => {
  const response = await fetch(process.env.IMAGE_URL || '', {
    headers: {
      Authorization: `Bearer ${process.env.HUGGING_FACE_API_SECRET}`,
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({ inputs: text })
  })

  const arrayBuffer = await response.arrayBuffer()
  const base64String = Buffer.from(arrayBuffer).toString('base64')
  const dataUrl = `data:${response.headers.get('content-type') || 'image/png'};base64,${base64String}`

  return dataUrl
}
