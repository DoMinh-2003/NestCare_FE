import { Button, DatePicker, Form, Input, Modal, Table, Tag, TimePicker, Typography } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FetalRecord } from "../../../model/Fetal";
import useAppointmentService from "../../../services/useApoitment";
import useFetalService from "../../../services/useFetalService";
import { getUserDataFromLocalStorage } from "../../../constants/function";
const { Title, Text } = Typography;


const statusTags = {
	PREGNANT: { color: 'green', label: 'Đang mang thai' },
	BORN: { color: 'blue', label: 'Đã sinh' },
	MISSED: { color: 'orange', label: 'Thai lưu' },
	STILLBIRTH: { color: 'red', label: 'Chết non' },
	ABORTED: { color: 'magenta', label: 'Phá thai' },
	MISCARRIAGE: { color: 'volcano', label: 'Sảy thai' }
};

const appointmentStatusTags = {
	PENDING: { color: 'orange', label: 'Đang chờ' },
	CONFIRMED: { color: 'blue', label: 'Đã xác nhận' },
	CHECKED_IN: { color: 'cyan', label: 'Đã đến' },
	IN_PROGRESS: { color: 'purple', label: 'Đang thực hiện' },
	COMPLETED: { color: 'green', label: 'Đã hoàn thành' },
	CANCELED: { color: 'red', label: 'Đã hủy' }
};


