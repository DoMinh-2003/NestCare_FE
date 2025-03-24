import React, { useEffect, useState } from "react";
import { Button, message, Table, Form, Modal, Select, Tag, Popconfirm } from "antd";
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

const DoctorManageRequestAppointments: React.FC = () => {
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
            setAppointments(response.filter((item) => item.status.toUpperCase() == "PENDING"));
        }
    };

    console.log(appointments)
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


    // Cấu hình cột cho bảng chính
    const columns = [
        {
            title: "Hồ Sơ thai nhi",
            render: (record: any) => (
                <Link to={`/doctor/appointments/fetals/${record.fetalRecord.id}`} className="text-blue">
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
                    <Popconfirm
                        title="Bạn có chắc muốn duyệt cuộc hẹn này?"
                        okText="Đồng ý"
                        cancelText="Hủy"
                        onConfirm={() => handleChangeStatus(record, AppointmentStatus.CONFIRMED)}
                    >
                        <Button type="primary">Chấp nhận</Button>
                    </Popconfirm>

                    {/* Nút Từ chối */}
                    <Popconfirm
                        title="Bạn có chắc muốn từ chối cuộc hẹn này?"
                        okText="Đồng ý"
                        cancelText="Hủy"
                        onConfirm={() => handleChangeStatus(record, AppointmentStatus.CANCELED)}
                    >
                        <Button type="primary" danger>
                            Từ chối
                        </Button>
                    </Popconfirm>
                </div>
            ),
        },
    ];

    const handleRefresh = () => {
        getAppointmentFromDoctor();
    };



    return (
        <div>
            <h1 className="text-3xl font-extrabold text-center mb-5">
                Yêu cầu lịch khám
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

export default DoctorManageRequestAppointments;
