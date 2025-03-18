import React from 'react';
import { Link } from 'react-router-dom';

interface PurchaseItem {
	courseName: string;
	date: string;
	price: string;
	paymentType: string;
}

function PurchasedHistory() {
	const purchases: PurchaseItem[] = [
		{
			courseName: "Gói khám thai 1",
			date: "15/3/2025",
			price: "₫399,000",
		},
	];

	return (
		<div className="max-w-full mx-20 mt-8">
			<h2 className="text-3xl font-semibold mb-6 font-sans">Lịch sử thanh toán</h2>
			<div className="border-b border-gray-200">
				<ul className="flex space-x-8 pb-3">
					<li className="font-bold text-black border-b-2 border-black">Gói </li>
				</ul>
			</div>

			<table className="w-full mt-6 border-collapse">
				<thead>
					<tr className="text-left text-gray-600">
						<th className="pb-3 border-b">Tên gói</th>
						<th className="pb-3 border-b">Ngày thanh toán</th>
						<th className="pb-3 border-b">Tổng tiền</th>
						<th className="pb-3 border-b"></th>
					</tr>
				</thead>
				<tbody>
					{purchases.map((purchase, index) => (
						<tr key={index} className="text-gray-700">
							<td className="py-4">
								<div className="flex items-center">
									<span className="inline-block w-6 h-6 mr-2">🛒</span>
									<Link to="#" className="text-blue-600 hover:underline">
										{purchase.courseName}
									</Link>
								</div>
							</td>
							<td className="py-4">{purchase.date}</td>
							<td className="py-4">{purchase.price}</td>
							<td className="py-4">
								<button className="px-3 py-1 mr-2 text-sm border rounded border-gray-400">Receipt</button>
								<button className="px-3 py-1 text-sm border rounded border-gray-400">Invoice</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default PurchasedHistory
