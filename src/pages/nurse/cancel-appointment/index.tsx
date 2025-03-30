import React, { useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, message, Select } from 'antd';
import userAppointmentService from '../../../services/useAppointmentService';
import userUserService from '../../../services/userUserService';
import moment from 'moment';
import { appointmentStatus } from '../appointment';
// types.ts

export interface AppointmentData {
    id: string;
    appointmentDate: string; // Ngày hẹn
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED'; // Trạng thái cuộc hẹn
    fetalRecords: FetalRecord[]; // Danh sách hồ sơ thai nhi
    doctor: Doctor; // Thông tin bác sĩ
    appointmentServices: any[]; // Dịch vụ liên quan đến cuộc hẹn (nếu có)
    medicationBills: any[]; // Hóa đơn thuốc (nếu có)
    slot: AppointmentSlot; // Thông tin về thời gian cuộc hẹn
    history: AppointmentHistory[]; // Lịch sử thay đổi trạng thái cuộc hẹn
}

export interface FetalRecord {
    id: string;
    name: string; // Tên thai nhi
    note: string; // Ghi chú
    dateOfPregnancyStart: string; // Ngày bắt đầu thai kỳ
    expectedDeliveryDate: string; // Ngày dự sinh
    actualDeliveryDate: string | null; // Ngày sinh thực tế (nếu có)
    healthStatus: string; // Tình trạng sức khỏe
    status: 'PREGNANT' | 'DELIVERED'; // Trạng thái thai nhi
    isDeleted: number; // Trạng thái xóa
    createdAt: string; // Ngày tạo
    updatedAt: string; // Ngày cập nhật
    checkupRecords: CheckupRecord[]; // Danh sách hồ sơ kiểm tra
    mother: Mother; // Thông tin mẹ
}

export interface CheckupRecord {
    id: string;
    motherWeight: string; // Cân nặng của mẹ
    motherBloodPressure: string; // Huyết áp của mẹ
    motherHealthStatus: string; // Tình trạng sức khỏe của mẹ
    fetalWeight: string | null; // Cân nặng thai nhi
    fetalHeight: string | null; // Chiều cao thai nhi
    fetalHeartbeat: string | null; // Nhịp tim thai nhi
    warning: string | null; // Cảnh báo
    createdAt: string; // Ngày tạo hồ sơ kiểm tra
}

export interface Mother {
    id: string;
    username: string; // Tên đăng nhập
    password: string; // Mật khẩu
    email: string; // Địa chỉ email
    fullName: string; // Họ và tên
    image: string | null; // Hình ảnh (nếu có)
    phone: string; // Số điện thoại
    role: 'user'; // Vai trò
    isDeleted: boolean; // Trạng thái xóa
}

export interface Doctor {
    id: string;
    username: string; // Tên đăng nhập
    password: string; // Mật khẩu
    email: string; // Địa chỉ email
    fullName: string; // Họ và tên
    image: string; // Hình ảnh
    phone: string; // Số điện thoại
    role: 'doctor'; // Vai trò
    isDeleted: boolean; // Trạng thái xóa
}

export interface AppointmentSlot {
    id: string;
    startTime: string; // Thời gian bắt đầu
    endTime: string; // Thời gian kết thúc
    isActive: boolean; // Trạng thái hoạt động
    createdAt: string; // Ngày tạo
    updatedAt: string; // Ngày cập nhật
}

export interface AppointmentHistory {
    id: string;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED'; // Trạng thái
    notes: string | null; // Ghi chú
    createdAt: string; // Ngày tạo
    changedBy: User; // Người thay đổi trạng thái
}

export interface User {
    id: string;
    username: string; // Tên đăng nhập
    password: string; // Mật khẩu
    email: string; // Địa chỉ email
    fullName: string; // Họ và tên
    image: string; // Hình ảnh
    phone: string; // Số điện thoại
    role: 'nurse' | 'doctor' | 'user'; // Vai trò
    isDeleted: boolean; // Trạng thái xóa
}

