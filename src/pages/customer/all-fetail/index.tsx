import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, Input, Modal } from 'antd';
import useFetalService from '../../../services/useFetalService';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../../utils/formatDate';
import FetalCreation from '../create-fetals';

export enum PregnancyStatus {
    PREGNANT = 'PREGNANT', // Đang mang thai
    BORN = 'BORN', // Đã sinh
    MISSED = 'MISSED', // Mất thai không có dấu hiệu
    STILLBIRTH = 'STILLBIRTH', // Thai chết lưu
    ABORTED = 'ABORTED', // Phá thai
    MISCARRIAGE = 'MISCARRIAGE', // Sảy thai
}

export enum AppointmentStatus {
    PENDING = 'PENDING', // Đang chờ xác nhận
    CONFIRMED = 'CONFIRMED', // Đã xác nhận
    CHECKED_IN = 'CHECKED_IN', // Bệnh nhân đã đến bệnh viện
    IN_PROGRESS = 'IN_PROGRESS', // Đang được khám
    COMPLETED = 'COMPLETED', // Đã hoàn tất
    CANCELED = 'CANCELED', // Đã hủy
    FAIL = 'FAIL', // Thất bại
}

// Ánh xạ trạng thái thai kỳ sang màu Tag
const statusColors: Record<PregnancyStatus, string> = {
    [PregnancyStatus.PREGNANT]: 'blue',
    [PregnancyStatus.BORN]: 'green',
    [PregnancyStatus.MISSED]: 'orange',
    [PregnancyStatus.STILLBIRTH]: 'red',
    [PregnancyStatus.ABORTED]: 'purple',
    [PregnancyStatus.MISCARRIAGE]: 'volcano',
};

// Ánh xạ trạng thái thai kỳ sang nhãn tiếng Việt
const statusLabels: Record<PregnancyStatus, string> = {
    [PregnancyStatus.PREGNANT]: 'Đang mang thai',
    [PregnancyStatus.BORN]: 'Đã sinh',
    [PregnancyStatus.MISSED]: 'Mất thai không có dấu hiệu',
    [PregnancyStatus.STILLBIRTH]: 'Thai chết lưu',
    [PregnancyStatus.ABORTED]: 'Phá thai',
    [PregnancyStatus.MISCARRIAGE]: 'Sảy thai',
};

// Ánh xạ trạng thái lịch hẹn sang màu và nhãn tiếng Việt
const appointmentStatusColors: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: 'gold',
    [AppointmentStatus.CONFIRMED]: 'blue',
    [AppointmentStatus.CHECKED_IN]: 'green',
    [AppointmentStatus.IN_PROGRESS]: 'purple',
    [AppointmentStatus.COMPLETED]: 'green',
    [AppointmentStatus.CANCELED]: 'red',
    [AppointmentStatus.FAIL]: 'volcano',
};

const appointmentStatusLabels: Record<AppointmentStatus, string> = {
    [AppointmentStatus.PENDING]: 'Đang chờ xác nhận',
    [AppointmentStatus.CONFIRMED]: 'Đã xác nhận',
    [AppointmentStatus.CHECKED_IN]: 'Đã đến bệnh viện',
    [AppointmentStatus.IN_PROGRESS]: 'Đang được khám',
    [AppointmentStatus.COMPLETED]: 'Đã hoàn tất',
    [AppointmentStatus.CANCELED]: 'Đã hủy',
    [AppointmentStatus.FAIL]: 'Thất bại',
};

