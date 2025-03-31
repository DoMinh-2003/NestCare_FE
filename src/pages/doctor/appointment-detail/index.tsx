"use client"

import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {
	Select,
	Card,
	Descriptions,
	Tabs,
	Table,
	Button,
	Modal,
	Form,
	Input,
	InputNumber,
	Space,
	Typography,
	Tag,
	Timeline,
	Divider,
	message,
	Spin,
	Row,
	Col,
	Badge,
} from "antd"
import {
	UserOutlined,
	CalendarOutlined,
	MedicineBoxOutlined,
	HeartOutlined,
	HistoryOutlined,
	PlusOutlined,
	EditOutlined,
} from "@ant-design/icons"
import { motion } from "framer-motion"
import userAppointmentService from "../../../services/useAppointmentService"
import useMedicineService from "../../../services/useMedicineService"

const { Title, Text } = Typography
const { TabPane } = Tabs

// Types
interface Appointment {
	id: string
	appointmentDate: string
	status: string
	fetalRecords: FetalRecord[]
	doctor: User
	appointmentServices: Service[]
	medicationBills: any[]
	history: AppointmentHistory[]
	slot: Slot
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
	isDeleted: number
	createdAt: string
	updatedAt: string
	checkupRecords: CheckupRecord[]
	mother: User
}

interface CheckupRecord {
	id: string
	motherWeight: string
	motherBloodPressure: string
	motherHealthStatus: string
	fetalWeight: string | null
	fetalHeight: string | null
	fetalHeartbeat: string | null
	warning: string | null
	createdAt: string
}

interface User {
	id: string
	username: string
	password: string
	email: string
	fullName: string
	image: string | null
	phone: string
	role: string
	isDeleted: boolean
}

interface Service {
	id: string
	price: string
	notes: string
}

interface AppointmentHistory {
	id: string
	status: string
	notes: string | null
	createdAt: string
	changedBy: User
}

interface Slot {
	id: string
	startTime: string
	endTime: string
	isActive: boolean
	createdAt: string
	updatedAt: string
}

interface Medication {
	medicationId: string
	quantity: number
	name?: string // For display purposes
}

interface FetalCheckup {
	fetalRecordId: string
	fetalWeight: number
	fetalHeight: number
	fetalHeartbeat: number
	warning: string | null
}

