import React from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, Button, Typography, message } from 'antd';
import useFetalService from '../../../services/useFetalService';
import { useParams } from 'react-router-dom';
import moment from 'moment';

const { Title } = Typography;

// Define the interface for the form values
interface FetalCheckupRecordFormValues {
  motherWeight: number;
  motherBloodPressure: string;
  motherHealthStatus: string;
  fetalWeight: number;
  fetalHeight: number;
  fetalHeartbeat: number;
  warning?: string; // Optional field
  createdAt: string; // Date string
}

interface ModalCreateFetalCheckupRecordProps {
  isVisible: boolean;
  onClose: () => void;
  id: string
}

const ModalCreateFetalCheckupRecord: React.FC<ModalCreateFetalCheckupRecordProps> = ({ isVisible, onClose, id }) => {
  const [form] = Form.useForm();
  const {createFetalCheckupRecord} = useFetalService()
  const onFinish = async(values: FetalCheckupRecordFormValues) => {
    console.log('Received values:', {...values, createdAt:moment(values.createdAt).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")});
    const response = await createFetalCheckupRecord({...values, createdAt:moment(values.createdAt).utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")}, id+'')
    console.log("response: ", response);
    if(response){
      message.success('Tạo hồ sơ kiểm tra thai nhi thành công!')
    }
    onClose(); // Close the modal after submission
  };

  return (
    <Modal
      title="Create Fetal Checkup Record"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
      className="rounded-lg"
    >
      <Title level={4}>Fetal Checkup Information</Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Mother Weight (kg)"
          name="motherWeight"
          rules={[{ required: true, message: 'Please input the mother weight!' }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Mother Blood Pressure"
          name="motherBloodPressure"
          rules={[{ required: true, message: 'Please input the mother blood pressure!' }]}
        >
          <Input placeholder="e.g., 120/80" />
        </Form.Item>

        <Form.Item
          label="Mother Health Status"
          name="motherHealthStatus"
          rules={[{ required: true, message: 'Please input the mother health status!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Fetal Weight (kg)"
          name="fetalWeight"
          rules={[{ required: true, message: 'Please input the fetal weight!' }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Fetal Height (cm)"
          name="fetalHeight"
          rules={[{ required: true, message: 'Please input the fetal height!' }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Fetal Heartbeat (bpm)"
          name="fetalHeartbeat"
          rules={[{ required: true, message: 'Please input the fetal heartbeat!' }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          label="Warning"
          name="warning"
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Checkup Date"
          name="createdAt"
          rules={[{ required: true, message: 'Please select the checkup date!' }]}
        >
          <DatePicker showTime format="YYYY-MM-DDTHH:mm:ss.SSSZ"/>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateFetalCheckupRecord;