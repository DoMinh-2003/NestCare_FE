"use client"

import { useEffect, useState } from "react"
import {
	Button,
	message,
	Table,
	Form,
	Modal,
	Select,
	Tag,
	Space,
	Dropdown,
	Menu,
	Typography,
	DatePicker,
	Tabs,
	Card,
	Spin,
	Badge,
	DatePickerProps,
} from "antd"
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
import {
	DownOutlined,
	FileTextOutlined,
	CalendarOutlined,
	ClockCircleOutlined,
	HeartOutlined,
	ReloadOutlined,
	BellOutlined,
	MedicineBoxOutlined,
	HistoryOutlined,
	PlusOutlined,
} from "@ant-design/icons"
import moment from "moment"
import dayjs from "dayjs"

const { Option } = Select
const { Text, Title } = Typography
const { TabPane } = Tabs

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
	slot?: {
		id: string
		startTime: string
		endTime: string
		isActive: boolean
	}
}

function DoctorManageCheckinAppointments() {
	const [appointments, setAppointments] = useState<Appointment[]>([])
	const [services, setServices] = useState<[]>([])
	const [currentDoctor, setCurrentDoctor] = useState(null)
	const [loading, setLoading] = useState(false)
	const { getAppointmentsByDoctor, updateAppointmentStatus } = userAppointmentService()
	const [selectedDate, setSelectedDate] = useState(dayjs(new Date()).format("YYYY-MM-DD"))
	const [activeStatusTab, setActiveStatusTab] = useState<AppointmentStatus>(AppointmentStatus.IN_PROGRESS)
	const [form] = Form.useForm()
	const { getServices } = useServiceService()
	const [modalVisible, setModalVisible] = useState(false)
	const [modalData, setModalData] = useState<any[]>([])
	const [modalTitle, setModalTitle] = useState("")
	const { createReminderByDoctor, getReminderByDoctor } = userReminderService()
	const [reminderModalVisible, setReminderModalVisible] = useState(false)
	const [motherId, setMotherId] = useState<string | null>(null)
	const [addServiceModalVisible, setAddServiceModalVisible] = useState(false)
	const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null)
	const [fetalModalVisible, setFetalModalVisible] = useState(false)
	const [selectedFetalRecords, setSelectedFetalRecords] = useState<FetalRecord[]>([])
	const [reminder, setReminder] = useState([]);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const navigate = useNavigate()

	// Lấy danh sách cuộc hẹn
	const getAppointmentFromDoctor = async () => {
		if (!currentDoctor) return
		setLoading(true)
		try {
			const response = await getAppointmentsByDoctor(currentDoctor.id, selectedDate, activeStatusTab)
			if (response) {
				setAppointments(response.filter((item) => !item.isDeleted))
			}
		} catch (error) {
			message.error("Không thể tải danh sách cuộc hẹn")
		} finally {
			setLoading(false)
		}
	}

	const fetchReminderByDoctor = async (motherId: string) => {
		const response = await getReminderByDoctor(motherId);
		console.log(response)
		setIsModalOpen(true);
		setReminder(response);
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
	}, [currentDoctor, selectedDate, activeStatusTab])

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

	const reminderColumns = [
		{
			title: "Tiêu đề",
			dataIndex: "title",
			key: "title",
		},
		{
			title: "Mô tả",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "Ngày bắt đầu",
			dataIndex: "startDate",
			key: "startDate",
			render: (value: string) => formatDate(value)
		},
		{
			title: "Ngày kết thúc",
			dataIndex: "endDate",
			key: "endDate",
			render: (value: string) => formatDate(value)
		},
		{
			title: "Thời gian nhắc",
			dataIndex: "reminderTime",
			key: "reminderTime",
		},
		{
			title: "Bác sĩ",
			dataIndex: ["doctor", "fullName"], // Lấy tên bác sĩ
			key: "doctor",
		},
	];

	// Cấu hình cột cho bảng chính
	const columns = [
		{
			title: "Hồ Sơ Khám",
			key: "id",
			render: (record: Appointment) => {
				return (
					<Link to={`appointments/${record.id}`} className="font-medium">
						Xem
					</Link>
				)
			},
		},
		{
			title: "Ngày hẹn",
			dataIndex: "appointmentDate",
			key: "appointmentDate",
			render: (date: string) => (
				<span className="font-medium">
					<CalendarOutlined className="mr-2 text-green-500" />
					{formatDate(date)}
				</span>
			),
			sorter: (a, b) => moment(a.appointmentDate).unix() - moment(b.appointmentDate).unix(),
			defaultSortOrder: "ascend",
		},
		{
			title: "Thời gian",
			key: "time",
			render: (record: Appointment) =>
				record.slot ? (
					<span className="font-medium">
						<ClockCircleOutlined className="mr-2 text-purple-500" />
						{moment(record.slot.startTime, "H:mm:ss").format("HH:mm")} -{" "}
						{moment(record.slot.endTime, "H:mm:ss").format("HH:mm")}
					</span>
				) : (
					"N/A"
				),
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
			render: (services: any[], record: Appointment) => (
				<Space>
					<Button
						onClick={() => showDetails("Dịch vụ khám", services)}
						disabled={!services?.length}
						icon={<FileTextOutlined />}
						className="border-blue-400 text-blue-500 hover:text-blue-600 hover:border-blue-500"
					>
						Xem
					</Button>
					<Button
						onClick={() => openAddServiceModal(record)}
						type="primary"
						ghost
						icon={<PlusOutlined />}
						className="border-green-400 text-green-500 hover:text-green-600 hover:border-green-500"
					>
						Thêm
					</Button>
				</Space>
			),
		},
		{
			title: "Hóa đơn thuốc",
			dataIndex: "medicationBills",
			key: "medicationBills",
			render: (bills: any[]) => (
				<Button
					onClick={() => showDetails("Hóa đơn thuốc", bills)}
					disabled={!bills?.length}
					icon={<MedicineBoxOutlined />}
					className="border-purple-400 text-purple-500 hover:text-purple-600 hover:border-purple-500"
				>
					Xem
				</Button>
			),
		},
		{
			title: "Lịch sử khám",
			dataIndex: "fullHistory",
			key: "fullHistory",
			render: (history: any[]) => (
				<Button
					onClick={() => showDetails("Lịch sử khám", history)}
					disabled={!history?.length}
					icon={<HistoryOutlined />}
					className="border-orange-400 text-orange-500 hover:text-orange-600 hover:border-orange-500"
				>
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
				console.log(motherId)
				return (
					<Space>
						<Button
							type="primary"
							icon={<BellOutlined />}
							onClick={() => {
								if (mId) {
									setMotherId(mId)
									setReminderModalVisible(true)
								} else {
									message.warning("Không tìm thấy thông tin mẹ để tạo nhắc nhở")
								}
							}}
							disabled={!mId}
							className="bg-blue-500 hover:bg-blue-600"
						>
							Tạo nhắc nhở
						</Button>
						<Button
							type="primary"
							icon={<BellOutlined />}
							onClick={() => {
								if (mId) {
									fetchReminderByDoctor(mId);
								} else {
									message.warning("Không tìm thấy thông tin mẹ để xem nhắc nhở");
								}
							}}
							disabled={!mId}
							className="bg-blue-500 hover:bg-blue-600"
						>
							Xem nhắc nhở
						</Button>
					</Space>
				)
			},
		},
	]

	const handleRefresh = async () => {
		const currentDate = new Date();
		setSelectedDate(currentDate);
		getAppointmentFromDoctor()
	}

	// Cấu hình cột cho Modal (bảng con)
	const getModalColumns = () => {
		switch (modalTitle) {
			case "Dịch vụ khám":
				return [
					{
						title: "Tên dịch vụ",
						dataIndex: "notes",
						key: "notes",
						render: (text) => <span className="font-medium">{text}</span>,
					},
					{
						title: "Giá",
						dataIndex: "price",
						key: "price",
						render: (value: number) => <span className="font-medium text-green-600">{formatMoney(value)}</span>,
					},
				]
			case "Hóa đơn thuốc":
				return [
					{
						title: "Tên thuốc",
						dataIndex: "medicationName",
						key: "medicationName",
						render: (text) => <span className="font-medium">{text}</span>,
					},
					{
						title: "Liều lượng",
						dataIndex: "dosage",
						key: "dosage",
						render: (text) => <span className="font-medium text-blue-600">{text}</span>,
					},
					{
						title: "Giá",
						dataIndex: "price",
						key: "price",
						render: (value: number) => <span className="font-medium text-green-600">{formatMoney(value)}</span>,
					},
				]
			case "Lịch sử khám":
				return [
					{
						title: "Ngày khám",
						dataIndex: "createdAt",
						key: "createdAt",
						render: (text: string) => (
							<span className="font-medium">
								<CalendarOutlined className="mr-2 text-blue-500" />
								{formatDate(text)}
							</span>
						),
					},
					{
						title: "Nhịp tim thai nhi (bpm)",
						dataIndex: "fetalHeartbeat",
						key: "fetalHeartbeat",
						render: (text) => <span className="font-medium text-red-500">{text}</span>,
					},
					{
						title: "Chiều cao thai nhi (cm)",
						dataIndex: "fetalHeight",
						key: "fetalHeight",
						render: (text) => <span className="font-medium text-green-600">{text}</span>,
					},
					{
						title: "Trọng lượng thai nhi (kg)",
						dataIndex: "fetalWeight",
						key: "fetalWeight",
						render: (text) => <span className="font-medium text-blue-600">{text}</span>,
					},
					{
						title: "Huyết áp mẹ (mmHg)",
						dataIndex: "motherBloodPressure",
						key: "motherBloodPressure",
						render: (text) => <span className="font-medium text-purple-600">{text}</span>,
					},
					{
						title: "Sức khỏe mẹ",
						dataIndex: "motherHealthStatus",
						key: "motherHealthStatus",
						render: (text) => <span className="font-medium">{text}</span>,
					},
					{
						title: "Cân nặng mẹ (kg)",
						dataIndex: "motherWeight",
						key: "motherWeight",
						render: (text) => <span className="font-medium text-orange-600">{text}</span>,
					},
					{
						title: "Cảnh báo",
						dataIndex: "warning",
						key: "warning",
						render: (text) =>
							text ? (
								<span className="font-medium text-red-600">{text}</span>
							) : (
								<span className="text-gray-400">Không có</span>
							),
					},
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
			render: (text) => (
				<span className="font-medium">
					<HeartOutlined className="mr-2 text-red-500" />
					{text}
				</span>
			),
		},
		{
			title: "Ngày bắt đầu thai kỳ",
			dataIndex: "dateOfPregnancyStart",
			key: "dateOfPregnancyStart",
			render: (date: string) => (
				<span className="font-medium">
					<CalendarOutlined className="mr-2 text-blue-500" />
					{formatDate(date)}
				</span>
			),
		},
		{
			title: "Ngày dự sinh",
			dataIndex: "expectedDeliveryDate",
			key: "expectedDeliveryDate",
			render: (date: string) => (
				<span className="font-medium">
					<CalendarOutlined className="mr-2 text-green-500" />
					{formatDate(date)}
				</span>
			),
		},
		{
			title: "Tình trạng sức khỏe",
			dataIndex: "healthStatus",
			key: "healthStatus",
			render: (text) => <span className="font-medium text-blue-600">{text}</span>,
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
				<Button
					type="primary"
					onClick={() => navigateToFetalDetail(record.id)}
					icon={<FileTextOutlined />}
					className="bg-blue-500 hover:bg-blue-600"
				>
					Xem chi tiết
				</Button>
			),
		},
	]
	const handleDateChange = async (date: DatePickerProps['onChange']) => {
		console.log('====================================');
		console.log("=====date changed====", date);
		console.log('====================================');

		if (date) {
			const newDate = dayjs(date).format('YYYY-MM-DD');
			setSelectedDate(newDate);
		}
	}


	return (
		<div className="p-6">
			<Card
				title={
					<Title level={3} style={{ margin: 0, color: "#1890ff" }}>
						Quản lý lịch khám
					</Title>
				}
				bordered={true}
				style={{
					boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
					borderRadius: "16px",
					overflow: "hidden",
				}}
				headStyle={{
					backgroundColor: "#f0f7ff",
					borderBottom: "1px solid #e6f0fa",
					padding: "20px 24px",
				}}
				bodyStyle={{ padding: "24px" }}
			>
				<div className="flex items-center gap-4 mb-6">
					<DatePicker
						onChange={handleDateChange}
						defaultValue={moment(selectedDate)}
						format="DD/MM/YYYY"
						style={{ width: 200 }}
						placeholder="Chọn ngày"
					/>

					<Button
						type="primary"
						onClick={handleRefresh}
						icon={<ReloadOutlined />}
						className="bg-blue-500 hover:bg-blue-600"
					>
						Làm mới
					</Button>
				</div>

				<Tabs
					activeKey={activeStatusTab}
					onChange={(key) => setActiveStatusTab(key as AppointmentStatus)}
					type="card"
					className="mb-6"
					tabBarStyle={{ marginBottom: "16px", fontWeight: "bold" }}
				>
					<TabPane
						tab={
							<span>
								<Badge status="processing" color="cyan" />
								Đang khám
							</span>
						}
						key={AppointmentStatus.IN_PROGRESS}
					/>
				</Tabs>

				{loading ? (
					<div className="flex justify-center items-center p-12">
						<Spin size="large" tip="Đang tải danh sách cuộc hẹn..." />
					</div>
				) : (
					<Table
						rowClassName={() => tableText()}
						columns={columns}
						dataSource={appointments}
						rowKey="id"
						pagination={{ pageSize: 10 }}
						locale={{ emptyText: "Không có cuộc hẹn nào" }}
						className="shadow-md rounded-lg overflow-hidden"
						bordered
						scroll={{ x: 1200 }}
					/>
				)}

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
						<Table
							dataSource={modalData}
							columns={getModalColumns()}
							rowKey="id"
							pagination={false}
							bordered
							className="shadow-sm rounded-lg overflow-hidden"
						/>
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
					<Table
						dataSource={selectedFetalRecords}
						columns={fetalColumns}
						rowKey="id"
						pagination={false}
						bordered
						className="shadow-sm rounded-lg overflow-hidden"
					/>

				</Modal>
				<Modal
					title="Danh sách nhắc nhở"
					open={isModalOpen}
					onCancel={() => setIsModalOpen(false)}
					footer={null} // Ẩn footer
					width={1000}
				>
					<Table
						dataSource={reminder}
						columns={reminderColumns}
						rowKey="id"
						pagination={{ pageSize: 5 }}
					/>
				</Modal>

				{/* Modal tạo nhắc nhở */}
				<ModalCreateReminder
					visible={reminderModalVisible}
					onCancel={() => setReminderModalVisible(false)}
					onCreate={handleCreateReminder}
					motherId={motherId}
				/>
			</Card>

			<Outlet />
		</div>
	)
}

export default DoctorManageCheckinAppointments
