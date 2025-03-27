import { Modal, Typography, List, Avatar } from 'antd';

const { Title, Text } = Typography;
// Interface for the Mother
export interface Mother {
    id: string;
    username: string;
    email: string;
    fullName: string;
    phone: string;
    role: string;
    isDeleted: boolean;
}

// Interface for the Fetal Record
export interface FetalRecord {
    id: string;
    name: string;
    note: string;
    dateOfPregnancyStart: string; // Format: YYYY-MM-DD
    expectedDeliveryDate: string; // Format: YYYY-MM-DD
    actualDeliveryDate: string | null; // Can be null if not yet delivered
    healthStatus: string;
    status: string; // e.g., "PREGNANT"
    isDeleted: number; // Assuming this is a flag (0 or 1)
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    checkupRecords: any[]; // Assuming this is an array of checkup records
    mother: Mother; // Reference to the Mother interface
}

// Interface for the Doctor
export interface Doctor {
    id: string;
    username: string;
    email: string;
    fullName: string;
    image: string | null; // URL to the doctor's image
    phone: string;
    role: string;
    isDeleted: boolean;
}

// Interface for the Appointment History
export interface AppointmentHistory {
    id: string;
    status: string; // e.g., "PENDING"
    notes: string | null; // Can be null if no notes
    createdAt: string; // ISO date string
    changedBy: Mother; // Reference to the Mother interface (who changed the status)
}

// Interface for the Appointment
export interface AppointmentHistoryDetail {
    id: string;
    appointmentDate: string; // Format: YYYY-MM-DD
    status: string; // e.g., "PENDING"
    fetalRecords: FetalRecord[]; // Array of fetal records
    doctor: Doctor; // Reference to the Doctor interface
    appointmentServices: any[]; // Assuming this is an array of services
    medicationBills: any[]; // Assuming this is an array of medication bills
    history: AppointmentHistory[]; // Array of appointment history records
}

const ModalAppointmentDetail = ({ isVisible, onClose, appointmentData }:{isVisible:any, onClose: any, appointmentData: AppointmentHistoryDetail}) => {
 console.log("ModalAppointmentDetail: ", appointmentData)
    return (
    <Modal
      title="Appointment Detail"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      className="rounded-lg"
    >
      <Title level={4}>Appointment ID: {appointmentData?.id}</Title>
      <Text strong>Appointment Date: </Text>
      <Text>{appointmentData?.appointmentDate}</Text>
      <br />
      <Text strong>Status: </Text>
      <Text>{appointmentData?.status}</Text>
      <br />
      
      <Title level={5}>Fetal Records</Title>
      <List
        itemLayout="horizontal"
        dataSource={appointmentData?.fetalRecords}
        renderItem={record => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar>{record?.name.charAt(0)}</Avatar>}
              title={<Text strong>{record.name}</Text>}
              description={
                <>
                  <Text>Note: {record.note}</Text>
                  <br />
                  <Text>Date of Pregnancy Start: {record.dateOfPregnancyStart}</Text>
                  <br />
                  <Text>Expected Delivery Date: {record.expectedDeliveryDate}</Text>
                  <br />
                  <Text>Health Status: {record.healthStatus}</Text>
                </>
              }
            />
          </List.Item>
        )}
      />

      <Title level={5}>Doctor Information</Title>
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={appointmentData?.doctor.image} />}
          title={<Text strong>{appointmentData?.doctor.fullName}</Text>}
          description={
            <>
              <Text>Email: {appointmentData?.doctor.email}</Text>
              <br />
              <Text>Phone: {appointmentData?.doctor.phone}</Text>
            </>
          }
        />
      </List.Item>

      <Title level={5}>Appointment History</Title>
      <List
        itemLayout="horizontal"
        dataSource={appointmentData?.history}
        renderItem={history => (
          <List.Item>
            <List.Item.Meta
              title={<Text strong>Status: {history?.status}</Text>}
              description={
                <>
                  <Text>Changed By: {history?.changedBy?.fullName}</Text>
                  <br />
                  <Text>Created At: {new Date(history?.createdAt).toLocaleString()}</Text>
                </>
              }
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default ModalAppointmentDetail;