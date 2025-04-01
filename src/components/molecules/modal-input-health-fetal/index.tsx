import React from 'react';
import { Modal, Form, Input, InputNumber, Button } from 'antd';

export interface HealthRecord {
	motherWeight: number;
	motherBloodPressure: string;
	motherHealthStatus: string;
	fetalWeight: number;
	fetalHeight: number;
	fetalHeartbeat: number;
	warning: string;
	createdAt: string;
	fetalId?: string;
}

const HealthRecordModal = ({
	visible,
	onCancel,
	onSubmit,
	initialData,
}: {
	visible: boolean;
	onCancel: () => void;
	onSubmit: (values: HealthRecord) => void;
	initialData?: HealthRecord;
}) => {
	const [form] = Form.useForm();

	const initialValues = initialData || {
		motherWeight: undefined,
		motherBloodPressure: "",
		motherHealthStatus: "",
		fetalWeight: undefined,
		fetalHeight: undefined,
		fetalHeartbeat: undefined,
		warning: "",
	};

	const handleFinish = (values: any) => {
		const submittedData: HealthRecord = {
			...values,
		};
		onSubmit(submittedData);
		form.resetFields();
	};

	return (
		<Modal
			title={initialData ? "Chỉnh sửa thông tin sức khỏe" : "Thêm thông tin sức khỏe"}
			open={visible}
			onCancel={() => {
				form.resetFields();
				onCancel();
			}}
			footer={null}
			width={600}
		>
			<Form
				form={form}
				layout="vertical"
				initialValues={initialValues}
				onFinish={handleFinish}
			>
				<Form.Item
					label="Cân nặng mẹ (kg)"
					name="motherWeight"
					rules={[{ required: true, message: "Vui lòng nhập cân nặng của mẹ!" }]}
				>
					<InputNumber
						min={0}
						step={0.1}
						style={{ width: "100%" }}
						placeholder="Nhập cân nặng (kg)"
					/>
				</Form.Item>

				<Form.Item
					label="Huyết áp mẹ (mmHg)"
					name="motherBloodPressure"
					rules={[{ required: true, message: "Vui lòng nhập huyết áp của mẹ!" }]}
				>
					<Input placeholder="Ví dụ: 120/80" />
				</Form.Item>

				<Form.Item
					label="Tình trạng sức khỏe mẹ"
					name="motherHealthStatus"
					rules={[{ required: true, message: "Vui lòng nhập tình trạng sức khỏe của mẹ!" }]}
				>
					<Input placeholder="Ví dụ: Sức khỏe bình thường" />
				</Form.Item>

				<Form.Item
					label="Cân nặng thai nhi (kg)"
					name="fetalWeight"
					rules={[{ required: true, message: "Vui lòng nhập cân nặng thai nhi!" }]}
				>
					<InputNumber
						min={0}
						step={0.1}
						style={{ width: "100%" }}
						placeholder="Nhập cân nặng (kg)"
					/>
				</Form.Item>

				<Form.Item
					label="Chiều cao thai nhi (cm)"
					name="fetalHeight"
					rules={[{ required: true, message: "Vui lòng nhập chiều cao thai nhi!" }]}
				>
					<InputNumber
						min={0}
						step={1}
						style={{ width: "100%" }}
						placeholder="Nhập chiều cao (cm)"
					/>
				</Form.Item>

				<Form.Item
					label="Nhịp tim thai nhi (lần/phút)"
					name="fetalHeartbeat"
					rules={[{ required: true, message: "Vui lòng nhập nhịp tim thai nhi!" }]}
				>
					<InputNumber
						min={0}
						step={1}
						style={{ width: "100%" }}
						placeholder="Nhập nhịp tim (lần/phút)"
					/>
				</Form.Item>

				<Form.Item
					label="Cảnh báo"
					name="warning"
				>
					<Input placeholder="Ví dụ: Không có dấu hiệu bất thường" />
				</Form.Item>

				<Form.Item>
					<div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
						<Button onClick={() => {
							form.resetFields();
							onCancel();
						}}>
							Hủy
						</Button>
						<Button type="primary" htmlType="submit">
							{initialData ? "Cập nhật" : "Thêm mới"}
						</Button>
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default HealthRecordModal;