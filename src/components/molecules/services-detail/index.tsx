import type React from "react"
import { Card, Divider, Table, Typography, Badge } from "antd"

interface Service {
	id: string
	name: string
	price: number
	isInPackage: boolean
}

interface ServiceResponse {
	services: Service[]
	totalCostWithoutPackage: number
	depositAmount: number
	finalCost: number
}

export const ServiceDetails: React.FC<{ data: ServiceResponse }> = ({ data }) => {
	if (!data) {
		return (
			<Card className="shadow-md rounded-lg">
				<div className="p-8 text-center">
					<Typography.Text type="secondary">Không có dữ liệu dịch vụ</Typography.Text>
				</div>
			</Card>
		)
	}

	const columns = [
		{
			title: "Tên Dịch Vụ",
			dataIndex: "name",
			key: "name",
			render: (text: string) => <Typography.Text strong>{text}</Typography.Text>,
		},
		{
			title: "Giá",
			dataIndex: "price",
			key: "price",
			render: (price: number) => (
				<Typography.Text type="success" strong>
					{price.toLocaleString()} VND
				</Typography.Text>
			),
		},
		{
			title: "Thuộc Gói Dịch Vụ",
			dataIndex: "isInPackage",
			key: "isInPackage",
			render: (isInPackage: boolean) => (
				<Badge
					status={isInPackage ? "processing" : "error"}
					text={
						<Typography.Text type={isInPackage ? "primary" : "danger"}>{isInPackage ? "Có" : "Không"}</Typography.Text>
					}
				/>
			),
		},
	]

	return (
		<Card
			className="shadow-md rounded-lg"
			title={
				<div className="flex items-center">
					<div className="w-1 h-6 bg-blue-500 rounded mr-3"></div>
					<Typography.Title level={4} style={{ margin: 0 }}>
						Thông tin Dịch Vụ
					</Typography.Title>
				</div>
			}
		>
			<Table dataSource={data.services} columns={columns} rowKey="id" pagination={false} bordered className="mb-6" />

			<Divider />

			<div className="grid gap-3 px-4">
				<div className="flex justify-between items-center">
					<Typography.Text strong className="text-gray-700">
						Tổng chi phí không có trong gói:
					</Typography.Text>
					<Typography.Text type="success" strong className="text-lg">
						{data.totalCostWithoutPackage.toLocaleString()} VND
					</Typography.Text>
				</div>

				<div className="flex justify-between items-center">
					<Typography.Text strong className="text-gray-700">
						Tiền cọc:
					</Typography.Text>
					<Typography.Text type="primary" strong className="text-lg">
						{data.depositAmount.toLocaleString()} VND
					</Typography.Text>
				</div>

				<Divider style={{ margin: "12px 0" }} />

				<div className="flex justify-between items-center">
					<Typography.Text strong className="text-gray-700 text-lg">
						Tổng chi phí cuối:
					</Typography.Text>
					<Typography.Text type="danger" strong className="text-xl">
						{data.finalCost.toLocaleString()} VND
					</Typography.Text>
				</div>
			</div>
		</Card>
	)
}

