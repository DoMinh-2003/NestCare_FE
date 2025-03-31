import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, message, Select, Tag, DatePicker } from 'antd';
import useAppointmentService from '../../../services/useApoitment';
import type { DatePickerProps, GetProps } from 'antd';
import { Input } from 'antd';
import { AppointmentStatus } from '../../../constants/status';
import { formatDate } from '../../../utils/formatDate';
import userAppointmentService from '../../../services/useAppointmentService';
import moment from 'moment';
import dayjs from 'dayjs';
import { Slot } from '../../../model/Slot';

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;
interface FetalRecord {
    name: string;
    mother: {
        fullName: string;
        username: string;
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
    const { updateAppointmentsByStatus } = useAppointmentService()
    const { getAppointmentsByDate } = userAppointmentService();
    const [day, setDay] = useState<string>('')
    const today = dayjs();
    useEffect(() => {
        getAppointmentsByStatusFromNurse();
    }, [day])

    useEffect(() => {
        const today = moment().format('YYYY-MM-DD');
        console.log(today)
        setDay(today);
    }, [])

    const getAppointmentsByStatusFromNurse = async () => {
        if (day) {
            const response = await getAppointmentsByDate(day, '', "PENDING")
            console.log("getAppointmentsByStatusFromNurse: ", response)
            if (response) {
                setAppointments(response)
            }
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
                    getAppointmentsByStatusFromNurse()
                }
                // Cập nhật trạng thái trong state nếu cần
            },
        });
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
            width: "25%",
            render: (record: Appointment) => (
                <div>
                    {record.fetalRecords[0]?.mother.fullName}
                </div>
            )
        },
        {
            title: 'Slot',
            dataIndex: 'slot',
            key: 'slot',
            render: (slot: Slot) => (
                <div>{slot.startTime} - {slot.endTime}</div>
            ),
            width: "20%"
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
            render: (record: Appointment) => (<div className='flex gap-2'>
                    <Button type="primary" onClick={() => handleAccept(record.id)}>Chấp nhận</Button>
                </div>
            ),
        },
    ];

    const onSearch: SearchProps['onSearch'] = async (value, _e) => {
        console.log(day, value, "PENDING")
        const response = await getAppointmentsByDate(day, value, "PENDING")
        console.log("response: ", response);
        setAppointments(response);
        // if (response && value != '') {
        //     setAppointments(response.filter((item: Appointment) =>
        //         item.fetalRecords[0].mother.fullName.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
        //             item.doctor.fullName.toLocaleLowerCase().includes(value.toLocaleLowerCase()) ||
        //             item.fetalRecords[0].mother.username.toLocaleLowerCase().includes(value.toLocaleLowerCase()) 
        //         )
        //     );
        // } else {
        //     setAppointments(response);
        // }
    }

    const onChange: DatePickerProps['onChange'] = (date, dateString) => {
        console.log(date, dateString);
        if (typeof dateString === 'string') {
            setDay(dateString)
        }
    };

    return (
        <div>
            <div className='text-3xl font-bold text-center my-5'>Xác nhận cuộc hẹn</div>
            <div className='flex gap-2'>
                <div className='flex gap-2 mb-2'>
                    <Search placeholder="Tìm kiếm bằng tên mẹ" className='w-[250px]' onSearch={onSearch} enterButton />
                </div>
                <div>
                    <DatePicker defaultValue={today} format="YYYY-MM-DD" onChange={onChange} />
                </div>
            </div>
            <Table dataSource={appointments} columns={columns} rowKey="id" />
        </div>
    );
};

export const appointmentStatus = [
    { label: "Đang đặt cọc", value: "AWAITING_DEPOSIT" },
    { label: "Đang chờ xác nhận", value: "PENDING" },
    { label: "Đã xác nhận", value: "CONFIRMED" },
    { label: "Đã đến bệnh viện", value: "CHECKED_IN" },
    { label: "Đang khám", value: "IN_PROGRESS" },
    { label: "Hoàn tất", value: "COMPLETED" },
    { label: "Đã hủy", value: "CANCELED" },
];

export const getStatusTag = (status: AppointmentStatus) => {
    switch (status) {
        case AppointmentStatus.AWAITING_DEPOSIT:
            return <Tag color="purple">Đang đặt cọc</Tag>;
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

export default NurseCheckIn;