import React, { useEffect, useState } from "react";
import { Button, message, Table, Form, Tag, Modal } from "antd";
import { Link, Outlet } from "react-router-dom";
import userAppointmentService from "../../../services/useAppointmentService";
import { formatDate } from "../../../utils/formatDate";
import { AppointmentStatus } from "../../../constants/status";
import { tableText } from "../../../constants/function";
import { formatMoney } from "../../../utils/formatMoney";
import ModalCreateReminder from "../../../components/organisms/modal-create-reminder/ModalCreateReminder";
import userReminderService from "../../../services/useReminders";

const DoctorManageAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<[]>([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentDoctor, setCurrentDoctor] = useState(null);
    const [visible, setVisible] = useState(false);
    const { getAppointmentsByDoctor } = userAppointmentService();
    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState<any[]>([]);
    const [modalTitle, setModalTitle] = useState("");
    const { createReminderByDoctor } = userReminderService();
    const [reminderModalVisible, setReminderModalVisible] = useState(false);
    const [motherId, setMotherId] = useState<string | null>(null);

    // Hàm mở modal chi tiết với dữ liệu dạng bảng
    const showDetails = (title: string, details: any[]) => {
        setModalTitle(title);
        setModalData(details);
        setModalVisible(true);
    };


    const handleCancel = () => {
        setVisible(false);
    };

    useEffect(() => {
        const userString = localStorage.getItem("USER");
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

    const getAppointmentFromDoctor = async () => {
        if (!currentDoctor) return;
        const response = await getAppointmentsByDoctor(currentDoctor.id);
        console.log(response)
        if (response) {
            setAppointments(response.filter((item) => !item.isDeleted));
        }
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

    const handleCreateReminder = async (values: any) => {
        const response = await createReminderByDoctor(values);
        if (response) {
            message.success("Tạo nhắc nhở thành công!");
            setReminderModalVisible(false);
        } else {
            message.error("Tạo nhắc nhở thất bại!");
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
            )
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
            render: (value: AppointmentStatus) => getStatusTag(value),
        },
        {
            title: "Dịch vụ",
            dataIndex: "appointmentServices",
            key: "appointmentServices",
            render: (services: any[]) => (
                <Button onClick={() => showDetails("Dịch vụ khám", services)} disabled={!services.length}>
                    Xem
                </Button>
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
            )
        }

    ];

    // Hàm xác định cấu hình cột cho Modal dựa trên modalTitle
    const getModalColumns = () => {
        switch (modalTitle) {
            case "Dịch vụ khám":
                return [
                    { title: "Tên dịch vụ", dataIndex: "notes", key: "notes" },
                    { title: "Giá", dataIndex: "price", key: "price", render: (value: number) => formatMoney(value) },
                ];
            case "Hóa đơn thuốc":
                return [
                    { title: "Tên thuốc", dataIndex: "medicationName", key: "medicationName" },
                    { title: "Liều lượng", dataIndex: "dosage", key: "dosage" },
                    { title: "Giá", dataIndex: "price", key: "price" },
                ];
            case "Lịch sử khám":
                return [
                    { title: "Ngày khám", dataIndex: "createdAt", key: "createdAt", render: (text: string) => formatDate(text) },
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


            {/* Modal hiển thị dữ liệu dạng bảng */}
            <Modal
                title={modalTitle}
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={1400}  // Tùy chỉnh kích thước Modal nếu cần
            >
                {modalData.length ? (
                    <Table
                        dataSource={modalData}
                        columns={getModalColumns()}
                        rowKey="id"  // Đảm bảo dữ liệu có thuộc tính id hoặc thay đổi theo dữ liệu của bạn
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
