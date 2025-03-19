import { Modal, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { FetalRecord } from "../../../model/Fetal";
import useAppointmentService from "../../../services/useApoitment";
import useFetalService from "../../../services/useFetalService";
import dayjs from "dayjs";
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

function AppointmentHistory() {

	const [fetals, setFetals] = useState<FetalRecord[]>([]);
	const [selectedAppointment, setSelectedAppointment] = useState<FetalRecord>(null); // State để quản lý chi tiết cuộc hẹn
	const [isModalVisible, setIsModalVisible] = useState(false); // Quản lý trạng thái mở/đóng modal
	const [dataTable, setDataTable] = useState([]);
	const { getFetalsByMotherId } = useFetalService();
	const { getAppointments } = useAppointmentService();
	const handleGetFetalsByMotherId = async () => {
		const user = localStorage.getItem('USER');
		if (user) {
			const userId = JSON.parse(user).id;

			// Fetch fetal records by mother's ID
			const response = await getFetalsByMotherId(userId);
			console.log('Fetched fetals response:', response);

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

	// Hàm để mở modal với thông tin chi tiết cuộc hẹn
	const showAppointmentDetails = async (appointment: FetalRecord) => {
		console.log('====================================');
		console.log(appointment);
		console.log('====================================');
		const response = await getAppointments(appointment.appointments[0].id);
		setSelectedAppointment(response);
		console.log(
			"Appointments Detail", response
		);

		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
	};

	useEffect(() => {
		handleGetFetalsByMotherId();
	}, []);

	return (
		<div className="min-h-[420px] mx-10">
			<Table
				columns={columns}
				dataSource={dataTable}
			/>
		</div>


	)
}

export default AppointmentHistory;
