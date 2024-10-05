'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Particles from '@/components/ui/particles'
import axios from 'axios'
import { AnimatePresence, motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

export default function Component() {
  const [inputText, setInputText] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (!inputText.trim()) return
    setIsLoading(true)
    try {
      const response = await axios.post('api/genImage', { text: inputText })
      if (response && response.data.imageUrl) {
        setGeneratedImage(response.data.imageUrl)
      }
    } catch (error) {
      console.error('Failed to generate image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Particles
        className='absolute inset-0'
        quantity={100}
        ease={80}
        color={'#ffffff'}
        refresh
      ></Particles>
      <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 p-4 sm:p-8'>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='mb-8 text-center text-4xl font-bold text-cyan-100 sm:text-5xl'
        >
          Text to Image Generator
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='w-full max-w-md space-y-4'
        >
          <Input
            type='text'
            placeholder='Enter your text here...'
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            className='w-full border-cyan-700 bg-slate-800/50 text-lg text-cyan-100 placeholder-cyan-400 focus:border-cyan-500 focus:ring-cyan-500'
          />
          <Button
            onClick={handleGenerate}
            disabled={isLoading || !inputText.trim()}
            className='w-full bg-cyan-600 py-6 text-lg text-white hover:bg-cyan-700'
          >
            {isLoading ? (
              <Loader2 className='mr-2 h-6 w-6 animate-spin' />
            ) : (
              'Generate Image'
            )}
          </Button>
        </motion.div>

        <AnimatePresence mode='wait'>
          {isLoading && (
            <motion.div
              key='loader'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className='mt-12'
            >
              <Loader2 className='h-16 w-16 animate-spin text-cyan-400' />
            </motion.div>
          )}

          {!isLoading && generatedImage && (
            <motion.div
              key='image'
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className='mt-12 w-full max-w-sm'
            >
              <motion.img
                src={
                  generatedImage.length > 0
                    ? generatedImage
                    : 'https://img.freepik.com/free-vector/404-error-web-template-with-funny-monster_23-2147788955.jpg?t=st=1728115629~exp=1728119229~hmac=1c8dcfed29a2de1670a1f68be30bcdccef22d307119204484be1206242555c17&w=740'
                }
                alt='Generated image'
                className='h-auto w-full rounded-lg object-cover shadow-xl'
                initial={{ filter: 'blur(10px)' }}
                animate={{ filter: 'blur(0px)' }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