function AppointmentDetail() {
	const { id } = useParams()
	const [appointment, setAppointment] = useState<Appointment | null>(null)
	const [loading, setLoading] = useState(true)
	const [checkupModalVisible, setCheckupModalVisible] = useState(false)
	const [selectedFetal, setSelectedFetal] = useState<FetalRecord | null>(null)
	const [form] = Form.useForm()
	const [medications, setMedications] = useState<Medication[]>([])
	const [availableMedications, setAvailableMedications] = useState<any[]>([])
	const [fetalCheckups, setFetalCheckups] = useState<FetalCheckup[]>([])
	const [showMedicationSection, setShowMedicationSection] = useState(false)
	const { getAppointmentDetail } = userAppointmentService()
	const { getMedicinesService } = useMedicineService()

	const handleGetAppointmentDetail = async (appointmentId: string) => {
		try {
			setLoading(true)
			const response = await getAppointmentDetail(appointmentId)
			console.log("Appointment Detail:", response.data)
			setAppointment(response)
		} catch (error) {
			console.error("Error fetching appointment details:", error)
			message.error("Failed to load appointment details")
		} finally {
			setLoading(false)
		}
	}

	const getMedicine = async () => {
		try {
			const response = await getMedicinesService("", 0)
			setAvailableMedications(response.data.pageData)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		if (id) {
			handleGetAppointmentDetail(id)
		}
		getMedicine()
	}, [id])

	const showCheckupModal = (fetal: FetalRecord) => {
		setSelectedFetal(fetal)
		setCheckupModalVisible(true)
		form.resetFields()
		setMedications([])
		setFetalCheckups([])
		setShowMedicationSection(false)
	}

	const handleAddMedication = () => {
		const newMedications = [...medications, { medicationId: "", quantity: 1 }]
		setMedications(newMedications)
	}

	const handleRemoveMedication = (index: number) => {
		const newMedications = [...medications]
		newMedications.splice(index, 1)
		setMedications(newMedications)
	}

	const handleMedicationChange = (index: number, field: string, value: any) => {
		const newMedications = [...medications]
		newMedications[index] = { ...newMedications[index], [field]: value }

		// If medication ID changed, find the name for display
		if (field === "medicationId") {
			const medication = availableMedications.find((med) => med.id === value)
			if (medication) {
				newMedications[index].name = medication.name
			}
		}

		setMedications(newMedications)
	}

	const handleAddFetalCheckup = (values: any) => {
		if (!selectedFetal) return

		// Create a new fetal checkup object
		const newCheckup: FetalCheckup = {
			fetalRecordId: selectedFetal.id,
			fetalWeight: Number.parseFloat(values.fetalWeight),
			fetalHeight: Number.parseFloat(values.fetalHeight),
			fetalHeartbeat: Number.parseFloat(values.fetalHeartbeat),
			warning: values.warning || null,
		}

		// Add to the fetalCheckups array
		setFetalCheckups([...fetalCheckups, newCheckup])

		// Show medication section after adding fetal checkup
		setShowMedicationSection(true)

		// Reset form for next fetal if needed
		form.resetFields()

		message.success(`Đã thêm thông tin khám cho thai nhi ${selectedFetal.name}`)
	}

	const handleSubmitCheckup = async () => {
		if (fetalCheckups.length === 0) {
			message.error("Vui lòng thêm ít nhất một thông tin khám thai nhi")
			return
		}

		try {
			const payload = {
				fetalCheckups: fetalCheckups,
				medications: medications
					.filter((med) => med.medicationId && med.quantity > 0)
					.map((med) => ({
						medicationId: med.medicationId,
						quantity: med.quantity,
					})),
			}

			console.log("Submitting checkup data:", payload)

			// In a real app, you would make an API call here
			// await api.put(`/appointments/${id}/checkup`, payload);

			// For demonstration, we'll simulate a successful API call
			message.success("Lưu thông tin khám thành công")
			setCheckupModalVisible(false)

			// Reset state
			setFetalCheckups([])
			setMedications([])
			setShowMedicationSection(false)

			// Refresh appointment data
			if (id) {
				handleGetAppointmentDetail(id)
			}
		} catch (error) {
			console.error("Error saving checkup data:", error)
			message.error("Lỗi khi lưu thông tin khám")
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("vi-VN", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		})
	}

	const formatTime = (timeString: string) => {
		return timeString.substring(0, 5)
	}

	const getStatusColor = (status: string) => {
		switch (status) {
			case "PENDING":
				return "orange"
			case "CHECKED_IN":
				return "blue"
			case "IN_PROGRESS":
				return "processing"
			case "COMPLETED":
				return "success"
			case "CANCELLED":
				return "error"
			default:
				return "default"
		}
	}

	const checkupColumns = [
		{
			title: "Ngày khám",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (text: string) => formatDate(text),
		},
		{
			title: "Cân nặng mẹ (kg)",
			dataIndex: "motherWeight",
			key: "motherWeight",
		},
		{
			title: "Huyết áp",
			dataIndex: "motherBloodPressure",
			key: "motherBloodPressure",
		},
		{
			title: "Tình trạng sức khỏe mẹ",
			dataIndex: "motherHealthStatus",
			key: "motherHealthStatus",
		},
		{
			title: "Cân nặng thai (kg)",
			dataIndex: "fetalWeight",
			key: "fetalWeight",
			render: (text: string | null) => text || "-",
		},
		{
			title: "Chiều cao thai (cm)",
			dataIndex: "fetalHeight",
			key: "fetalHeight",
			render: (text: string | null) => text || "-",
		},
		{
			title: "Nhịp tim thai",
			dataIndex: "fetalHeartbeat",
			key: "fetalHeartbeat",
			render: (text: string | null) => text || "-",
		},
		{
			title: "Cảnh báo",
			dataIndex: "warning",
			key: "warning",
			render: (text: string | null) => text || "Không có",
		},
	]

	const needsCheckup = (fetal: FetalRecord) => {
		// Check if the most recent checkup has null values for fetal measurements
		if (fetal.checkupRecords && fetal.checkupRecords.length > 0) {
			const latestCheckup = fetal.checkupRecords.sort(
				(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			)[0]

			return (
				latestCheckup.fetalWeight === null ||
				latestCheckup.fetalHeight === null ||
				latestCheckup.fetalHeartbeat === null
			)
		}
		return false
	}

	if (loading) {
		return (
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
				<Spin size="large" tip="Đang tải thông tin cuộc hẹn..." />
			</div>
		)
	}

	if (!appointment) {
		return (
			<div style={{ textAlign: "center", margin: "50px" }}>
				<Title level={3}>Không tìm thấy thông tin cuộc hẹn</Title>
			</div>
		)
	}

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
			<Card className="appointment-detail-card">
				<Row gutter={[16, 16]}>
					<Col span={24}>
						<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
							<Title level={2}>
								<MedicineBoxOutlined /> Chi tiết cuộc hẹn
							</Title>
							<Badge
								status={getStatusColor(appointment.status) as any}
								text={
									<Tag color={getStatusColor(appointment.status)}>
										{appointment.status === "IN_PROGRESS"
											? "ĐANG KHÁM"
											: appointment.status === "PENDING"
												? "CHỜ KHÁM"
												: appointment.status === "CHECKED_IN"
													? "ĐÃ CHECKIN"
													: appointment.status === "COMPLETED"
														? "HOÀN THÀNH"
														: "ĐÃ HỦY"}
									</Tag>
								}
							/>
						</div>
					</Col>
				</Row>

				<Row gutter={[16, 16]}>
					<Col xs={24} md={12}>
						<Card
							title={
								<>
									<CalendarOutlined /> Thông tin cuộc hẹn
								</>
							}
							bordered={false}
						>
							<Descriptions column={1}>
								<Descriptions.Item label="Ngày hẹn">{formatDate(appointment.appointmentDate)}</Descriptions.Item>
								<Descriptions.Item label="Thời gian">
									{formatTime(appointment.slot.startTime)} - {formatTime(appointment.slot.endTime)}
								</Descriptions.Item>
								<Descriptions.Item label="Bác sĩ">{appointment.doctor.fullName}</Descriptions.Item>
								<Descriptions.Item label="Dịch vụ">
									{appointment?.appointmentServices?.map((service, index) => (
										<div key={service.id}>
											{service.notes} - {Number.parseInt(service.price).toLocaleString("vi-VN")} VNĐ
										</div>
									))}
								</Descriptions.Item>
							</Descriptions>
						</Card>
					</Col>

					<Col xs={24} md={12}>
						<Card
							title={
								<>
									<UserOutlined /> Thông tin bệnh nhân
								</>
							}
							bordered={false}
						>
							<Descriptions column={1}>
								<Descriptions.Item label="Họ tên">{appointment.fetalRecords[0]?.mother.fullName}</Descriptions.Item>
								<Descriptions.Item label="Email">{appointment.fetalRecords[0]?.mother.email}</Descriptions.Item>
								<Descriptions.Item label="Số điện thoại">{appointment.fetalRecords[0]?.mother.phone}</Descriptions.Item>
								<Descriptions.Item label="Số thai nhi">{appointment.fetalRecords.length}</Descriptions.Item>
							</Descriptions>
						</Card>
					</Col>
				</Row>

				<Divider />

				<Card
					title={
						<>
							<HistoryOutlined /> Lịch sử cuộc hẹn
						</>
					}
					style={{ marginBottom: 16 }}
				>
					<Timeline mode="left">
						{appointment?.history
							.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
							.map((history) => (
								<Timeline.Item
									key={history.id}
									color={getStatusColor(history.status)}
									label={formatDate(history.createdAt) + " " + new Date(history.createdAt).toLocaleTimeString("vi-VN")}
								>
									<Text strong>
										{history.status === "IN_PROGRESS"
											? "ĐANG KHÁM"
											: history.status === "PENDING"
												? "CHỜ KHÁM"
												: history.status === "CHECKED_IN"
													? "ĐÃ CHECKIN"
													: history.status === "COMPLETED"
														? "HOÀN THÀNH"
														: "ĐÃ HỦY"}
									</Text>
									<div>
										Thực hiện bởi: {history.changedBy.fullName} (
										{history.changedBy.role === "doctor" ? "Bác sĩ" : "Y tá"})
									</div>
									{history.notes && <div>Ghi chú: {history.notes}</div>}
								</Timeline.Item>
							))}
					</Timeline>
				</Card>

				<Tabs defaultActiveKey="1" type="card">
					{appointment?.fetalRecords?.map((fetal, index) => (
						<TabPane
							tab={
								<span>
									<HeartOutlined /> {fetal.name}
									{needsCheckup(fetal) && <Badge status="error" style={{ marginLeft: 8 }} />}
								</span>
							}
							key={index.toString()}
						>
							<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
								<Card
									title={<Text strong>Thông tin thai nhi</Text>}
									extra={
										<Button type="primary" icon={<EditOutlined />} onClick={() => showCheckupModal(fetal)}>
											Cập nhật khám
										</Button>
									}
								>
									<Row gutter={[16, 16]}>
										<Col xs={24} md={12}>
											<Descriptions column={1} bordered>
												<Descriptions.Item label="Tên thai nhi">{fetal.name}</Descriptions.Item>
												<Descriptions.Item label="Ghi chú">{fetal.note}</Descriptions.Item>
												<Descriptions.Item label="Ngày bắt đầu thai kỳ">
													{formatDate(fetal.dateOfPregnancyStart)}
												</Descriptions.Item>
												<Descriptions.Item label="Ngày dự sinh">
													{formatDate(fetal.expectedDeliveryDate)}
												</Descriptions.Item>
												<Descriptions.Item label="Tình trạng sức khỏe">{fetal.healthStatus}</Descriptions.Item>
												<Descriptions.Item label="Trạng thái">
													<Tag color={fetal.status === "PREGNANT" ? "blue" : "green"}>
														{fetal.status === "PREGNANT" ? "ĐANG MANG THAI" : "ĐÃ SINH"}
													</Tag>
												</Descriptions.Item>
											</Descriptions>
										</Col>
										<Col xs={24} md={12}>
											{fetal.checkupRecords && fetal.checkupRecords.length > 0 && (
												<Card title="Thông tin khám gần nhất" bordered={false}>
													{(() => {
														const latestCheckup = [...fetal.checkupRecords].sort(
															(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
														)[0]

														return (
															<Descriptions column={1} bordered>
																<Descriptions.Item label="Ngày khám">
																	{formatDate(latestCheckup.createdAt)}
																</Descriptions.Item>
																<Descriptions.Item label="Cân nặng mẹ">
																	{latestCheckup.motherWeight} kg
																</Descriptions.Item>
																<Descriptions.Item label="Huyết áp">
																	{latestCheckup.motherBloodPressure}
																</Descriptions.Item>
																<Descriptions.Item label="Tình trạng sức khỏe mẹ">
																	{latestCheckup.motherHealthStatus}
																</Descriptions.Item>
																<Descriptions.Item label="Cân nặng thai">
																	{latestCheckup.fetalWeight ? `${latestCheckup.fetalWeight} kg` : "Chưa có dữ liệu"}
																</Descriptions.Item>
																<Descriptions.Item label="Chiều cao thai">
																	{latestCheckup.fetalHeight ? `${latestCheckup.fetalHeight} cm` : "Chưa có dữ liệu"}
																</Descriptions.Item>
																<Descriptions.Item label="Nhịp tim thai">
																	{latestCheckup.fetalHeartbeat
																		? `${latestCheckup.fetalHeartbeat} bpm`
																		: "Chưa có dữ liệu"}
																</Descriptions.Item>
																<Descriptions.Item label="Cảnh báo">
																	{latestCheckup.warning || "Không có"}
																</Descriptions.Item>
															</Descriptions>
														)
													})()}
												</Card>
											)}
										</Col>
									</Row>

									<Divider orientation="left">Lịch sử khám</Divider>

									<Table
										dataSource={fetal.checkupRecords.sort(
											(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
										)}
										columns={checkupColumns}
										rowKey="id"
										pagination={{ pageSize: 5 }}
										scroll={{ x: "max-content" }}
									/>
								</Card>
							</motion.div>
						</TabPane>
					))}
				</Tabs>
			</Card>

			<Modal
				title={`Cập nhật khám cho ${selectedFetal?.name}`}
				visible={checkupModalVisible}
				onCancel={() => setCheckupModalVisible(false)}
				footer={null}
				width={800}
			>
				<div>
					{/* Fetal Checkup Form */}
					<Form
						form={form}
						layout="vertical"
						onFinish={handleAddFetalCheckup}
						initialValues={{
							fetalWeight: "",
							fetalHeight: "",
							fetalHeartbeat: "",
							warning: "",
						}}
					>
						<Row gutter={16}>
							<Col span={8}>
								<Form.Item
									name="fetalWeight"
									label="Cân nặng thai (kg)"
									rules={[{ required: true, message: "Vui lòng nhập cân nặng thai" }]}
								>
									<InputNumber min={0} step={0.01} style={{ width: "100%" }} placeholder="Nhập cân nặng" />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item
									name="fetalHeight"
									label="Chiều cao thai (cm)"
									rules={[{ required: true, message: "Vui lòng nhập chiều cao thai" }]}
								>
									<InputNumber min={0} step={0.01} style={{ width: "100%" }} placeholder="Nhập chiều cao" />
								</Form.Item>
							</Col>
							<Col span={8}>
								<Form.Item
									name="fetalHeartbeat"
									label="Nhịp tim thai (bpm)"
									rules={[{ required: true, message: "Vui lòng nhập nhịp tim thai" }]}
								>
									<InputNumber min={0} step={0.01} style={{ width: "100%" }} placeholder="Nhập nhịp tim" />
								</Form.Item>
							</Col>
						</Row>

						<Form.Item name="warning" label="Cảnh báo / Ghi chú">
							<Input.TextArea rows={3} placeholder="Nhập cảnh báo hoặc ghi chú nếu có" />
						</Form.Item>

						<Form.Item>
							<Button type="primary" htmlType="submit">
								Thêm thông tin khám
							</Button>
						</Form.Item>
					</Form>

					{/* Display added fetal checkups */}
					{fetalCheckups.length > 0 && (
						<>
							<Divider orientation="left">Thông tin khám đã thêm</Divider>
							<Table
								dataSource={fetalCheckups}
								columns={[
									{
										title: "Cân nặng thai (kg)",
										dataIndex: "fetalWeight",
										key: "fetalWeight",
									},
									{
										title: "Chiều cao thai (cm)",
										dataIndex: "fetalHeight",
										key: "fetalHeight",
									},
									{
										title: "Nhịp tim thai (bpm)",
										dataIndex: "fetalHeartbeat",
										key: "fetalHeartbeat",
									},
									{
										title: "Cảnh báo",
										dataIndex: "warning",
										key: "warning",
										render: (text: string | null) => text || "Không có",
									},
								]}
								pagination={false}
								rowKey={(record) => record.fetalRecordId}
							/>
						</>
					)}

					{/* Medication Section */}
					{showMedicationSection && (
						<>
							<Divider orientation="left">Đơn thuốc</Divider>

							{medications.map((medication, index) => (
								<Row gutter={16} key={index} style={{ marginBottom: 16 }}>
									<Col span={12}>
										<Form.Item label={index === 0 ? "Thuốc" : ""} required>
											<Select
												style={{ width: "100%" }}
												placeholder="Chọn thuốc"
												value={medication.medicationId || undefined}
												onChange={(value) => handleMedicationChange(index, "medicationId", value)}
												options={availableMedications?.map((med) => ({
													value: med.id,
													label: `${med.name} - ${Number.parseInt(med.price).toLocaleString("vi-VN")} VNĐ`,
												}))}
											/>
										</Form.Item>
									</Col>
									<Col span={8}>
										<Form.Item label={index === 0 ? "Số lượng" : ""} required>
											<InputNumber
												min={1}
												style={{ width: "100%" }}
												value={medication.quantity}
												onChange={(value) => handleMedicationChange(index, "quantity", value)}
											/>
										</Form.Item>
									</Col>
									<Col span={4} style={{ display: "flex", alignItems: "flex-end" }}>
										<Button
											danger
											onClick={() => handleRemoveMedication(index)}
											style={{ marginBottom: index === 0 ? 0 : 24 }}
										>
											Xóa
										</Button>
									</Col>
								</Row>
							))}

							<Button
								type="dashed"
								onClick={handleAddMedication}
								style={{ width: "100%", marginBottom: 16 }}
								icon={<PlusOutlined />}
							>
								Thêm thuốc
							</Button>
						</>
					)}

					{/* Submit Button */}
					<Divider />
					<Form.Item>
						<Space style={{ display: "flex", justifyContent: "flex-end" }}>
							<Button onClick={() => setCheckupModalVisible(false)}>Hủy</Button>
							<Button type="primary" onClick={handleSubmitCheckup} disabled={fetalCheckups.length === 0}>
								Lưu thông tin
							</Button>
						</Space>
					</Form.Item>
				</div>
			</Modal>
		</motion.div>
	)
}

export default AppointmentDetail

