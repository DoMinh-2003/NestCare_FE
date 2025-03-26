import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Select } from 'antd';
import useAppointmentService from '../../../services/useApoitment';
import type { GetProps } from 'antd';
import { Input } from 'antd';
import { toast } from 'react-toastify';
type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;
interface FetalRecord {
    name: string;
    mother: {
        fullName: string;
    };
    doctor: {
        fullName: string;
    };
}

interface Appointment {
    id: string;
    appointmentDate: string;
    status: string;
    fetalRecord: FetalRecord;
}


const NurseCheckIn: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const { getAppointmentsByStatus, updateAppointmentsByStatus } = useAppointmentService()
    const [statusFilter, setStatusFilter] = useState<string>('CONFIRMED')

    useEffect(() => {
        getAppointmentsByStatusFromNurse();
    }, [statusFilter])

    const getAppointmentsByStatusFromNurse = async () => {
        const response = await getAppointmentsByStatus(statusFilter)
        if (response) {
            setAppointments(response)
        }
    }
    const handleAccept = (appointmentId: string) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có chắc chắn muốn chấp nhận cuộc hẹn này?',
            onOk: async () => {
                const response = await updateAppointmentsByStatus("CHECKED_IN", appointmentId)
                if (response) {
                    message.success('Cuộc hẹn đã được chấp nhận!');
                }
                // Cập nhật trạng thái trong state nếu cần
            },
        });
    };

    const handleReject = (appointmentId: string) => {
        Modal.confirm({
            title: 'Xác nhận',
            content: 'Bạn có chắc chắn muốn từ chối cuộc hẹn này?',
            onOk: async () => {
                const response = await updateAppointmentsByStatus("CANCELED", appointmentId)
                if (response) {
                    message.success('Cuộc hẹn đã được từ chối!');
                }
            },
        });
    };

    const columns = [
        {
            title: 'Tên mẹ',
            dataIndex: ['fetalRecord', 'mother', 'fullName'],
            key: 'motherName',
        },
        {
            title: 'Tên bác sĩ',
            dataIndex: ['doctor', 'fullName'],
            key: 'doctorName',
        },
        {
            title: 'Tên bé',
            dataIndex: ['fetalRecord', 'name'],
            key: 'babyName',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text: any, record: Appointment) => (
                record.status === "CONFIRMED" ? <span>
                    <Button type="primary" onClick={() => handleAccept(record.id)}>Chấp nhận</Button>
                    <Button type="danger" onClick={() => handleReject(record.id)} style={{ marginLeft: 8 }}>Từ chối</Button>
                </span>
                    : <div>
                        {record.status}
                    </div>
            ),
        },
    ];
    const handleChange = (value: string) => {
        setStatusFilter(value);
    }

    return (
        <div>
            <div className='text-3xl font-bold text-center my-5'>Quản lý cuộc hẹn</div>
            <Select
                placeholder="Chọn gói dịch vụ"
                onChange={handleChange}
                className='w-[150px] mb-2'
                defaultValue={"CONFIRMED"}
                options={
                    appointmentStatus.map((item) => (
                        { value: item.value, label: item.label }
                    ))
                }
            />
            <Table dataSource={appointments} columns={columns} rowKey="id" />
        </div>
    );
};

export const appointmentStatus = [
    { label: "Đang chờ xác nhận", value: "PENDING" },
    { label: "Đã xác nhận", value: "CONFIRMED" },
    { label: "Đã đến bệnh viện", value: "CHECKED_IN" },
    { label: "Đang khám", value: "IN_PROGRESS" },
    { label: "Hoàn tất", value: "COMPLETED" },
    { label: "Đã hủy", value: "CANCELED" },
];

export default NurseCheckIn;