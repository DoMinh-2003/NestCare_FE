import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Select, Tag } from 'antd';
import useAppointmentService from '../../../services/useApoitment';
import type { GetProps } from 'antd';
import { Input } from 'antd';
import ModalUpdateMotherHealth from '../../../components/organisms/modal-update-mother-heal/ModalUpdateMotherHealth';
import { AppointmentStatus } from '../../../constants/status';
import { formatDate } from '../../../utils/formatDate';
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
interface doctor {
    fullName: string;
}
interface Appointment {
    id: string;
    appointmentDate: string;
    status: string;
    doctor: doctor
    fetalRecords: FetalRecord[];
}


const NurseCheckIn: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const { getAppointmentsByStatus, updateAppointmentsByStatus } = useAppointmentService()
    const [statusFilter, setStatusFilter] = useState<string>('PENDING')
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [appointmentId, setAppointmentId] = useState<string>('')

    useEffect(() => {
        getAppointmentsByStatusFromNurse();
    }, [statusFilter])

    const showModal = (id: string) => {
        setIsModalVisible(true);
        setAppointmentId(id)
    };

    const handleClose = () => {
        setIsModalVisible(false);
    };

    const getAppointmentsByStatusFromNurse = async () => {
        const response = await getAppointmentsByStatus(statusFilter)
        console.log("getAppointmentsByStatusFromNurse: ", response)
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
                const response = await updateAppointmentsByStatus("FAIL", appointmentId)
                if (response) {
                    message.success('Cuộc hẹn đã được từ chối!');
                }
            },
        });
    };

    const getStatusTag = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.PENDING:
                return <Tag color="orange">Đang chờ xác nhận</Tag>;
            case AppointmentStatus.CONFIRMED:
                return <Tag color="blue">Đã xác nhận</Tag>;
            case AppointmentStatus.CHECKED_IN:
                return <Tag color="cyan">Đã đến bệnh viện</Tag>;
            case AppointmentStatus.IN_PROGRESS:
                return <Tag color="purple">Đang khám</Tag>;
            case AppointmentStatus.COMPLETED:
                return <Tag color="green">Hoàn tất</Tag>;
            case AppointmentStatus.CANCELED:
                return <Tag color="red">Đã hủy</Tag>;
            default:
                return <Tag color="default">Không xác định</Tag>;
        }
    };

    const columns = [
        {
            title: 'Tên bác sĩ',
            dataIndex: ['doctor', 'fullName'],
            key: 'doctorName',
            width: "20%"
        },
        {
            title: 'Tên mẹ',
            width: "20%",
            render: (record: Appointment) => (
                <div>
                    {record.fetalRecords[0]?.mother.fullName}
                </div>
            )
        },
        {
            width: "20%",
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: AppointmentStatus) => getStatusTag(status),
        },
        {
            title: 'Ngày khám',
            dataIndex: 'appointmentDate',
            key: 'appointmentDate',
            width: "20%",
            render: (value: string) => formatDate(value),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (text: any, record: Appointment) => (
                record.status === "PENDING" ? <div className='flex gap-2'>
                    <Button className='bg-blue hover:bg-blue text-white' type="default" onClick={() => showModal(record.id)}>Cập nhật thông tin sức khoẻ</Button>
                    <Button type="primary" onClick={() => handleAccept(record.id)}>Chấp nhận</Button>
                    <Button type="danger" onClick={() => handleReject(record.id)} style={{ marginLeft: 8 }}>Từ chối</Button>
                </div>
                    : <div>
                        {record.status}
                    </div>
            ),
        },
    ];

    const handleChange = (value: string) => {
        setStatusFilter(value);
    }

    const handleSubmit = (response: any) => {
        if (response) {
            getAppointmentsByStatusFromNurse();
        }
    }

    const onSearch: SearchProps['onSearch'] = async (value, _e, info) => {
        const response = await getAppointmentsByStatus(statusFilter);
        console.log("response: ", response);
        if (response && value != '') {
            setAppointments(response.filter((item: Appointment) =>
                item.fetalRecords[0].mother.fullName.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
                    item.doctor.fullName.toLocaleLowerCase().includes(value.toLocaleLowerCase())
                )
            );
        } else {
            setAppointments(response);
        }
    }

    return (
        <div>
            <div className='text-3xl font-bold text-center my-5'>Quản lý cuộc hẹn</div>
            <div className='flex gap-2'>
                <div className='flex gap-2 mb-2'>
                    <Search placeholder="Tìm kiếm bằng tên" className='w-[200px]' onSearch={onSearch} enterButton />
                </div>
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
            </div>
            <ModalUpdateMotherHealth
                id={appointmentId}
                onSumit={handleSubmit}
                isVisible={isModalVisible}
                onClose={handleClose}
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