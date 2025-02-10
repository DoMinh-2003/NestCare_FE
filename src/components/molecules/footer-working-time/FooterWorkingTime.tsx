import React from 'react'
import FooterLink from '../../atoms/footer-link/FooterLink '

const FooterWorkingTime = () => {
  return (
    <div>
        <div className="">
        <div className='text-white font-semibold'>Thời gian làm việc</div>
        <FooterLink href="/privacy">Cấp cứu 24/24</FooterLink>
        <FooterLink href="/contact">Thứ 2 – CN: 6:00 - 16:00</FooterLink>
        <FooterLink href="/contact">Ngoài giờ: 16:00 - 20:00</FooterLink>
    </div>
    </div>
  )
}

export default FooterWorkingTime