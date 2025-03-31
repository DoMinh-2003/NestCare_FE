import { Link } from 'react-router-dom';

interface MainLogoProps{
     className?: string;
}

const MainLogo = ({className}:MainLogoProps) => {
  return (
    <Link to={"/"}>
        <img className={className} src="https://sihospital.com.vn/images/logo.png" alt="" />
    </Link>
  )
}

export default MainLogo