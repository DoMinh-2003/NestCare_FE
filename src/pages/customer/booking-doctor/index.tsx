import React, { useEffect, useState } from 'react';
import { Form, Select, DatePicker, Button, Row, Col, Card } from "antd";
import { useForm } from 'antd/es/form/Form';
import useFetalService from '../../../services/useFetalService';
import userUserService from '../../../services/userUserService';
import { FetalRecord } from '../../../model/Fetal';
import { User } from '../../../model/User';
import useAppointmentService from '../../../services/useApoitment';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { getUserDataFromLocalStorage } from '../../../constants/function';
import useSlotService from '../../../services/useSlotsService';
import { Slot } from '../../../model/Slot';
import moment from 'moment';
const { Option } = Select;

function BookingDoctor() {
	const [selectedDate, setSelectedDate] = useState(null);
	const [selectedTime, setSelectedTime] = useState(null); // This will store the slot ID
	const [submitted, setSubmitted] = useState(null);
	const [form] = useForm();
	const [fetals, setFetals] = useState<FetalRecord[]>([]);
	const [doctors, setDoctors] = useState<User[]>([]);
	const [slots, setSlots] = useState<Slot[]>([]);
	const user = getUserDataFromLocalStorage();

	const { getFetalsByMotherId } = useFetalService();
	const { getUserByRole } = userUserService();
	const { userCreateAppointments } = useAppointmentService();
	const { getSlots } = useSlotService();

	const handleGetFetalsByMotherId = async (userId: string) => {
		const response = await getFetalsByMotherId(userId);
		setFetals(response);
	};

	const handleGetDoctors = async () => {
		const response = await getUserByRole("doctor");
		setDoctors(response);
	};

	const handleGetSlots = async () => {
		try {
			const response = await getSlots();
			setSlots(response);
		} catch (error) {
			console.log('Error fetching slots:', error);
		}
	};

	useEffect(() => {
		handleGetFetalsByMotherId(user.id);
		handleGetDoctors();
		handleGetSlots();
	}, []);

	const handleDateChange = (date) => {
		setSelectedDate(date);
	};

	const handleTimeChange = (value) => {
		setSelectedTime(value); // Value is the slot ID
	};

	const onSearch = (value: string) => {
		console.log('search:', value);
	};

	const onFinish = (values) => {
		console.log("Selected values:", values);
		console.log("Selected slot ID:", selectedTime);
		setSubmitted(values);
	};

	const handleSubmitAppointment = async (values) => {
		console.log("Submitting appointment");

		const selectedSlot = slots.find(slot => slot.id === selectedTime);
		const date_new = values.date.format("YYYY-MM-DD") + `T${selectedSlot.startTime}`;

		const appointment = {
			fetalRecordIds: values.fetalRecords.map(id => ({ fetalRecordId: id })), // Array of fetalRecordIds
			doctorId: values.doctor,
			date: date_new,
			slotId: selectedTime, // Use the slot ID
		};

		console.log("Appointment:", appointment);

		try {
			const response = await userCreateAppointments(appointment);
			if (response) {
				console.log("Appointment created successfully:", response);
				toast.success("Đã đặt lịch hẹn thành công!");
				form.resetFields();
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
					name="fetalRecords"
					label="Chọn thai"
					rules={[{ required: true, message: "Hãy chọn ít nhất một thai để khám!" }]}
				>
					<Select mode="multiple" placeholder="Chọn thai">
						{fetals
							?.filter((fetal) => fetal?.status === "PREGNANT")
							?.map((fetal) => (
								<Option key={fetal.id} value={fetal.id}>
									{fetal.name}
								</Option>
							))}
					</Select>
				</Form.Item>

				{/* Doctor Selection */}
				<Form.Item
					name="doctor"
					label="Bác sĩ"
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
					rules={[
						{ required: true, message: "Hãy chọn ngày khám!" },
						() => ({
							validator(_, value) {
								if (!value || dayjs(value).isSame(dayjs(), 'days') || dayjs(value).isAfter(dayjs(), 'days')) {
									return Promise.resolve();
								}
								return Promise.reject(new Error('Không được chọn ngày quá khứ!'));
							},
						}),
					]}
				>
					<DatePicker onChange={handleDateChange} format="DD-MM-YYYY" />
				</Form.Item>

				{/* Time Selection */}
				{selectedDate && (
					<Form.Item
						label="Chọn thời gian"
						rules={[{ required: true, message: "Hãy chọn thời gian khám!" }]}
					>
						<Select
							showSearch
							placeholder="Chọn giờ khám"
							optionFilterProp="label"
							onChange={handleTimeChange}
							onSearch={onSearch}
							options={slots
								?.filter((slot) => slot.isActive)
								?.map((slot) => ({
									value: slot.id, // Use slot ID as the value
									label: `${moment(slot.startTime, 'H:mm:ss').format('HH:mm')} - ${moment(slot.endTime, 'H:mm:ss').format('HH:mm')}`,
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
				<Card
					style={{
						maxWidth: '600px',
						margin: '20px auto',
						padding: '20px',
						boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)', // Softer, larger shadow
						borderRadius: '12px', // Rounded corners
						backgroundColor: '#ffffff', // Clean white background
						border: '1px solid #e8ecef', // Subtle border
					}}
				>
					<h3
						className="text-lg text-center font-semibold"
						style={{
							color: '#1a3c34', // A deep teal color for elegance
							marginBottom: '20px',
							fontSize: '1.25rem', // Slightly larger text
							fontFamily: "'Roboto', sans-serif", // Modern font (ensure it's imported if not default)
						}}
					>
						Đây là thông tin đăng ký của bạn, vui lòng kiểm tra thật kỹ
					</h3>
					<div
						style={{
							padding: '15px',
							backgroundColor: '#f9fafb', // Light gray background for content
							borderRadius: '8px', // Slightly rounded content area
							border: '1px solid #e2e8f0', // Subtle border around content
						}}
					>
						<Row gutter={[16, 12]} style={{ marginBottom: '8px' }}>
							<Col span={8} style={{ fontWeight: 'bold', color: '#2d3748' }}>
								Tên Bé:
							</Col>
							<Col span={16} style={{ color: '#4a5568' }}>
								{submitted.fetalRecords.map(id => fetals.find(f => f.id === id)?.name).join(", ")}
							</Col>
						</Row>
						<Row gutter={[16, 12]} style={{ marginBottom: '8px' }}>
							<Col span={8} style={{ fontWeight: 'bold', color: '#2d3748' }}>
								Bác sĩ khám:
							</Col>
							<Col span={16} style={{ color: '#4a5568' }}>
								{doctors.find(d => d.id === submitted.doctor)?.fullName}
							</Col>
						</Row>
						<Row gutter={[16, 12]} style={{ marginBottom: '8px' }}>
							<Col span={8} style={{ fontWeight: 'bold', color: '#2d3748' }}>
								Ngày hẹn:
							</Col>
							<Col span={16} style={{ color: '#4a5568' }}>
								{submitted.date.format("DD-MM-YYYY")}
							</Col>
						</Row>
						<Row gutter={[16, 12]} style={{ marginBottom: '8px' }}>
							<Col span={8} style={{ fontWeight: 'bold', color: '#2d3748' }}>
								Thời gian:
							</Col>
							<Col span={16} style={{ color: '#4a5568' }}>
								{slots.find(s => s.id === selectedTime)
									? `${moment(slots.find(s => s.id === selectedTime).startTime, 'H:mm:ss').format('HH:mm')} - ${moment(slots.find(s => s.id === selectedTime).endTime, 'H:mm:ss').format('HH:mm')}`
									: 'N/A'}
							</Col>
						</Row>
					</div>
					<Row gutter={[16, 16]} style={{ marginTop: '20px' }}>
						<Col span={12}>
							<Button
								type="primary"
								block
								onClick={() => handleSubmitAppointment(submitted)}
								style={{
									borderRadius: '8px', // Rounded buttons
									padding: '6px 15px', // Comfortable padding
									fontWeight: '500', // Slightly bold text
									backgroundColor: '#1a73e8', // Vibrant blue
									borderColor: '#1a73e8',
									height: '40px', // Consistent height
								}}
							>
								Xác nhận
							</Button>
						</Col>
						<Col span={12}>
							<Button
								type="default"
								block
								onClick={() => [setSubmitted(null), form.resetFields(), setSelectedDate(null), setSelectedTime(null)]}
								style={{
									borderRadius: '8px',
									padding: '6px 15px',
									fontWeight: '500',
									borderColor: '#e2e8f0', // Subtle border
									color: '#4a5568', // Neutral text color
									backgroundColor: '#ffffff',
									height: '40px',
								}}
							>
								Hủy bỏ
							</Button>
						</Col>
					</Row>
				</Card>
			)}
		</Card>
	);
}

export default BookingDoctor;