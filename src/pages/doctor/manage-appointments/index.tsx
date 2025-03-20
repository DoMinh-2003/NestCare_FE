import React, { useEffect, useState } from "react";
import { Button, message, Table, Form, Modal, Select, Tag } from "antd";
import { Link, Outlet } from "react-router-dom";
import userAppointmentService from "../../../services/useAppointmentService";
import { formatDate } from "../../../utils/formatDate";
import { AppointmentStatus } from "../../../constants/status";
import { tableText } from "../../../constants/function";
import { formatMoney } from "../../../utils/formatMoney";
import ModalCreateReminder from "../../../components/organisms/modal-create-reminder/ModalCreateReminder";
import userReminderService from "../../../services/useReminders";
import useServiceService from "../../../services/useServiceService";
import ModalAddServices from "../../../components/organisms/modal-add-service-of-appointment";

const { Option } = Select;

const DoctorManageAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<[]>([]);
    const [services, setServices] = useState<[]>([]);
    const [currentDoctor, setCurrentDoctor] = useState(null);
    const [visible, setVisible] = useState(false);
    const { getAppointmentsByDoctor, updateAppointmentStatus } = userAppointmentService();
    const [form] = Form.useForm();
    const { getServices } = useServiceService();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState<any[]>([]);
    const [modalTitle, setModalTitle] = useState("");
    const { createReminderByDoctor } = userReminderService();
    const [reminderModalVisible, setReminderModalVisible] = useState(false);
    const [motherId, setMotherId] = useState<string | null>(null);
    const [addServiceModalVisible, setAddServiceModalVisible] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

    // Lấy danh sách cuộc hẹn
    const getAppointmentFromDoctor = async () => {
        if (!currentDoctor) return;
        const response = await getAppointmentsByDoctor(currentDoctor.id);
        if (response) {
            setAppointments(response.filter((item) => !item.isDeleted));
        }
    };

    // Khi đổi trạng thái
    const handleChangeStatus = async (record: any, newStatus: AppointmentStatus) => {
        try {
            await updateAppointmentStatus(record.id, newStatus);
            message.success("Cập nhật trạng thái thành công!");
            getAppointmentFromDoctor(); // gọi lại để refresh danh sách
        } catch (error) {
            message.error("Cập nhật trạng thái thất bại!");
        }
    };

    const openAddServiceModal = (record: any) => {
        setSelectedAppointmentId(record.id); // Lưu id cuộc hẹn
        setAddServiceModalVisible(true);
    };



    // Hiển thị chi tiết (Modal bảng con)
    const showDetails = (title: string, details: any[]) => {
        setModalTitle(title);
        setModalData(details);
        setModalVisible(true);
    };

    // Tạo nhắc nhở
    const handleCreateReminder = async (values: any) => {
        const response = await createReminderByDoctor(values);
        if (response) {
            message.success("Tạo nhắc nhở thành công!");
            setReminderModalVisible(false);
        } else {
            message.error("Tạo nhắc nhở thất bại!");
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };



    useEffect(() => {
        const userString = localStorage.getItem("USER");
        const fetchService = async () => {
            const response = await getServices();
            console.log(response);
            setServices(response.data);
        }
        fetchService();
        if (userString) {
            try {
                const user = JSON.parse(userString);
                setCurrentDoctor(user);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (currentDoctor) {
            getAppointmentFromDoctor();
        }
    }, [currentDoctor]);

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

    // Cấu hình cột cho bảng chính
    const columns = [
        {
            title: "Hồ Sơ thai nhi",
            render: (record: any) => (
                <Link to={`fetals/${record.fetalRecord.id}`} className="text-blue">
                    Xem hồ sơ
                </Link>
            ),
        },
        {
            title: "Được tạo vào",
            dataIndex: "appointmentDate",
            key: "appointmentDate",
            render: (date: string) => formatDate(date),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            // Thay Tag bằng Select
            render: (value: AppointmentStatus, record: any) => (
                <Select
                    style={{ width: 180 }}
                    value={value}
                    onChange={(newStatus) => handleChangeStatus(record, newStatus)}
                >
                    <Option value={AppointmentStatus.PENDING}>
                        {getStatusTag(AppointmentStatus.PENDING)}
                    </Option>
                    <Option value={AppointmentStatus.CONFIRMED}>
                        {getStatusTag(AppointmentStatus.CONFIRMED)}
                    </Option>
                    <Option value={AppointmentStatus.CHECKED_IN}>
                        {getStatusTag(AppointmentStatus.CHECKED_IN)}
                    </Option>
                    <Option value={AppointmentStatus.IN_PROGRESS}>
                        {getStatusTag(AppointmentStatus.IN_PROGRESS)}
                    </Option>
                    <Option value={AppointmentStatus.COMPLETED}>
                        {getStatusTag(AppointmentStatus.COMPLETED)}
                    </Option>
                    <Option value={AppointmentStatus.CANCELED}>
                        {getStatusTag(AppointmentStatus.CANCELED)}
                    </Option>
                </Select>

            ),
        },
        {
            title: "Dịch vụ",
            dataIndex: "appointmentServices",
            key: "appointmentServices",
            render: (services: any[], record: any) => (
                <>
                    <Button onClick={() => showDetails("Dịch vụ khám", services)} disabled={!services.length}>
                        Xem
                    </Button>

                    <Button
                        style={{ marginLeft: 8 }}
                        onClick={() => openAddServiceModal(record)}
                    >
                        Thêm dịch vụ
                    </Button>
                </>
            ),
        },
        {
            title: "Hóa đơn thuốc",
            dataIndex: "medicationBills",
            key: "medicationBills",
            render: (bills: any[]) => (
                <Button onClick={() => showDetails("Hóa đơn thuốc", bills)} disabled={!bills.length}>
                    Xem
                </Button>
            ),
        },
        {
            title: "Lịch sử khám",
            dataIndex: "fullHistory",
            key: "fullHistory",
            render: (history: any[]) => (
                <Button onClick={() => showDetails("Lịch sử khám", history)} disabled={!history.length}>
                    Xem
                </Button>
            ),
        },
        {
            title: "Hành động",
            render: (record: any) => (
                <div className="flex gap-2 text-xl">
                    <Button
                        type="primary"
                        onClick={() => {
                            // Lấy motherId từ record
                            const mId = record.fetalRecord?.mother?.id;
                            if (mId) {
                                setMotherId(mId);
                            }
                            setReminderModalVisible(true);
                        }}
                    >
                        Tạo nhắc nhở
                    </Button>
                </div>
            ),
        },
    ];

    const handleRefresh = () => {
        getAppointmentFromDoctor();
    };

    // Cấu hình cột cho Modal (bảng con)
    const getModalColumns = () => {
        switch (modalTitle) {
            case "Dịch vụ khám":
                return [
                    { title: "Tên dịch vụ", dataIndex: "notes", key: "notes" },
                    {
                        title: "Giá",
                        dataIndex: "price",
                        key: "price",
                        render: (value: number) => formatMoney(value),
                    },
                ];
            case "Hóa đơn thuốc":
                return [
                    { title: "Tên thuốc", dataIndex: "medicationName", key: "medicationName" },
                    { title: "Liều lượng", dataIndex: "dosage", key: "dosage" },
                    { title: "Giá", dataIndex: "price", key: "price" },
                ];
            case "Lịch sử khám":
                return [
                    {
                        title: "Ngày khám",
                        dataIndex: "createdAt",
                        key: "createdAt",
                        render: (text: string) => formatDate(text),
                    },
                    { title: "Nhịp tim thai nhi (bpm)", dataIndex: "fetalHeartbeat", key: "fetalHeartbeat" },
                    { title: "Chiều cao thai nhi (cm)", dataIndex: "fetalHeight", key: "fetalHeight" },
                    { title: "Trọng lượng thai nhi (kg)", dataIndex: "fetalWeight", key: "fetalWeight" },
                    { title: "Huyết áp mẹ (mmHg)", dataIndex: "motherBloodPressure", key: "motherBloodPressure" },
                    { title: "Sức khỏe mẹ", dataIndex: "motherHealthStatus", key: "motherHealthStatus" },
                    { title: "Cân nặng mẹ (kg)", dataIndex: "motherWeight", key: "motherWeight" },
                    { title: "Cảnh báo", dataIndex: "warning", key: "warning" },
                ];
            default:
                return [];
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-extrabold text-center mb-5">
                Quản lí lịch khám
            </h1>
            <ModalAddServices
                visible={addServiceModalVisible}
                onCancel={() => setAddServiceModalVisible(false)}
                appointmentId={selectedAppointmentId}
                onSuccess={handleRefresh}
            />
            {/* Modal hiển thị dữ liệu dạng bảng */}
            <Modal
                title={modalTitle}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={1400}
            >
                {modalData.length ? (
                    <Table
                        dataSource={modalData}
                        columns={getModalColumns()}
                        rowKey="id"
                        pagination={false}
                    />
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </Modal>

            <ModalCreateReminder
                visible={reminderModalVisible}
                onCancel={() => setReminderModalVisible(false)}
                onCreate={handleCreateReminder}
                motherId={motherId}
            />

            <Table
                rowClassName={() => tableText()}
                columns={columns}
                dataSource={appointments}
                rowKey="id"
            />
            <Outlet />
        </div>
    );
};

export default DoctorManageAppointments;