const CancelAppointment = () => {
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [form] = Form.useForm();
    const [doctorSelected, setDoctorSelected] = useState<string>('')
    const { getAppointmentsByDoctorDate } = userAppointmentService()
    const [appoinments, setAppointments] = useState<AppointmentData[]>([])
    const [doctors, setDoctors] = useState<Doctor[]>([])
    const { getUsers } = userUserService()
    const [statusFilter, setStatusFilter] = useState<string>('PENDING')

    useEffect(() => {
        getDoctors();
    }, [])

    useEffect(() => {
        getAppointmentNeedToCancel();
    }, [doctorSelected])

    const today = moment().format('YYYY-MM-DD');

    const getAppointmentNeedToCancel = async () => {
        console.log("doctorSelected: ", doctorSelected)
        const response = await getAppointmentsByDoctorDate(doctorSelected, today, searchText, statusFilter)
        if (response) {
            setAppointments(response)
        }
    }

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    const getDoctors = async () => {
        const response = await getUsers()
        if (response) {
            setDoctors(response)
        }
    }

    const handleCancelClick = (appointment: any) => {
        setSelectedAppointment(appointment);
        setIsModalVisible(true);
    };

    const handleCancel = async (values: { reason: string }) => {
        // Call your cancel appointment API here
        // Example: await cancelAppointment(selectedAppointment.id, values.reason);
        console.log('Canceling appointment:', selectedAppointment.id, 'Reason:', values.reason);

        // Simulate a successful cancel
        message.success('Appointment canceled successfully!');
        setIsModalVisible(false);
        form.resetFields();
    };

    //   const filteredAppointments = appointments.filter(appointment =>
    //     appointment.doctor.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
    //     appointment.status.toLowerCase().includes(searchText.toLowerCase())
    //   );

    const columns = [
        {
            title: 'Bác Sĩ', // Đổi tên thành "Bác Sĩ"
            dataIndex: 'doctor',
            key: 'doctor',
            render: (text: any) => (
                <div>{text.fullName}</div>
            ),
        },
        {
            title: 'Trạng Thái', // Đổi tên thành "Trạng Thái"
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Ngày Hẹn', // Đổi tên thành "Ngày Hẹn"
            dataIndex: 'appointmentDate',
            key: 'appointmentDate',
        },
        {
            title: 'Hành Động', // Đổi tên thành "Hành Động"
            key: 'action',
            render: (record: any) => (
                <Button danger onClick={() => handleCancelClick(record)}>
                    Hủy
                </Button>
            ),
        },
    ];

    const handleChangeDoctor = (value: string) => {
        setDoctorSelected(value);
    };

    const handleChange = (value: string) => {
        setStatusFilter(value);
    }

    return (
        <div>
            <div className='text-3xl font-bold text-center my-5'>Huỷ cuộc hẹn</div>
            <div className='flex gap-2'>
                <Select
                    defaultValue="Chọn bác sĩ"
                    style={{ textAlign: 'left' }}
                    onChange={handleChangeDoctor}

                    options={
                        doctors.map((item) =>
                            ({ value: item.id, label: item.fullName })
                        )}
                />

                <Select
                    placeholder="Chọn gói dịch vụ"
                    onChange={handleChange}
                    className='w-[150px] mb-2'
                    defaultValue={"PENDING"}
                    options={
                        appointmentStatus.map((item) => (
                            { value: item.value, label: item.label }
                        ))
                    }
                />

                <Input.Search
                    placeholder="Search by doctor name or status"
                    onSearch={handleSearch}
                    className='w-[250px]'
                    style={{ marginBottom: 16 }}
                />
            </div>
            <Table
                dataSource={appoinments}
                columns={columns}
                rowKey="id"
            />
            <Modal
                title="Cancel Appointment"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleCancel}>
                    <Form.Item
                        label="Reason"
                        name="reason"
                        rules={[{ required: true, message: 'Please provide a reason for cancellation!' }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Confirm Cancel
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default CancelAppointment;