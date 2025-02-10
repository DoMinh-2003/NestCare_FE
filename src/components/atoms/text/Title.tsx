import React from 'react'

interface TitleProps{
    text: string
}

const Title = ({text}: TitleProps) => {
  return (
    <div className='font-bold text-pink-700 text-5xl'>
        {text}
    </div>
  )
}

export default Title