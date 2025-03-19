import { Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { Purchase } from '../../../model/Pakage';
import useOrderService from '../../../services/useOrderService';
import { formatDate } from '../../../utils/formatDate';
import { formatMoney } from '../../../utils/formatMoney';


function PurchasedHistory() {

	const [purchases, setPurchases] = useState<Purchase[]>([]);
	const { getOrderByUserId } = useOrderService();

	useEffect(() => {
		const userData = localStorage.getItem('USER');
		if (userData) {
			const user = JSON.parse(userData);
			const fetchOrders = async () => {
				const response = await getOrderByUserId(user.id);
				setPurchases(response);
			};
			fetchOrders();
		} else {
			console.error('User not found in local storage');
		}
	}, []);

	const statusMap: { [key: string]: string } = {
		PENDING: 'Chờ xử lý',
		PAID: 'Hoàn thành',
		CANCELLED: 'Đã hủy',
	};

	const columns = [
		{
			title: 'Tên dịch vụ',
			dataIndex: ['package', 'name'],
			key: 'name',
		},
		{
			title: 'Giá (VND)',
			dataIndex: ['package', 'price'],
			key: 'price',
			render: (price: string) => formatMoney(Number(price)),
		},
		{
			title: 'Mô tả',
			dataIndex: ['package', 'description'],
			key: 'description',
		},
		{
			title: 'Ngày đặt',
			dataIndex: 'createdAt',
			key: 'date',
			render: (date: string) => formatDate(date),
			sorter: (a: Purchase, b: Purchase) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		},
		{
			width: '10',
			title: 'Trạng thái',
			dataIndex: 'status',
			key: 'status',
			filters: [
				{ text: 'Chờ xử lý', value: 'PENDING' },
				{ text: 'Hoàn thành', value: 'COMPLETED' },
				{ text: 'Đã hủy', value: 'CANCELLED' }
			],
			onFilter: (value: string | number | boolean, record: Purchase) => record.status === value,
			render: (status: string) => {
				let color = '';
				switch (status) {
					case 'PENDING':
						color = 'orange';
						break;
					case 'PAID':
						color = 'green';
						break;
					case 'CANCELLED':
						color = 'red';
						break;
					default:
						color = 'gray';
				}
				return <Tag color={color}>{statusMap[status] || 'Không xác định'}</Tag>;
			},
		},
	];

	return (
		<div className="max-w-full mx-20 mt-8 min-h-fit">
			<h2 className="text-3xl font-semibold mb-6 font-sans">Lịch sử thanh toán</h2>

			<Table
				dataSource={purchases}
				columns={columns}
				rowKey="id"
				pagination={{ pageSize: 10 }}
			/>
		</div>
	);
}

export default PurchasedHistory;
