
import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Card, Typography, Button, Tabs, Tag, Row, Col, Spin, Empty, message } from "antd"
import { CalendarOutlined, UserOutlined } from "@ant-design/icons"
import dayjs from "dayjs"
import AppointmentDetail from "../appointment-detail"
import CreateReminderModal from "../modal/createRemindModal"
import useAppointmentService from "../../../services/useApoitment"

const { Title, Text } = Typography
const { TabPane } = Tabs

// Types based on your JSON structure
interface Mother {
	id: string
	username: string
	email: string
	fullName: string
	phone: string
}

interface Doctor {
	id: string
	username: string
	email: string
	fullName: string
	phone: string
}

interface FetalRecord {
	id: string
	name: string
	note: string
	dateOfPregnancyStart: string
	expectedDeliveryDate: string
	actualDeliveryDate: string | null
	healthStatus: string
	status: string
	mother: Mother
	checkupRecords: any[]
}

interface Appointment {
	id: string
	appointmentDate: string
	status: string
	fetalRecords: FetalRecord[]
	doctor: Doctor
	appointmentServices: any[]
	medicationBills: any[]
	history: any[]
}

// Status mapping for display
const STATUS_COLORS = {
	PENDING: "orange",
	CONFIRMED: "blue",
	CHECKED_IN: "cyan",
	IN_PROGRESS: "purple",
	COMPLETED: "green",
	CANCELED: "red",
}

const STATUS_LABELS = {
	PENDING: "Đang chờ",
	CONFIRMED: "Đã xác nhận",
	CHECKED_IN: "Đã đến",
	IN_PROGRESS: "Đang thực hiện",
	COMPLETED: "Đã hoàn thành",
	CANCELED: "Đã hủy",
}

const FETAL_STATUS_COLORS = {
	PREGNANT: "green",
	BORN: "blue",
	MISSED: "orange",
	STILLBIRTH: "red",
	ABORTED: "magenta",
	MISCARRIAGE: "volcano",
}

const FETAL_STATUS_LABELS = {
	PREGNANT: "Đang mang thai",
	BORN: "Đã sinh",
	MISSED: "Thai lưu",
	STILLBIRTH: "Chết non",
	ABORTED: "Phá thai",
	MISCARRIAGE: "Sảy thai",
}

// Map tabs to appointment statuses
const TAB_STATUS_MAP = {
	upcoming: ["PENDING", "CONFIRMED", "CHECKED_IN", "IN_PROGRESS"],
	past: ["COMPLETED"],
	canceled: ["CANCELED"],
	failed: ["FAIL"],
}

