import { Modal, Table, Typography } from 'antd';

const { Title } = Typography;

const ModalAppointmentHistory = ({ isVisible, onClose, appointmentData }) => {
  // Define columns for the fetal records table
    console.log("appointmentData: ", appointmentData)
  const columns = [
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Date',
      dataIndex: 'appointmentDate',
      key: 'appointmentDate',
    },
  ];

  return (
    <Modal
      title="Appointment History"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      width={900}
      className="rounded-lg"
    >
      {/* <Title level={4}>Appointment ID: {appointmentData?.id}</Title>
      <Title level={5}>Appointment Date: {appointmentData?.appointmentDate}</Title>
      <Title level={5}>Status: {appointmentData?.status}</Title> */}

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