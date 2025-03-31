"use client"

import { Table, Tag } from "antd"
import { useEffect, useState } from "react"
import { formatMoney } from "../../../utils/formatMoney"
import { formatDate } from "../../../utils/formatDate"
// Define the Transaction interface based on your data structure
interface User {
	id: string
	username: string
	email: string
	fullName: string
	phone: string
	role: string
}

interface UserPackage {
	id: string
	status: string
	isActive: boolean
	createdAt: string
	updatedAt: string
}

interface Transaction {
	id: string
	type: string
	status: string
	amount: string
	description: string
	createdAt: string
	user: User
	userPackage: UserPackage
}

function TransactionHistory() {
	const [transactions, setTransactions] = useState<Transaction[]>([])

	useEffect(() => {
		// For demonstration, we'll use the sample data you provided
		// In a real app, you would fetch this from your API
		const sampleData = [
			{
				id: "a06c7bac-f0b0-4605-8eb2-677c7683ffee",
				type: "PURCHASE_PACKAGE",
				status: "SUCCESS",
				amount: "264000.00",
				description: "Mua gói dịch vụ: Premium Baby 3",
				paymentGatewayReference: null,
				createdAt: "2025-03-31T03:46:05.146Z",
				user: {
					id: "9fda19be-c8c8-46f5-ae79-2649d7d0069c",
					username: "mother",
					email: "thanhtung3523@gmail.com",
					fullName: "mother",
					image: null,
					phone: "0962868417",
					role: "user",
					isDeleted: false,
				},
				appointment: null,
				userPackage: {
					id: "8c24b614-aeed-43d3-910e-b9bc259af1c5",
					status: "PAID",
					isActive: true,
					isDeleted: false,
					createdAt: "2025-03-31T03:44:57.316Z",
					updatedAt: "2025-03-31T03:46:06.000Z",
				},
			},
		]

		setTransactions(sampleData as Transaction[])

		// In a real implementation, you would fetch data like this:
		// const fetchTransactions = async () => {
		//   const userData = getUserDataFromLocalStorage();
		//   if (userData) {
		//     const response = await getTransaction(userData.id);
		//     setTransactions(response);
		//   }
		// };
		// fetchTransactions();
	}, [])

	const statusMap: { [key: string]: string } = {
		PENDING: "Chờ xử lý",
		PAID: "Hoàn thành",
		SUCCESS: "Thành công",
		CANCELED: "Đã hủy",
	}

	const columns = [
		{
			title: "Loại giao dịch",
			dataIndex: "type",
			key: "type",
			render: (type: string) => (type === "PURCHASE_PACKAGE" ? "Mua gói dịch vụ" : type),
		},
		{
			title: "Số tiền (VND)",
			dataIndex: "amount",
			key: "amount",
			render: (amount: string) => formatMoney(Number(amount)),
		},
		{
			title: "Mô tả",
			dataIndex: "description",
			key: "description",
		},
		{
			title: "Ngày giao dịch",
			dataIndex: "createdAt",
			key: "date",
			render: (date: string) => formatDate(date),
			sorter: (a: Transaction, b: Transaction) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
		},
		{
			title: "Trạng thái",
			dataIndex: "status",
			key: "status",
			filters: [
				{ text: "Thành công", value: "SUCCESS" },
				{ text: "Chờ xử lý", value: "PENDING" },
				{ text: "Hoàn thành", value: "PAID" },
				{ text: "Đã hủy", value: "CANCELED" },
			],
			onFilter: (value: string | number | boolean, record: Transaction) => record.status === value,
			render: (status: string) => {
				let color = ""
				switch (status) {
					case "PENDING":
						color = "orange"
						break
					case "PAID":
					case "SUCCESS":
						color = "green"
						break
					case "CANCELED":
						color = "red"
						break
					default:
						color = "gray"
				}
				return <Tag color={color}>{statusMap[status] || "Không xác định"}</Tag>
			},
		},
		{
			title: "Trạng thái gói",
			dataIndex: ["userPackage", "status"],
			key: "packageStatus",
			render: (status: string) => {
				let color = ""
				switch (status) {
					case "PENDING":
						color = "orange"
						break
					case "PAID":
						color = "green"
						break
					case "CANCELED":
						color = "red"
						break
					default:
						color = "gray"
				}
				return <Tag color={color}>{statusMap[status] || "Không xác định"}</Tag>
			},
		},
	]

	return (
		<div className="max-w-full mx-20 mt-8 min-h-fit">
			<h2 className="text-3xl font-semibold mb-6 font-sans">Lịch sử giao dịch</h2>

			<Table dataSource={transactions} columns={columns} rowKey="id" />
		</div>
	)
}

export default TransactionHistory

