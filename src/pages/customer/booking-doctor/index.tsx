
import { useEffect, useState } from "react"
import { Form, Select, DatePicker, Button, Row, Col, Card, message, Typography, Divider, Spin, Empty } from "antd"
import { useForm } from "antd/es/form/Form"
import { CalendarOutlined, ClockCircleOutlined, UserOutlined, HeartOutlined } from "@ant-design/icons"
import useFetalService from "../../../services/useFetalService"
import userUserService from "../../../services/userUserService"
import type { FetalRecord } from "../../../model/Fetal"
import type { User } from "../../../model/User"
import useAppointmentService from "../../../services/useApoitment"
import dayjs from "dayjs"
import { getUserDataFromLocalStorage } from "../../../constants/function"
import useSlotService from "../../../services/useSlotsService"
import type { Slot } from "../../../model/Slot"
import moment from "moment"

const { Option } = Select
const { Title, Text } = Typography

function BookingDoctor() {
	const [selectedDate, setSelectedDate] = useState(null)
	const [selectedTime, setSelectedTime] = useState(null)
	const [submitted, setSubmitted] = useState(null)
	const [form] = useForm()
	const [fetals, setFetals] = useState<FetalRecord[]>([])
	const [doctors, setDoctors] = useState<User[]>([])
	const [slots, setSlots] = useState<Slot[]>([])
	const [loading, setLoading] = useState({
		fetals: true,
		doctors: true,
		slots: true,
	})
	const [submitting, setSubmitting] = useState(false)
	const user = getUserDataFromLocalStorage()

	const { getFetalsByMotherId } = useFetalService()
	const { getAvailableDoctor } = userUserService()
	const { userCreateAppointments } = useAppointmentService()
	const { getSlots } = useSlotService()

	const handleGetFetalsByMotherId = async (userId: string) => {
		try {
			const response = await getFetalsByMotherId(userId)
			setFetals(response)
		} catch (error) {
			message.error("Không thể tải dữ liệu thai nhi")
			console.error("Error fetching fetals:", error)
		} finally {
			setLoading((prev) => ({ ...prev, fetals: false }))
		}
	}

	const handleGetDoctors = async () => {
		try {
			console.log("selectedDate:", selectedDate, "selectedTime:", selectedTime)
			const response = await getAvailableDoctor(selectedDate, selectedTime)
			setDoctors(response)
		} catch (error) {
			message.error("Không thể tải danh sách bác sĩ")
			console.error("Error fetching doctors:", error)
		} finally {
			setLoading((prev) => ({ ...prev, doctors: false }))
		}
	}

	const handleGetSlots = async () => {
		try {
			const response = await getSlots()
			setSlots(response)
		} catch (error) {
			message.error("Không thể tải khung giờ khám")
			console.error("Error fetching slots:", error)
		} finally {
			setLoading((prev) => ({ ...prev, slots: false }))
		}
	}

	useEffect(() => {
		if (user?.id) {
			handleGetFetalsByMotherId(user.id)
		}
		handleGetSlots()
	}, [])

	useEffect(() => {
		if (selectedDate && selectedTime) {
			handleGetDoctors()
		}
	}, [selectedDate, selectedTime])

	const handleDateChange = (date) => {
		setSelectedDate(date)
		// Reset time selection when date changes
		setSelectedTime(null)
		form.setFieldsValue({ time: undefined })
	}

	const handleTimeChange = (value) => {
		setSelectedTime(value)
	}

	const onSearch = (value: string) => {
		console.log("search:", value)
	}

	const onFinish = (values) => {
		console.log("Selected values:", values)
		console.log("Selected slot ID:", selectedTime)
		setSubmitted(values)
	}

	const handleSubmitAppointment = async (values) => {
		setSubmitting(true)

		try {
			const selectedSlot = slots.find((slot) => slot.id === selectedTime)
			if (!selectedSlot) {
				throw new Error("Không tìm thấy khung giờ đã chọn")
			}

			const date_new = values.date.format("YYYY-MM-DD") + `T${selectedSlot.startTime}`

			const appointment = {
				fetalRecordIds: values.fetalRecords.map((id) => ({ fetalRecordId: id })),
				doctorId: values.doctor,
				date: date_new,
				slotId: selectedTime,
			}

			console.log("Appointment:", appointment)

			const response = await userCreateAppointments(appointment)
			if (response) {
				message.success("Đã đặt lịch hẹn thành công!")
				form.resetFields()
				setSelectedDate(null)
				setSelectedTime(null)
				setSubmitted(null)
			}
		} catch (error) {
			message.error("Đặt lịch hẹn thất bại: " + (error.message || "Vui lòng thử lại sau"))
			console.error("Error submitting appointment:", error)
		} finally {
			setSubmitting(false)
		}
	}

	const isLoading = loading.fetals || loading.slots

	const disabledDate = (current) => {
		// Can't select days before today
		return current && current < dayjs().startOf("day")
	}

	return (
		<div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
			<Card
				title={
					<Title level={3} style={{ margin: 0, color: "#1890ff" }}>
						<CalendarOutlined style={{ marginRight: "8px" }} />
						Đặt lịch khám thai
					</Title>
				}
				bordered={true}
				style={{
					boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
					borderRadius: "12px",
					overflow: "hidden",
				}}
				headStyle={{
					backgroundColor: "#f0f7ff",
					borderBottom: "1px solid #e6f0fa",
					padding: "16px 24px",
				}}
				bodyStyle={{ padding: "24px" }}
			>
				{isLoading ? (
					<div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
						<Spin size="large" tip="Đang tải dữ liệu..." />
					</div>
				) : (
					<>
						<Form layout="vertical" onFinish={onFinish} form={form} requiredMark="optional" size="large">
							{/* Fetal Selection */}
							<Form.Item
								name="fetalRecords"
								label={
									<span style={{ fontSize: "16px", fontWeight: 500 }}>
										<HeartOutlined style={{ marginRight: "8px", color: "#ff4d4f" }} />
										Chọn thai nhi
									</span>
								}
								rules={[{ required: true, message: "Hãy chọn ít nhất một thai nhi để khám!" }]}
							>
								{fetals.filter((fetal) => fetal?.status === "PREGNANT").length > 0 ? (
									<Select
										mode="multiple"
										placeholder="Chọn thai nhi cần khám"
										style={{ width: "100%" }}
										optionFilterProp="children"
										showSearch
										listHeight={250}
									>
										{fetals
											?.filter((fetal) => fetal?.status === "PREGNANT")
											?.map((fetal) => (
												<Option key={fetal.id} value={fetal.id}>
													{fetal.name}
												</Option>
											))}
									</Select>
								) : (
									<Empty description="Không có thai nhi đang mang thai" image={Empty.PRESENTED_IMAGE_SIMPLE} />
								)}
							</Form.Item>


							{/* Date Selection */}
							<Form.Item
								name="date"
								label={
									<span style={{ fontSize: "16px", fontWeight: 500 }}>
										<CalendarOutlined style={{ marginRight: "8px", color: "#52c41a" }} />
										Ngày hẹn khám
									</span>
								}
								rules={[
									{ required: true, message: "Hãy chọn ngày khám!" },
									() => ({
										validator(_, value) {
											if (!value || dayjs(value).isSame(dayjs(), "days") || dayjs(value).isAfter(dayjs(), "days")) {
												return Promise.resolve()
											}
											return Promise.reject(new Error("Không được chọn ngày quá khứ!"))
										},
									}),
								]}
							>
								<DatePicker
									onChange={handleDateChange}
									format="DD-MM-YYYY"
									style={{ width: "100%" }}
									disabledDate={disabledDate}
									placeholder="Chọn ngày khám"
								/>
							</Form.Item>

							{/* Time Selection */}
							{selectedDate && (
								<Form.Item
									name="time"
									label={
										<span style={{ fontSize: "16px", fontWeight: 500 }}>
											<ClockCircleOutlined style={{ marginRight: "8px", color: "#722ed1" }} />
											Chọn thời gian
										</span>
									}
									rules={[{ required: true, message: "Hãy chọn thời gian khám!" }]}
								>
									{slots?.filter((slot) => slot.isActive).length > 0 ? (
										<Select
											showSearch
											placeholder="Chọn giờ khám"
											optionFilterProp="label"
											onChange={handleTimeChange}
											onSearch={onSearch}
											style={{ width: "100%" }}
											options={slots
												?.filter((slot) => slot.isActive)
												?.map((slot) => ({
													value: slot.id,
													label: `${moment(slot.startTime, "H:mm:ss").format("HH:mm")} - ${moment(slot.endTime, "H:mm:ss").format("HH:mm")}`,
												}))}
										/>
									) : (
										<Empty description="Không có khung giờ khả dụng" image={Empty.PRESENTED_IMAGE_SIMPLE} />
									)}
								</Form.Item>
							)}

							{/* Doctor Selection */}
							{selectedDate && selectedTime && (
								<Form.Item
									name="doctor"
									label={
										<span style={{ fontSize: "16px", fontWeight: 500 }}>
											<UserOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
											Bác sĩ
										</span>
									}
									rules={[{ required: true, message: "Hãy lựa chọn bác sĩ khám!" }]}
								>
									{doctors.length > 0 ? (
										<Select
											placeholder="Chọn bác sĩ khám"
											showSearch
											optionFilterProp="children"
											style={{ width: "100%" }}
											listHeight={250}
										>
											{doctors.map((doctor) => (
												<Option key={doctor.id} value={doctor.id}>
													{doctor.fullName}
												</Option>
											))}
										</Select>
									) : (
										<Empty description="Không có bác sĩ khả dụng" image={Empty.PRESENTED_IMAGE_SIMPLE} />
									)}
								</Form.Item>
							)}

							{/* Submit Button */}
							<Form.Item style={{ marginTop: "24px" }}>
								<Button
									type="primary"
									htmlType="submit"
									block
									disabled={
										!selectedTime ||
										fetals.filter((fetal) => fetal?.status === "PREGNANT").length === 0 ||
										doctors.length === 0
									}
									style={{
										height: "48px",
										fontSize: "16px",
										borderRadius: "8px",
										background: "#1890ff",
										boxShadow: "0 2px 0 rgba(0, 0, 0, 0.045)",
									}}
								>
									Chọn lịch hẹn
								</Button>
							</Form.Item>
						</Form>

						{/* Display Selected Info */}
						{submitted && (
							<>
								<Divider style={{ margin: "24px 0" }}>
									<Text strong style={{ fontSize: "16px", color: "#1890ff" }}>
										Thông tin đặt lịch
									</Text>
								</Divider>

								<Card
									style={{
										borderRadius: "12px",
										boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
										border: "1px solid #e8ecef",
										overflow: "hidden",
									}}
								>
									<Title level={4} style={{ textAlign: "center", color: "#1a3c34", marginBottom: "24px" }}>
										Đây là thông tin đăng ký của bạn, vui lòng kiểm tra thật kỹ
									</Title>

									<div
										style={{
											padding: "20px",
											backgroundColor: "#f9fafb",
											borderRadius: "8px",
											border: "1px solid #e2e8f0",
											marginBottom: "24px",
										}}
									>
										<Row gutter={[16, 16]} style={{ marginBottom: "12px" }}>
											<Col span={8} style={{ fontWeight: "bold", color: "#2d3748" }}>
												<HeartOutlined style={{ marginRight: "8px", color: "#ff4d4f" }} />
												Tên Bé:
											</Col>
											<Col span={16} style={{ color: "#4a5568" }}>
												{submitted.fetalRecords.map((id) => fetals.find((f) => f.id === id)?.name).join(", ")}
											</Col>
										</Row>

										<Row gutter={[16, 16]} style={{ marginBottom: "12px" }}>
											<Col span={8} style={{ fontWeight: "bold", color: "#2d3748" }}>
												<UserOutlined style={{ marginRight: "8px", color: "#1890ff" }} />
												Bác sĩ khám:
											</Col>
											<Col span={16} style={{ color: "#4a5568" }}>
												{doctors.find((d) => d.id === submitted.doctor)?.fullName}
											</Col>
										</Row>

										<Row gutter={[16, 16]} style={{ marginBottom: "12px" }}>
											<Col span={8} style={{ fontWeight: "bold", color: "#2d3748" }}>
												<CalendarOutlined style={{ marginRight: "8px", color: "#52c41a" }} />
												Ngày hẹn:
											</Col>
											<Col span={16} style={{ color: "#4a5568" }}>
												{submitted.date.format("DD-MM-YYYY")}
											</Col>
										</Row>

										<Row gutter={[16, 16]}>
											<Col span={8} style={{ fontWeight: "bold", color: "#2d3748" }}>
												<ClockCircleOutlined style={{ marginRight: "8px", color: "#722ed1" }} />
												Thời gian:
											</Col>
											<Col span={16} style={{ color: "#4a5568" }}>
												{slots.find((s) => s.id === selectedTime)
													? `${moment(slots.find((s) => s.id === selectedTime).startTime, "H:mm:ss").format("HH:mm")} - ${moment(slots.find((s) => s.id === selectedTime).endTime, "H:mm:ss").format("HH:mm")}`
													: "N/A"}
											</Col>
										</Row>
									</div>

									<Row gutter={[16, 16]}>
										<Col span={12}>
											<Button
												type="primary"
												block
												onClick={() => handleSubmitAppointment(submitted)}
												loading={submitting}
												style={{
													borderRadius: "8px",
													height: "48px",
													fontSize: "16px",
													fontWeight: "500",
													background: "#1890ff",
													borderColor: "#1890ff",
												}}
											>
												{submitting ? "Đang xử lý..." : "Xác nhận đặt lịch"}
											</Button>
										</Col>
										<Col span={12}>
											<Button
												type="default"
												block
												onClick={() => {
													setSubmitted(null)
													form.resetFields()
													setSelectedDate(null)
													setSelectedTime(null)
												}}
												disabled={submitting}
												style={{
													borderRadius: "8px",
													height: "48px",
													fontSize: "16px",
													fontWeight: "500",
													borderColor: "#e2e8f0",
													color: "#4a5568",
												}}
											>
												Hủy bỏ
											</Button>
										</Col>
									</Row>
								</Card>
							</>
						)}
					</>
				)}
			</Card>
		</div>
	)
}

export default BookingDoctor