function AppointmentHistory() {

	const [fetals, setFetals] = useState<FetalRecord[]>([]);
	const [selectedAppointment, setSelectedAppointment] = useState<FetalRecord>(null); // State để quản lý chi tiết cuộc hẹn
	const [isModalVisible, setIsModalVisible] = useState(false); // Quản lý trạng thái mở/đóng modal
	const [dataTable, setDataTable] = useState([]);
	const { getFetalsByMotherId } = useFetalService();
	const { getAppointments, createReminder } = useAppointmentService();
	const [form] = useForm();
	const [isLoading, setIsLoading] = useState(false);
	const [currentUser, setCurrentUser] = useState(null)

	const handleGetFetalsByMotherId = async () => {
		const user = localStorage.getItem('USER');

		if (user) {
			const userId = JSON.parse(user).id;
			// Fetch fetal records by mother's ID
			const response = await getFetalsByMotherId(userId);

			// Extract appointment IDs from all fetals
			const appointmentIds = response
				.map(fetal => fetal.appointments.map(appointment => appointment.id))
				.flat();
			console.log('Appointment IDs:', appointmentIds);

			// Fetch details for each appointment using the getAppointments API
			const appointmentDetails = await Promise.all(
				appointmentIds.map(async (id) => {
					const appointmentDetail = await getAppointments(id);
					return appointmentDetail;
				})
			);
			console.log('Fetched appointment details:', appointmentDetails);

			// Set the fetched appointment details in the table data
			setDataTable(appointmentDetails);

			// Optionally set the full fetal data for other purposes
			setFetals(response);
		}

	};

	const columns = [
		{
			title: 'Tên thai nhi',
			dataIndex: ['fetalRecord', 'name'],
			key: 'fetalName',
		},
		{
			title: 'Ghi chú',
			dataIndex: ['fetalRecord', 'note'],
			key: 'fetalNote',
		},
		{
			title: 'Ngày bắt đầu thai kỳ',
			dataIndex: ['fetalRecord', 'dateOfPregnancyStart'],
			key: 'pregnancyStartDate',
			render: (date) => new Date(date).toLocaleDateString('vi-VN'),
		},
		{
			title: 'Ngày dự sinh',
			dataIndex: ['fetalRecord', 'expectedDeliveryDate'],
			key: 'expectedDeliveryDate',
			render: (date) => new Date(date).toLocaleDateString('vi-VN'),
		},
		{
			title: 'Tên mẹ',
			dataIndex: ['fetalRecord', 'mother', 'fullName'],
			key: 'motherName',
		},
		{
			title: 'Số điện thoại mẹ',
			dataIndex: ['fetalRecord', 'mother', 'phone'],
			key: 'motherPhone',
		},
		{
			title: 'Ngày hẹn khám',
			dataIndex: 'appointmentDate',
			key: 'appointmentDate',
			render: (date) => dayjs(date).format('DD/MM/YYYY HH:mm:ss'),
			sorter: (a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime(),
		},
		{
			title: 'Trạng thái cuộc hẹn',
			dataIndex: 'status',
			key: 'appointmentStatus',
			filters: [
				{ text: 'Đang chờ', value: 'PENDING' },
				{ text: 'Đã xác nhận', value: 'CONFIRMED' },
				{ text: 'Đã đến', value: 'CHECKED_IN' },
				{ text: 'Đang thực hiện', value: 'IN_PROGRESS' },
				{ text: 'Đã hoàn thành', value: 'COMPLETED' },
				{ text: 'Đã hủy', value: 'CANCELED' }
			],
			onFilter: (value, record) => record.status === value,
			render: (status) => {
				const tagInfo = appointmentStatusTags[status] || { color: 'default', label: status };
				return <Tag color={tagInfo.color}>{tagInfo.label}</Tag>;
			},
		},
		{
			title: 'Là cuộc hẹn theo dõi',
			dataIndex: 'isFollow',
			key: 'isFollow',
			render: (isFollow) => (isFollow ? 'Có' : 'Không'),
		},
		{
			title: 'Tên bác sĩ',
			dataIndex: ['doctor', 'fullName'],
			key: 'doctorName',
		},
		{
			title: 'Số điện thoại bác sĩ',
			dataIndex: ['doctor', 'phone'],
			key: 'doctorPhone',
		},
	];


	const handleCancel = () => {
		setIsModalVisible(false);
		form.resetFields();
	};

	useEffect(() => {
		handleGetFetalsByMotherId();
	}, []);
	const userData = getUserDataFromLocalStorage();
	useEffect(() => {
		const user = localStorage.getItem('USER');

		if (user) {
			const userDetail = JSON.parse(user);
			console.log('====================================');
			console.log("Current User@@@@@@@@@@:", userDetail);
			console.log('====================================');
			setCurrentUser(userDetail);
			form.setFieldValue('motherId', userDetail.id);
			console.log("handleCancel current user", currentUser);
		}
	}, [])

	const onFinish = async (values: any) => {

		// values.motherId = userData.id;
		console.log('Form values:', values);
		values.startDate = dayjs(values.startDate).format('YYYY-MM-DD'); // Format start date
		values.endDate = dayjs(values.endDate).format('YYYY-MM-DD');     // Format end date
		values.reminderTime = dayjs(values.reminderTime).format('HH:mm'); // Format reminder time
		console.log('Form values:', values);


		setIsLoading(true);
		try {
			await createReminder(values);
			toast.success('Tạo ghi chú thành công');
			form.resetFields();
			setIsModalVisible(false);
		} catch (error) {
			console.error('Error creating reminder:', error.message);
		} finally {
			setIsLoading(false);
		}
	};


	return (
		<div className="min-h-[420px] mx-10">
			<div className="py-6">
				<Button type="primary" onClick={() => setIsModalVisible(true)}>
					Tạo ghi chú
				</Button>
			</div>
			<Table
				columns={columns}
				dataSource={dataTable}
			/>

			<Modal
				title="Tạo ghi chú"
				visible={isModalVisible}
				onCancel={() => setIsModalVisible(false)}
				width={1000}
				footer={null}
				onClose={() => handleCancel()}
			>
				<Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ motherId: userData.id }}>
					<Form.Item name="motherId">
						<Input hidden value={userData.id} />
					</Form.Item>
					<Form.Item label="Nội dung" name="title" rules={[{ required: true, message: 'Nhập tiêu đề!' }]}>
						<Input placeholder="Enter the title" />
					</Form.Item>
					<Form.Item label="Mô tả" name="description" rules={[{ required: true, message: 'Nhập mô tả!' }]}>
						<Input.TextArea rows={4} placeholder="Enter the description" />
					</Form.Item>
					<Form.Item label="Thời gian nhắc" name="reminderTime"
						rules={[
							{ required: true, message: 'Hãy nhập giờ nhắc nhở!' },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || dayjs(value).isAfter(dayjs(), 'minute')) {
										return Promise.resolve();
									}
									return Promise.reject(new Error('Không được chọn giờ trong quá khứ!'));
								},
							}),
						]}>
						<TimePicker format="HH:mm" placeholder="Chọn giờ" />
					</Form.Item>
					<Form.Item label="Ngày bắt đầu" name="startDate"
						rules={[{ required: true, message: 'Chọn ngày bắt đầu!' },
						() => ({
							validator(_, value) {
								if (!value || dayjs(value).isAfter(dayjs(), 'day') || dayjs(value).isSame(dayjs(), 'day')) {
									return Promise.resolve();
								}
								return Promise.reject(new Error('Không được chọn ngày quá khứ!'));
							},
						}),
						({ getFieldValue }) => ({
							validator(_, value) {
								const endDate = getFieldValue('endDate');
								if (!value || !endDate || dayjs(value).isBefore(dayjs(endDate), 'day') || dayjs(value).isSame(dayjs(endDate), 'day')) {
									return Promise.resolve();
								}
								return Promise.reject(new Error('Ngày kết thúc không được trước ngày bắt đầu!'));
							},
						}),
						]}>
						<DatePicker format="DD-MM-YYYY" placeholder="Chọn ngày bắt đầu" />
					</Form.Item>
					<Form.Item label="Ngày kết thúc" name="endDate"
						dependencies={['startDate']} // Add dependencies to ensure validation when startDate changes
						rules={[
							{ required: true, message: 'Chọn ngày kết thúc!' },
							({ getFieldValue }) => ({
								validator(_, value) {
									const startDate = getFieldValue('startDate');
									if (!value || !startDate || dayjs(value).isAfter(dayjs(startDate), 'day') || dayjs(value).isSame(dayjs(startDate), 'day')) {
										return Promise.resolve();
									}
									return Promise.reject(new Error('Ngày kết thúc phải ở sau hoặc bằng ngày bắt đầu!'));
								},
							}),
							() => ({
								validator(_, value) {
									if (!value || dayjs(value).isAfter(dayjs(), 'day') || dayjs(value).isSame(dayjs(value), 'day')) {
										return Promise.resolve();
									}
									return Promise.reject(new Error('Không được chọn ngày quá khứ!'));
								},
							}),
						]}>
						<DatePicker format="DD-MM-YYYY" placeholder="Chọn ngày" />
					</Form.Item>
					<Form.Item>
						<Button loading={isLoading} type="primary" htmlType="submit" block>
							Submit
						</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>


	)
}

export default AppointmentHistory;