const AllFetail = () => {
    const { getFetalsByMother } = useFetalService();
    const [fetals, setFetals] = useState<any[]>([]);
    const [filteredFetals, setFilteredFetals] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppointments, setSelectedAppointments] = useState<any[]>([]);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

    const navigate = useNavigate();

    const fetchFetalsByMother = async () => {
        const response = await getFetalsByMother();
        const sorted = response.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setFetals(sorted);
        setFilteredFetals(sorted);
    };
    useEffect(() => {
        fetchFetalsByMother();
    }, []);

    // Mở modal tạo hồ sơ thai nhi
    const showModal = () => {
        setIsModalOpen(true);
    };

    // Đóng modal tạo hồ sơ thai nhi và refresh danh sách nếu cần
    const handleClose = () => {
        setIsModalOpen(false);
        fetchFetalsByMother();
    };

    // Xử lý tìm kiếm theo tên thai kỳ
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        const filtered = fetals.filter(f =>
            f.name?.toLowerCase().includes(value)
        );
        setFilteredFetals(filtered);
    };

    // Mở modal lịch hẹn với danh sách appointments của bản ghi
    const showAppointmentModal = (appointments: any[]) => {
        setSelectedAppointments(appointments);
        setIsAppointmentModalOpen(true);
    };

    // Các cột cho bảng lịch hẹn (Modal)
    const appointmentColumns = [
        {
            title: 'Ngày hẹn',
            dataIndex: 'appointmentDate',
            key: 'appointmentDate',
            render: (date: string) => formatDate(date),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <Tag color={appointmentStatusColors[status as AppointmentStatus] || 'default'}>
                    {appointmentStatusLabels[status as AppointmentStatus] || status}
                </Tag>
            ),
            filters: Object.keys(appointmentStatusLabels).map((key) => ({
                text: appointmentStatusLabels[key as AppointmentStatus],
                value: key,
            })),
            onFilter: (value: string, record: any) => record.status === value,
        },
        {
            title: 'Bác sĩ',
            dataIndex: 'doctor',
            key: 'doctor',
            render: (doctor: any) =>
                doctor ? (
                    <div>
                        <div style={{ fontWeight: 600 }}>{doctor.fullName}</div>
                        <div>{doctor.email}</div>
                        <div>{doctor.phone}</div>
                    </div>
                ) : (
                    'N/A'
                ),
        },
    ];

    // Các cột cho bảng danh sách thai kỳ
    const columns = [
        {
            title: 'Tên thai kỳ',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'note',
            key: 'note',
        },
        {
            title: 'Ngày cuối kì kinh',
            dataIndex: 'dateOfPregnancyStart',
            key: 'dateOfPregnancyStart',
            render: (date: string) => formatDate(date),
        },
        {
            title: 'Ngày dự sinh',
            dataIndex: 'expectedDeliveryDate',
            key: 'expectedDeliveryDate',
            render: (date: string) => formatDate(date),
        },
        {
            title: 'Tình trạng sức khỏe',
            dataIndex: 'healthStatus',
            key: 'healthStatus',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            filters: Object.keys(statusLabels).map((key) => ({
                text: statusLabels[key as PregnancyStatus],
                value: key,
            })),
            onFilter: (value: string, record: any) => record.status === value,
            render: (status: string) => (
                <Tag color={statusColors[status as PregnancyStatus] || 'default'}>
                    {statusLabels[status as PregnancyStatus] || status}
                </Tag>
            ),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_: any, record: any) => (
                <Space>
                    <Button type="link" onClick={() => navigate(`/fetal/${record.id}`)}>
                        Chi tiết
                    </Button>
                    {record.appointments && record.appointments.length > 0 && (
                        <Button type="link" onClick={() => showAppointmentModal(record.appointments)}>
                            Xem lịch hẹn
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
                <h2 className="text-xl font-semibold">Danh sách thai kỳ</h2>
                <div className="flex flex-col md:flex-row gap-2">
                    <Input
                        placeholder="Tìm kiếm theo tên thai kỳ"
                        value={searchText}
                        onChange={handleSearch}
                        allowClear
                        className="w-full md:w-64"
                    />
                    <Button type="primary" onClick={showModal}>
                        Thêm Thai Nhi
                    </Button>
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={filteredFetals}
                rowKey="id"
                pagination={{ pageSize: 5 }}
                bordered
            />
            <FetalCreation open={isModalOpen} onClose={handleClose} />

            {/* Modal hiển thị danh sách lịch hẹn */}
            <Modal
                title="Lịch hẹn"
                open={isAppointmentModalOpen}
                onCancel={() => setIsAppointmentModalOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsAppointmentModalOpen(false)}>
                        Đóng
                    </Button>,
                ]}
            >
                <Table
                    columns={appointmentColumns}
                    dataSource={selectedAppointments}
                    rowKey="id"
                    pagination={false}
                    bordered
                />
            </Modal>
        </div>
    );
};

export default AllFetail;
