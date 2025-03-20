// components/organisms/modal-add-services/ModalAddServices.tsx
import React, { useEffect, useState } from "react";
import { Modal, Form, Select, Button, message } from "antd";
import userAppointmentService from "../../../services/useAppointmentService";
import useServiceService from "../../../services/useServiceService";

const { Option } = Select;

interface ModalAddServicesProps {
    visible: boolean;
    onCancel: () => void;
    appointmentId: string | null;  // ID cuộc hẹn muốn thêm dịch vụ
    onSuccess: () => void;         // Callback để refresh sau khi thêm thành công
}

const ModalAddServices: React.FC<ModalAddServicesProps> = ({
    visible,
    onCancel,
    appointmentId,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const { getServices } = useServiceService();
    const { addServicesToAppointment } = userAppointmentService(); // Hàm cập nhật dịch vụ trong cuộc hẹn
    const [services, setServices] = useState<[]>([]);

    useEffect(() => {
        // Gọi API lấy danh sách dịch vụ
        const fetchServices = async () => {
            try {
                const res = await getServices();
                if (res?.data) {
                    setServices(res.data);
                }
            } catch (error) {
                console.error("Error fetching services", error);
            }
        };
        if (visible) {
            fetchServices();
            form.resetFields(); // Mỗi lần mở modal reset form
        }
    }, [visible, getServices, form]);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            // values.servicesSelected là mảng ID dịch vụ
            if (!appointmentId) return;
            const response = await addServicesToAppointment(appointmentId, values.servicesSelected);
            if (response) {
                onCancel();  // Đóng modal
                onSuccess(); // Gọi callback refresh danh sách
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Modal
            title="Thêm dịch vụ vào cuộc hẹn"
            visible={visible}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    name="servicesSelected"
                    label="Chọn dịch vụ"
                    rules={[{ required: true, message: "Vui lòng chọn ít nhất một dịch vụ!" }]}
                >
                    <Select mode="multiple" placeholder="Chọn dịch vụ">
                        {services.map((item) => (
                            <Option key={item.id} value={item.id}>
                                {item.name} - {item.price}đ
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <div style={{ textAlign: "right" }}>
                    <Button style={{ marginRight: 8 }} onClick={onCancel}>
                        Hủy
                    </Button>
                    <Button type="primary" onClick={handleOk}>
                        Xác nhận
                    </Button>
                </div>
            </Form>
        </Modal>
    );
};

export default ModalAddServices;