const AppointmentDashboard: React.FC = () => {
	const [appointments, setAppointments] = useState<Appointment[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [activeTab, setActiveTab] = useState("upcoming")
	const [isReminderModalVisible, setIsReminderModalVisible] = useState(false)
	const [currentUser, setCurrentUser] = useState<any>(null)
	const { getAppointmentsByStatus, updateAppointmentStatus } = useAppointmentService()

	// Fetch appointments based on the active tab
	const fetchAppointments = useCallback(async () => {
		setIsLoading(true)
		try {
			// Get the statuses for the current tab
			const statuses = TAB_STATUS_MAP[activeTab]

			// Fetch appointments for each status and combine them
			const appointmentsPromises = statuses.map(status => getAppointmentsByStatus(status))
			const appointmentsResults = await Promise.all(appointmentsPromises)

			// Flatten the array of arrays into a single array of appointments
			const allAppointments = appointmentsResults.flat()

			// Filter and sort appointments
			const filteredAppointments = filterAppointmentsByDate(allAppointments, activeTab)

			setAppointments(filteredAppointments)

			// Get user from localStorage
			if (!currentUser) {
				const user = localStorage.getItem("USER")
				if (user) {
					setCurrentUser(JSON.parse(user))
				}
			}
		} catch (error) {
			console.error("Error fetching appointments:", error)
			message.error("Không thể tải dữ liệu lịch hẹn")
		} finally {
			setIsLoading(false)
		}
	}, [activeTab, getAppointmentsByStatus, currentUser])

	// Filter appointments based on date and tab
	const filterAppointmentsByDate = (appointments: Appointment[], tab: string) => {
		const today = dayjs()

		let filtered = [...appointments]

		if (tab === "upcoming") {
			filtered = filtered.filter(appointment => {
				const appointmentDate = dayjs(appointment.appointmentDate)
				return appointmentDate.isAfter(today) || appointmentDate.isSame(today, "day")
			})

			// Sort by date (oldest first for upcoming)
			filtered.sort((a, b) => {
				return dayjs(a.appointmentDate).diff(dayjs(b.appointmentDate))
			})
		} else if (tab === "past") {
			filtered = filtered.filter(appointment => {
				const appointmentDate = dayjs(appointment.appointmentDate)
				return appointmentDate.isBefore(today)
			})

			// Sort by date (newest first for past)
			filtered.sort((a, b) => {
				return dayjs(b.appointmentDate).diff(dayjs(a.appointmentDate))
			})
		}

		return filtered
	}

	// Load appointments when component mounts or tab changes
	useEffect(() => {
		fetchAppointments()
	}, [fetchAppointments])

	// Handle appointment status change
	const handleStatusChange = async (appointmentId: string, newStatus: string) => {
		try {
			// Call API to update status
			await updateAppointmentStatus(appointmentId, newStatus)

			// Update local state
			setAppointments(prevAppointments =>
				prevAppointments.map(appointment =>
					appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
				)
			)

			// Refresh appointments if the new status would move it to a different tab
			const currentTabStatuses = TAB_STATUS_MAP[activeTab]
			if (!currentTabStatuses.includes(newStatus)) {
				fetchAppointments()
			}

			message.success(`Cập nhật trạng thái thành công: ${STATUS_LABELS[newStatus]}`)
		} catch (error) {
			console.error("Error updating appointment status:", error)
			message.error("Không thể cập nhật trạng thái lịch hẹn")
		}
	}

	const handleTabChange = (key: string) => {
		setActiveTab(key)
	}

	if (isLoading) {
		return (
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
				<Spin size="large" />
			</div>
		)
	}

	return (
		<div style={{ padding: "20px" }}>
			<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
				<Title level={3}>Quản lý lịch hẹn khám</Title>
				<Button type="primary" onClick={() => setIsReminderModalVisible(true)}>
					Tạo ghi chú
				</Button>
			</div>

			<Tabs activeKey={activeTab} onChange={handleTabChange}>
				<TabPane tab="Sắp tới" key="upcoming">
					{renderAppointmentList(appointments)}
				</TabPane>
				<TabPane tab="Đã qua" key="past">
					{renderAppointmentList(appointments)}
				</TabPane>
				<TabPane tab="Đã hủy" key="canceled">
					{renderAppointmentList(appointments)}
				</TabPane>
				<TabPane tab="Thất bại" key="failed">
					{renderAppointmentList(appointments)}
				</TabPane>
			</Tabs>

			<CreateReminderModal
				visible={isReminderModalVisible}
				onCancel={() => setIsReminderModalVisible(false)}
				motherId={currentUser?.id || ""}
				onSuccess={() => message.success("Tạo ghi chú thành công")}
			/>
		</div>
	)

	function renderAppointmentList(appointments: Appointment[]) {
		if (appointments.length === 0) {
			return <Empty description="Không có lịch hẹn nào" style={{ margin: "40px 0" }} />
		}

		return (
			<Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
				{appointments.map((appointment) => (
					<Col xs={24} sm={12} lg={8} key={appointment.id}>
						<Card
							title="Lịch hẹn khám"
							extra={<Tag color={STATUS_COLORS[appointment.status]}>{STATUS_LABELS[appointment.status]}</Tag>}
							style={{ height: "100%" }}
						>
							<div style={{ marginBottom: "16px" }}>
								<p>
									<CalendarOutlined style={{ marginRight: "8px" }} />
									{dayjs(appointment.appointmentDate).format("DD/MM/YYYY")}
								</p>
								<p>
									<UserOutlined style={{ marginRight: "8px" }} />
									Bác sĩ: {appointment.doctor.fullName}
								</p>
							</div>

							{appointment.fetalRecords.length > 0 && (
								<div style={{ marginBottom: "16px" }}>
									<Text strong>Thai nhi:</Text>
									<div style={{ marginTop: "8px" }}>
										{appointment.fetalRecords.slice(0, 2).map((fetal) => (
											<div
												key={fetal.id}
												style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}
											>
												<Text>{fetal.name}</Text>
												<Tag color={FETAL_STATUS_COLORS[fetal.status]}>{FETAL_STATUS_LABELS[fetal.status]}</Tag>
											</div>
										))}
										{appointment.fetalRecords.length > 2 && (
											<Text type="secondary" style={{ fontSize: "12px" }}>
												+{appointment.fetalRecords.length - 2} thai nhi khác
											</Text>
										)}
									</div>
								</div>
							)}

							<div style={{ marginTop: "auto" }}>
								<AppointmentDetail
									appointment={appointment}
									onStatusChange={handleStatusChange}
									onRefresh={fetchAppointments}
								/>
							</div>
						</Card>
					</Col>
				))}
			</Row>
		)
	}
}

export default AppointmentDashboard
