import { Modal, Table, Typography } from 'antd';
import { useState } from 'react';
import ModalAppointmentDetail, { AppointmentHistoryDetail } from '../modal-appointment-detail/ModalAppointmentDetail';
import useAppointmentService from '../../../services/useAppointmentService';
import Loading from '../../molecules/loading/Loading';

const ModalAppointmentHistory = ({ isVisible, onClose, appointmentData }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [appointment, setAppointment] = useState<AppointmentHistoryDetail | null>(null); // Initialize as null
  const { getAppointmentDetail,  } = useAppointmentService();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if(isLoading){
    return <Loading/>
  }

  const showModal = async (id: string) => {
    setIsModalVisible(true);
    if (id) {
      try {
        setIsLoading(true)
        const response = await getAppointmentDetail(id);
        if (response) {
          console.log("showModal: ", response);
          setAppointment(response); // Set the fetched appointment data
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error fetching appointment details:", error);
        setIsLoading(false)
      }
    }
  };

  const onCloseModalAppointmentHistoryDetail = () => {
    setIsModalVisible(false);
    setAppointment(null); // Reset appointment state when closing the modal
  };

  const columns = [
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Ngày đặt lịch',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
    },
    {
      title: 'Xem chi tiết',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <div onClick={() => showModal(id)} className='text-blue cursor-pointer'>
          Xem chi tiết
        </div>
      )
    },
  ];

  return (
    <Modal
      title="Lịch sử đặt lịch"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      width={900}
      className="rounded-lg"
    >
      <ModalAppointmentDetail 
        isVisible={isModalVisible} 
        appointmentData={appointment} // Pass the fetched appointment data
        onClose={onCloseModalAppointmentHistoryDetail} 
      />
      <Table
        dataSource={appointmentData?.appointments}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
    </Modal>
  );
};

export default ModalAppointmentHistory;