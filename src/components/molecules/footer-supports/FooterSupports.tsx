import React from 'react'
import FooterLink from '../../atoms/footer-link/FooterLink '

const FooterSupports = () => {
  return (
    <div>
        <div className="">
        <div className='text-white font-semibold'>Hỗ trợ khách hàng</div>
        <FooterLink href="/privacy">Quyền của bệnh nhân</FooterLink>
        <FooterLink href="/terms">Chính sách bảo mật</FooterLink>
        <FooterLink href="/contact">Chính sách bảo mật thông tin</FooterLink>
        <FooterLink href="/contact">Liên hệ</FooterLink>
    </div>
    </div>
  )
}

export default FooterSupports