
import type React from "react"
import { useEffect, useState } from "react"
import { Button, message, Table, Form, Modal, Select, Tag, Space, Dropdown, Menu, Typography, DatePicker } from "antd"
import { Link, Outlet, useNavigate } from "react-router-dom"
import userAppointmentService from "../../../services/useAppointmentService"
import { formatDate } from "../../../utils/formatDate"
import { AppointmentStatus, PregnancyStatus } from "../../../constants/status"
import { tableText } from "../../../constants/function"
import { formatMoney } from "../../../utils/formatMoney"
import ModalCreateReminder from "../../../components/organisms/modal-create-reminder/ModalCreateReminder"
import userReminderService from "../../../services/useReminders"
import useServiceService from "../../../services/useServiceService"
import ModalAddServices from "../../../components/organisms/modal-add-service-of-appointment"
import { DownOutlined, FileTextOutlined } from "@ant-design/icons"
import moment from "moment"
import ModalCreateFetalCheckupRecord from "../../../components/organisms/modal-create-checup-record/ModalCreateFetalCheckupRecord"

const { Option } = Select
const { Text } = Typography

interface FetalRecord {
    id: string
    name: string
    note: string
    dateOfPregnancyStart: string
    expectedDeliveryDate: string
    actualDeliveryDate: string | null
    healthStatus: string
    status: PregnancyStatus
    mother: {
        id: string
        fullName: string
        email: string
        phone: string
    }
}

interface Appointment {
    id: string
    appointmentDate: string
    status: AppointmentStatus
    fetalRecords: FetalRecord[]
    appointmentServices: any[]
    medicationBills: any[]
    fullHistory: any[]
    isDeleted: boolean
}

