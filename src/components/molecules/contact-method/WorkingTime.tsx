
import ContactCard from '../contact-card/ContactCard'
import {
    ScheduleOutlined,
} from '@ant-design/icons';

const WorkingTime = () => {
  return (
    <div>
      <ContactCard
        title='Thời gian làm việc'
        content={["Cấp cứu 24/24", "Thứ 2 – CN: 6:00 - 16:00", "Ngoài giờ: 16:00 - 20:00"]}
        icon={<ScheduleOutlined />}
      />
    </div>
  )
}

export default WorkingTime
