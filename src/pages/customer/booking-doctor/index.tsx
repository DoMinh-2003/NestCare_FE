import React, { useEffect, useState } from 'react';
import { Form, Select, DatePicker, Button, Row, Col, Radio, Card } from "antd";
import { useForm } from 'antd/es/form/Form';
import useFetalService from '../../../services/useFetalService';
import userUserService from '../../../services/userUserService';
import { FetalRecord } from '../../../model/Fetal';
import { User } from '../../../model/User';
import useAppointmentService from '../../../services/useApoitment';
import { toast } from 'react-toastify';
const { Option } = Select;

function BookingDoctor() {
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null);
	const [submitted, setSubmitted] = useState(null);
	const [form] = useForm();
	const [fetals, setFetals] = useState<FetalRecord[]>([]);
	const [doctors, setDoctors] = useState<User[]>([]);
	const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);
	const [fetalRecords, setFetalRecords] = useState<FetalRecord>();

	const { getFetalsByMotherId, getFetalsRecords } = useFetalService();
	const { getUserByRole, getUserById } = userUserService();
	const { userCreateAppointments } = useAppointmentService();

	const handleGetFetalsByMotherId = async (userId: string) => {
		const response = await getFetalsByMotherId(userId);
		setFetals(response);
	};

	const handleGetUserById = async (userId: string) => {
		const response = await getUserById(userId);
		setSelectedDoctor(response);
		return response;
	};

	const handleGetDoctors = async () => {
		const response = await getUserByRole("doctor");
		setDoctors(response);
	};

	useEffect(() => {
		const user = localStorage.getItem('USER');
		if (user) {
			handleGetFetalsByMotherId(JSON.parse(user).id);
		}
		handleGetDoctors();
	}, []);

	const handleGetFetalsRecords = async (fetalID: string) => {
		const response = await getFetalsRecords(fetalID);
		setFetalRecords(response);
		return response;
	};

	const availableTimes = [
		"07:00",
		"08:45", "09:00", "09:15", "09:30", "09:45",
		"11:30", "11:45", "13:30", "13:45", "14:00",
		"15:00", "17:00"
	];

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	const handleTimeChange = (value) => {
		setSelectedTime(value);
	};

	const onSearch = (value: string) => {
		console.log('search:', value);
	};

	// Chuyển onFinish thành async để đợi dữ liệu từ server
	const onFinish = async (values) => {
		console.log("Selected values:", values);
		console.log("Selected time:", selectedTime);
		await handleGetFetalsRecords(values.fetal);
		await handleGetUserById(values.doctor);
		setSubmitted(values);
	};

	// Chỉnh sửa handleSubmitAppointment để gộp date và time
	const handleSubmitAppointment = async (values) => {
		console.log("Submitting appointment");

		// Tách chuỗi selectedTime thành giờ và phút
		const timeParts = selectedTime.split(":");
		const hours = parseInt(timeParts[0], 10);
		const minutes = parseInt(timeParts[1], 10);


		// Kết hợp date và time thành một đối tượng moment
		const appointmentDate = values.date.clone().set({
			hour: hours,
			minute: minutes,
			second: 0,
		});
		const date_new = appointmentDate.toISOString().split('T')[0] + `T${selectedTime}:00`

		// Tạo đối tượng appointment với ngày giờ đã gộp
		const appointment = {
			fetalRecordId: values.fetal,
			doctorId: values.doctor,
			date: date_new // Chuyển thành chuỗi ISO để gửi server
		};

		console.log("Appointment:", appointment);

		try {
			const response = await userCreateAppointments(appointment);
			if (response) {
				console.log("Appointment created successfully:", response);
				toast.success("Đã đặt lịch hẹn thành công!");
				form.resetFields();
				setSelectedDoctor(null);
				setSelectedDate(null);
				setSelectedTime(null);
				setSubmitted(null);
			}
		} catch (error) {
			console.error("Error submitting appointment:", error);
		}
	};

	return (
		<Card style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
			<Form layout="vertical" onFinish={onFinish} form={form}>
				{/* Fetal Selection */}
				<Form.Item
					name="fetal"
					label="Chọn thai"
					rules={[{ required: true, message: "Hãy chọn thai để khám!" }]}
				>
					<Select placeholder="Chọn thai">
						{fetals
							.filter((fetal) => fetal?.status === "PREGNANT")
							.map((fetal) => (
								<Option key={fetal.id} value={fetal.id}>
									{fetal.name}
								</Option>
							))}
					</Select>
				</Form.Item>

				{/* Doctor Selection */}
				<Form.Item
					name="doctor"
					label="Doctor"
					rules={[{ required: true, message: "Hãy lựa chọn bác sĩ khám!" }]}
				>
					<Select placeholder="Chọn bác sĩ">
						{doctors.map((doctor) => (
							<Option key={doctor.id} value={doctor.id}>
								{doctor.fullName}
							</Option>
						))}
					</Select>
				</Form.Item>

				{/* Date Selection */}
				<Form.Item
					name="date"
					label="Ngày hẹn khám"
					rules={[{ required: true, message: "Hãy chọn ngày khám!" }]}
				>
					<DatePicker onChange={handleDateChange} format="YYYY-MM-DD" />
				</Form.Item>

				{/* Time Selection */}
				{selectedDate && (
					<Form.Item label="Chọn thời gian" required>
						<Select
							showSearch
							placeholder="Chọn giờ khám"
							optionFilterProp="label"
							onChange={handleTimeChange}
							onSearch={onSearch}
							options={availableTimes.map((time) => ({
								value: time,
								label: time,
							}))}
						/>
					</Form.Item>
				)}

				{/* Submit Button */}
				<Form.Item>
					<Button type="primary" htmlType="submit" block disabled={!selectedTime}>
						Chọn lịch hẹn
					</Button>
				</Form.Item>
			</Form>

			{/* Display Selected Info */}
			{submitted && (
				<Card style={{ marginTop: '20px', padding: '10px' }}>
					<h3>Thông tin đã chọn:</h3>
					<p>
						Tên Thai: {fetalRecords?.name} <br />
						Bác sĩ khám: {selectedDoctor?.fullName} <br />
						Ngày hẹn: {selectedDate?.format("DD-MM-YYYY")} <br />
						Thời gian: {selectedTime}
					</p>
					<Row gutter={[8, 8]}>
						<Col span={12}>
							<Button type="primary" block onClick={() => handleSubmitAppointment(submitted)}>Xác nhận</Button>
						</Col>
						<Col span={12}>
							<Button type="default" block onClick={() => [setSubmitted(null), form.resetFields(), setSelectedDate(null)]}>Hủy bỏ</Button>
						</Col>
					</Row>
				</Card>
			)}
		</Card>
	);
}

export default BookingDoctor;