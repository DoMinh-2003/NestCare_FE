import { Button, DatePicker, Form, Input, message, Modal, Select } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { getUserDataFromLocalStorage } from '../../../constants/function';
import { FetalRecordSubmit } from '../../../model/Fetal';
import useFetalService from '../../../services/useFetalService';
import { calculateExpectedDeliveryDate } from '../../../utils/formatDate';

const { Option } = Select;

interface FetalCreationProps {
	open: boolean;
	onClose: () => void;
}

function FetalCreation({ open, onClose }: FetalCreationProps) {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const { createFetal } = useFetalService();
	const user = getUserDataFromLocalStorage();

	// Handle form submission
	const onFinish = async (values: FetalRecordSubmit) => {
		const formattedValues = {
			...values,
			dateOfPregnancyStart: moment(values.dateOfPregnancyStart).format('YYYY-MM-DD'),
			expectedDeliveryDate: moment(values.expectedDeliveryDate).format('YYYY-MM-DD'),
			motherId: user.id,
		};
		console.log('Submitted values:', formattedValues);

		setLoading(true);
		try {
			const response = await createFetal(formattedValues);
			console.log('Created fetal:', response);
			message.success('Tạo hồ sơ thai nhi thành công!');
			form.resetFields();
			onClose();
		} catch (error) {
			message.error('Tạo hồ sơ không thành công, hãy thử lại!');
			console.log('Error creating fetal:', error);
		} finally {
			setLoading(false);
		}
	};

	// Handle dateOfPregnancyStart change to auto-calculate expectedDeliveryDate
	const handlePregnancyStartChange = (date: moment.Moment | null) => {
		if (date) {
			const calculatedDate = calculateExpectedDeliveryDate(date.format('YYYY-MM-DD'));
			form.setFieldsValue({
				expectedDeliveryDate: moment(calculatedDate),
			});
		} else {
			form.setFieldsValue({
				expectedDeliveryDate: null,
			});
		}
	};

	// Reset form when modal opens
	useEffect(() => {
		if (open) {
			form.resetFields();
			form.setFieldsValue({
				status: 'PREGNANT', // Default status
			});
		}
	}, [open, form]);

	return (
		<Modal
			title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>Tạo Hồ Sơ Thai Nhi</span>}
			open={open}
			onCancel={onClose}
			footer={null} // Custom footer bên trong form
			centered
			bodyStyle={{ padding: '24px' }}
		>
			<Form
				form={form}
				layout="vertical"
				onFinish={onFinish}
				initialValues={{ status: 'PREGNANT' }}
			>
				<Form.Item
					label="Tên em bé"
					name="name"
					rules={[{ required: true, message: 'Vui lòng nhập tên em bé!' }]}
				>
					<Input placeholder="Nhập tên em bé" size="large" />
				</Form.Item>

				<Form.Item label="Ghi chú" name="note">
					<Input placeholder="Nhập ghi chú (ví dụ: 1 bé hay 2 bé)" size="large" />
				</Form.Item>

				<Form.Item
					label="Ngày bắt đầu mang thai"
					name="dateOfPregnancyStart"
					rules={[{ required: true, message: 'Vui lòng chọn ngày bắt đầu mang thai!' }]}
				>
					<DatePicker
						format="DD/MM/YYYY"
						style={{ width: '100%' }}
						size="large"
						onChange={handlePregnancyStartChange}
					/>
				</Form.Item>

				<Form.Item
					label="Ngày dự sinh"
					name="expectedDeliveryDate"
					rules={[{ required: true, message: 'Vui lòng kiểm tra ngày dự sinh!' }]}
				>
					<DatePicker format="DD/MM/YYYY" style={{ width: '100%' }} size="large" disabled />
				</Form.Item>

				<Form.Item
					label="Tình trạng sức khỏe"
					name="healthStatus"
					rules={[{ required: true, message: 'Vui lòng nhập tình trạng sức khỏe!' }]}
				>
					<Input placeholder="Nhập tình trạng sức khỏe" size="large" />
				</Form.Item>

				<Form.Item label="Trạng thái" name="status">
					<Select size="large" disabled>
						<Option value="PREGNANT">Đang mang thai</Option>
						<Option value="BORN">Đã sinh</Option>
						<Option value="MISSED">Sảy thai sớm</Option>
						<Option value="STILLBIRTH">Thai chết lưu</Option>
						<Option value="ABORTED">Phá thai</Option>
						<Option value="MISCARRIAGE">Sảy thai</Option>
					</Select>
				</Form.Item>

				<Form.Item>
					<div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
						<Button onClick={onClose} size="large">
							Hủy
						</Button>
						<Button type="primary" htmlType="submit" loading={loading} size="large">
							Gửi
						</Button>
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
}

export default FetalCreation;
