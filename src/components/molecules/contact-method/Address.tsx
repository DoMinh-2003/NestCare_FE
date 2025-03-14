
import ContactCard from '../contact-card/ContactCard'
import {
  HomeOutlined,
} from '@ant-design/icons';

const Address = () => {
  return (
    <div>
      <ContactCard
        title='Địa chỉ'
        content={["63 Bùi Thị Xuân, P. Phạm Ngũ Lão, Q. 1, TP. HCM"]}
        icon={<HomeOutlined />}
      />
    </div>
  )
}

export default Address
