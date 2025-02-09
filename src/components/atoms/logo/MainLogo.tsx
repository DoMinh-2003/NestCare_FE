import React from 'react'

interface MainLogoProps{
     className?: string;
}

const MainLogo = ({className}:MainLogoProps) => {
  return (
    <>
        <img className={className} src="https://sihospital.com.vn/images/logo.png" alt="" />
    </>
  )
}

export default MainLogo