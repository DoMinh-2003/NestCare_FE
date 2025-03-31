import { useEffect, useState } from 'react';
import { Table, Input, Button, Modal, Form, message, Select } from 'antd';
import userAppointmentService from '../../../services/useAppointmentService';
import userUserService from '../../../services/userUserService';
import moment from 'moment';
import { appointmentStatus, getStatusTag } from '../checkin-appointment';
import useAppointmentService from '../../../services/useApoitment';
import { AppointmentStatus } from '../../../constants/status';
// types.ts

export interface AppointmentData {
    id: string;
    appointmentDate: string; // Ngày hẹn
    status: 'PENDING' | 'COMPLETED' | 'CANCELED'; // Trạng thái cuộc hẹn
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
    status: 'PENDING' | 'COMPLETED' | 'CANCELED'; // Trạng thái
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
    const { updateAppointmentsByStatus } = useAppointmentService()

    useEffect(() => {
        getDoctors();
    }, [])

    useEffect(() => {
        getAppointmentNeedToCancel();
    }, [doctorSelected, statusFilter, searchText])

    const today = moment().format('YYYY-MM-DD');

    const getAppointmentNeedToCancel = async () => {
        if (doctorSelected) {
            console.log("doctorSelected: ", doctorSelected)
            const response = await getAppointmentsByDoctorDate(doctorSelected, today, searchText, statusFilter)
            if (response) {
                setAppointments(response)
            }
        }
    }

    const handleSearch = (value: string) => {
        setSearchText(value);
    };

    const getDoctors = async () => {
        const response = await getUsers()
        if (response) {
            setDoctors(response.filter((item)=>item.role === 'doctor'))
        }
    }

    const handleCancelClick = (appointment: any) => {
        setSelectedAppointment(appointment);
        setIsModalVisible(true);
    };

    const handleCancel = async (values: string) => {
        const response = await updateAppointmentsByStatus("CANCELED", selectedAppointment.id, values)
        console.log("handleCancel: ", response)
        if (response) {
            message.success('Xoá lịch hẹn thành công!');
            setIsModalVisible(false);
            form.resetFields();
            getAppointmentNeedToCancel()
        }
    };

    const hasActiveAppointments = appoinments.some(appointment => appointment.status !== 'CANCELED');

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
            title: 'Tên người mẹ',
            render: (record: AppointmentData) => (
                <div>{record.fetalRecords[0].mother.fullName}</div>
            ),
        },
        {
            title: 'Trạng Thái', // Đổi tên thành "Trạng Thái"
            dataIndex: 'status',
            key: 'status',
            render:(status: AppointmentStatus)=> getStatusTag(status)
        },
        {
            title: 'Ngày Hẹn', // Đổi tên thành "Ngày Hẹn"
            dataIndex: 'appointmentDate',
            key: 'appointmentDate',
        },
        ...(hasActiveAppointments ? [{
            title: 'Hành Động',
            key: 'action',
            render: (text: any, record: any) => (
              <Button danger onClick={() => handleCancelClick(record)}>
                Hủy
              </Button>
            ),
          }] : []),
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
                    placeholder="Tìm kiếm bằng tên người mẹ"
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