const DoctorManageAppointments: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [services, setServices] = useState<[]>([])
    const [currentDoctor, setCurrentDoctor] = useState(null)
    const [visible, setVisible] = useState(false)
    const { getAppointmentsByDoctor, updateAppointmentStatus } = userAppointmentService()
    const [selectedDate, setSelectedDate] = useState(moment(new Date()).format("YYYY-MM-DD"))
    const [statusFilter, setStatusFilter] = useState<AppointmentStatus | null>('CHECKED_IN')
    const [form] = Form.useForm()
    const { getServices } = useServiceService()
    const [modalVisible, setModalVisible] = useState(false)
    const [modalData, setModalData] = useState<any[]>([])
    const [modalTitle, setModalTitle] = useState("")
    const { createReminderByDoctor } = userReminderService()
    const [reminderModalVisible, setReminderModalVisible] = useState(false)
    const [motherId, setMotherId] = useState<string | null>(null)
    const [addServiceModalVisible, setAddServiceModalVisible] = useState(false)
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
    const [fetalModalVisible, setFetalModalVisible] = useState(false)
    const [selectedFetalRecords, setSelectedFetalRecords] = useState<FetalRecord[]>([])

    const navigate = useNavigate()

    // Lấy danh sách cuộc hẹn
    const getAppointmentFromDoctor = async () => {
        if (!currentDoctor) return
        try {
            const response = await getAppointmentsByDoctor(currentDoctor.id, selectedDate, statusFilter)
            if (response) {
                setAppointments(response.filter((item) => !item.isDeleted))
            }
        } catch (error) {
            message.error("Không thể tải danh sách cuộc hẹn")
        }
    }

    // Khi đổi trạng thái
    const handleChangeStatus = async (record: Appointment, newStatus: AppointmentStatus) => {
        try {
            await updateAppointmentStatus(record.id, newStatus)
            message.success("Cập nhật trạng thái thành công!")
            getAppointmentFromDoctor() // gọi lại để refresh danh sách
        } catch (error) {
            message.error("Cập nhật trạng thái thất bại!")
        }
    }

    const openAddServiceModal = (record: Appointment) => {
        setSelectedAppointmentId(record.id) // Lưu id cuộc hẹn
        setAddServiceModalVisible(true)
    }

    // Hiển thị chi tiết (Modal bảng con)
    const showDetails = (title: string, details: any[]) => {
        setModalTitle(title)
        setModalData(details)
        setModalVisible(true)
    }

    // Hiển thị danh sách thai nhi
    const showFetalRecords = (fetalRecords: FetalRecord[]) => {
        setSelectedFetalRecords(fetalRecords)
        setFetalModalVisible(true)
    }

    // Tạo nhắc nhở
    const handleCreateReminder = async (values: any) => {
        try {
            const response = await createReminderByDoctor(values)
            if (response) {
                message.success("Tạo nhắc nhở thành công!")
                setReminderModalVisible(false)
            } else {
                message.error("Tạo nhắc nhở thất bại!")
            }
        } catch (error) {
            message.error("Tạo nhắc nhở thất bại!")
        }
    }

    const handleCancel = () => {
        setVisible(false)
    }

    const navigateToFetalDetail = (fetalId: string) => {
        navigate(`fetals/${fetalId}`)
    }

    useEffect(() => {
        const userString = localStorage.getItem("USER")
        const fetchService = async () => {
            try {
                const response = await getServices()
                setServices(response.data)
            } catch (error) {
                message.error("Không thể tải danh sách dịch vụ")
            }
        }
        fetchService()
        if (userString) {
            try {
                const user = JSON.parse(userString)
                setCurrentDoctor(user)
            } catch (error) {
                console.error("Error parsing user data:", error)
            }
        }
    }, [])

    useEffect(() => {
        if (currentDoctor) {
            getAppointmentFromDoctor()
        }
    }, [currentDoctor, selectedDate, statusFilter])


    const getStatusTag = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.CHECKED_IN:
                return <Tag color="cyan">Đã đến bệnh viện</Tag>
            case AppointmentStatus.IN_PROGRESS:
                return <Tag color="purple">Đang khám</Tag>
            case AppointmentStatus.COMPLETED:
                return <Tag color="green">Hoàn tất</Tag>
            case AppointmentStatus.CANCELED:
                return <Tag color="red">Đã hủy</Tag>
            default:
                return <Tag color="default">Không xác định</Tag>
        }
    }

    const getPregnancyStatusTag = (status: PregnancyStatus) => {
        switch (status) {
            case PregnancyStatus.PREGNANT:
                return <Tag color="blue">Đang mang thai</Tag>
            case PregnancyStatus.BORN:
                return <Tag color="green">Đã sinh</Tag>
            case PregnancyStatus.MISSED:
                return <Tag color="orange">Mất thai không có dấu hiệu</Tag>
            case PregnancyStatus.STILLBIRTH:
                return <Tag color="red">Thai chết lưu</Tag>
            case PregnancyStatus.ABORTED:
                return <Tag color="volcano">Phá thai</Tag>
            case PregnancyStatus.MISCARRIAGE:
                return <Tag color="magenta">Thai chết lưu tự nhiên</Tag>
            default:
                return <Tag color="default">Không xác định</Tag>
        }
    }

    // Cấu hình cột cho bảng chính
    const columns = [
        {
            title: "Hồ Sơ thai nhi",
            key: "fetalRecords",
            render: (record: Appointment) => {
                const fetalCount = record.fetalRecords?.length || 0

                if (fetalCount === 0) {
                    return <Text type="secondary">Không có hồ sơ</Text>
                } else if (fetalCount === 1) {
                    return (
                        <Link to={`fetals/${record.fetalRecords[0].id}`} className="text-blue">
                            Xem hồ sơ: {record.fetalRecords[0].name}
                        </Link>
                    )
                } else {
                    return (
                        <Dropdown
                            overlay={
                                <Menu>
                                    {record.fetalRecords.map((fetal) => (
                                        <Menu.Item key={fetal.id} onClick={() => navigateToFetalDetail(fetal.id)}>
                                            <Space>
                                                <FileTextOutlined />
                                                {fetal.name}
                                                {getPregnancyStatusTag(fetal.status)}
                                            </Space>
                                        </Menu.Item>
                                    ))}
                                    <Menu.Divider />
                                    <Menu.Item key="view-all" onClick={() => showFetalRecords(record.fetalRecords)}>
                                        Xem tất cả hồ sơ
                                    </Menu.Item>
                                </Menu>
                            }
                            trigger={["click"]}
                        >
                            <Button type="link">
                                Xem {fetalCount} hồ sơ thai nhi <DownOutlined />
                            </Button>
                        </Dropdown>
                    )
                }
            },
        },
        {
            title: "Ngày hẹn",
            dataIndex: "appointmentDate",
            key: "appointmentDate",
            render: (date: string) => formatDate(date),
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            // Thay Tag bằng Select
            render: (value: AppointmentStatus, record: Appointment) => (
                <Select style={{ width: 180 }} value={value} onChange={(newStatus) => handleChangeStatus(record, newStatus)}>
                    <Option value={AppointmentStatus.CHECKED_IN}>{getStatusTag(AppointmentStatus.CHECKED_IN)}</Option>
                    <Option value={AppointmentStatus.IN_PROGRESS}>{getStatusTag(AppointmentStatus.IN_PROGRESS)}</Option>
                    <Option value={AppointmentStatus.COMPLETED}>{getStatusTag(AppointmentStatus.COMPLETED)}</Option>
                    <Option value={AppointmentStatus.CANCELED}>{getStatusTag(AppointmentStatus.CANCELED)}</Option>
                </Select>
            ),
        },
        {
            title: "Dịch vụ",
            dataIndex: "appointmentServices",
            key: "appointmentServices",
            render: (services: any[], record: Appointment) => (
                <Space>
                    <Button onClick={() => showDetails("Dịch vụ khám", services)} disabled={!services?.length}>
                        Xem
                    </Button>
                    <Button onClick={() => openAddServiceModal(record)}>Thêm dịch vụ</Button>
                </Space>
            ),
        },
        {
            title: "Hóa đơn thuốc",
            dataIndex: "medicationBills",
            key: "medicationBills",
            render: (bills: any[]) => (
                <Button onClick={() => showDetails("Hóa đơn thuốc", bills)} disabled={!bills?.length}>
                    Xem
                </Button>
            ),
        },
        {
            title: "Lịch sử khám",
            dataIndex: "fullHistory",
            key: "fullHistory",
            render: (history: any[]) => (
                <Button onClick={() => showDetails("Lịch sử khám", history)} disabled={!history?.length}>
                    Xem
                </Button>
            ),
        },
        {
            title: "Hành động",
            key: "actions",
            render: (record: Appointment) => {
                // Lấy motherId từ fetal record đầu tiên nếu có
                const mId = record.fetalRecords?.[0]?.mother?.id

                return (
                    <Button
                        type="primary"
                        onClick={() => {
                            if (mId) {
                                setMotherId(mId)
                                setReminderModalVisible(true)
                            } else {
                                message.warning("Không tìm thấy thông tin mẹ để tạo nhắc nhở")
                            }
                        }}
                        disabled={!mId}
                    >
                        Tạo nhắc nhở
                    </Button>
                )
            },
        },
    ]

    const handleRefresh = () => {
        getAppointmentFromDoctor()
    }

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
                ]
            case "Hóa đơn thuốc":
                return [
                    { title: "Tên thuốc", dataIndex: "medicationName", key: "medicationName" },
                    { title: "Liều lượng", dataIndex: "dosage", key: "dosage" },
                    { title: "Giá", dataIndex: "price", key: "price" },
                ]
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
                ]
            default:
                return []
        }
    }

    // Cột cho bảng thai nhi
    const fetalColumns = [
        {
            title: "Tên thai nhi",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Ngày bắt đầu thai kỳ",
            dataIndex: "dateOfPregnancyStart",
            key: "dateOfPregnancyStart",
            render: (date: string) => formatDate(date),
        },
        {
            title: "Ngày dự sinh",
            dataIndex: "expectedDeliveryDate",
            key: "expectedDeliveryDate",
            render: (date: string) => formatDate(date),
        },
        {
            title: "Tình trạng sức khỏe",
            dataIndex: "healthStatus",
            key: "healthStatus",
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            render: (status: PregnancyStatus) => getPregnancyStatusTag(status),
        },
        {
            title: "Hành động",
            key: "action",
            render: (_, record: FetalRecord) => (
                <Button type="primary" onClick={() => navigateToFetalDetail(record.id)}>
                    Xem chi tiết
                </Button>
            ),
        },
    ]

    const handleDateChange = (e) => {
        console.log("e", e);
        setSelectedDate(moment(e).format('YYYY-MM-DD'));
    }

    return (
        <div>
            <h1 className="text-3xl font-extrabold text-center mb-5">Quản lí lịch khám</h1>
            <div className="flex items-center gap-4 mb-6">
                <Select
                    style={{ width: 200 }}
                    value={statusFilter}
                    onChange={(newStatus) => setStatusFilter(newStatus)}
                    placeholder="Lọc theo trạng thái"
                >
                    <Option value={AppointmentStatus.CHECKED_IN}>{getStatusTag(AppointmentStatus.CHECKED_IN)}</Option>
                    <Option value={AppointmentStatus.IN_PROGRESS}>{getStatusTag(AppointmentStatus.IN_PROGRESS)}</Option>
                    <Option value={AppointmentStatus.COMPLETED}>{getStatusTag(AppointmentStatus.COMPLETED)}</Option>
                    <Option value={AppointmentStatus.CANCELED}>{getStatusTag(AppointmentStatus.CANCELED)}</Option>
                </Select>

                <DatePicker
                    onChange={(date) => handleDateChange(date)}
                    defaultValue={moment(selectedDate)}
                    format="DD/MM/YYYY"
                    style={{ width: 200 }}
                    placeholder="Chọn ngày"
                />


            </div>

            {/* Modal thêm dịch vụ */}
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
                {modalData?.length ? (
                    <Table dataSource={modalData} columns={getModalColumns()} rowKey="id" pagination={false} />
                ) : (
                    <p>Không có dữ liệu</p>
                )}
            </Modal>

            {/* Modal hiển thị danh sách thai nhi */}
            <Modal
                title="Danh sách hồ sơ thai nhi"
                visible={fetalModalVisible}
                onCancel={() => setFetalModalVisible(false)}
                footer={null}
                width={1200}
            >
                <Table dataSource={selectedFetalRecords} columns={fetalColumns} rowKey="id" pagination={false} />
            </Modal>

            {/* Modal tạo nhắc nhở */}
            <ModalCreateReminder
                visible={reminderModalVisible}
                onCancel={() => setReminderModalVisible(false)}
                onCreate={handleCreateReminder}
                motherId={motherId}
            />

            {/* Bảng chính */}
            <Table rowClassName={() => tableText()} columns={columns} dataSource={appointments} rowKey="id" />

            <Outlet />
        </div>
    )
}

export default DoctorManageAppointments

