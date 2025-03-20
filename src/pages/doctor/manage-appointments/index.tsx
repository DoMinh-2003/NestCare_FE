import React, { useEffect, useState } from "react";
import userUserService from "../../../services/userUserService";
import { Button, message, Table, Form, Image, Tag, Modal } from "antd";
import { EditOutlined } from '@ant-design/icons';
import ModalCreateUpdateUser, { UserData } from "../../../components/organisms/modal-create-update-user/ModalCreateUpdateUser";
import { tableText } from "../../../constants/function";
import { Link, Outlet } from "react-router-dom";
import userAppointmentService from "../../../services/useAppointmentService";
import { formatDate } from "../../../utils/formatDate";
import { AppointmentStatus } from "../../../constants/status";


const DoctorManageAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<[]>([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [currentDoctor, setCurrentDoctor] = useState(null);
    const [visible, setVisible] = useState(false);
    const { createUser, updateUser, getUsers } = userUserService();
    const { getAppointmentsByDoctor } = userAppointmentService();
    const [form] = Form.useForm(); // Create a form reference
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState<any[]>([]);
    const [modalTitle, setModalTitle] = useState("");
    const showModal = (user: UserData | null = null) => {
        if (user) {
            setCurrentUser(user);
        } else {
            setCurrentUser(null); // Reset currentUser  when adding a new user
            form.resetFields(); // Reset form fields when opening modal
        }
        setVisible(true);
    };

    const showDetails = (title: string, details: any[]) => {
        setModalTitle(title);
        setModalData(details);
        setModalVisible(true);
    };


    const handleCreateOrUpdate = async (values: UserData) => {
        console.log("handleCreateOrUpdate:", values);
        if (currentUser) {
            // Update user logic can be added here
            const response = await updateUser(values);
            if (response) {
                message.success("Cập nhật dùng thành công");
                getAppointmentFromDoctor();
                setVisible(false); // Close the modal only after successful creation
                form.resetFields(); // Reset the form fields
            }
        } else {
            // Create new user
            const response = await createUser(values);
            if (response) {
                message.success("Tạo người dùng thành công");
                getAppointmentFromDoctor();
                setVisible(false); // Close the modal only after successful creation
                form.resetFields(); // Reset the form fields
            }
        }
    };

    const handleCancel = () => {
        setVisible(false);
    };

    useEffect(() => {
        const userString = localStorage.getItem("user");

        if (userString) {
            try {
                const user = JSON.parse(userString);
                setCurrentDoctor(user)
                console.log("User object:", user);
            } catch (error) {
                console.error("Error parsing user data:", error);
            }
        }
        getAppointmentFromDoctor();
    }, []);

    const getAppointmentFromDoctor = async () => {
        const response = await getAppointmentsByDoctor("b11b4011-06a4-40cd-8191-ffe915baba5b");
        console.log("response: ", response);
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
    // Cấu hình cột cho bảng
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
            title: 'Được tạo vào',
            dataIndex: 'appointmentDate',
            key: 'appointmentDate',
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
            title: 'Hành động',
            render: (record: UserData) => (
                <div className="flex gap-2 text-xl">
                    <EditOutlined onClick={() => showModal(record)} className="text-blue" />
                </div>
            )
        },
    ];


    return (
        <div>
            <ModalCreateUpdateUser
                visible={visible}
                onCreate={handleCreateOrUpdate}
                onCancel={handleCancel}
                user={currentUser}
                form={form} // Pass the form reference to the modal
            />
            <Button onClick={() => showModal()} type="primary" style={{ marginBottom: 16 }}>
                Thêm người dùng
            </Button>
            <Modal title={modalTitle} visible={modalVisible} onCancel={() => setModalVisible(false)} footer={null}>
                {modalData.length ? (
                    <ul>
                        {modalData.map((item, index) => (
                            <li key={index}>{JSON.stringify(item)}</li>
                        ))}
                    </ul>
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </Modal>
            <Table rowClassName={() => tableText()} columns={columns} dataSource={appointments} rowKey="id" />
            <Outlet />
        </div>
    );
};

export default DoctorManageAppointments;