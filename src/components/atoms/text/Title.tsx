interface TitleProps{
    text: string,
    className?: string;
}

const Title = ({text, className}: TitleProps) => {
  return (
    <div className={`${className} font-bold text-pink-700 text-5xl`}>
        {text}
    </div>
  )
}

export default Title