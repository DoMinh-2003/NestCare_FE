import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Image, Skeleton } from 'antd';
import CustomBreadcrumbs, { BreadcrumbsProps } from '../../atoms/breadcrumbs/CustomBreadcrumbs';
import usePackageService from '../../../services/usePackageService';
import { Package } from '../../../model/Pakage';
import { formatMoney } from '../../../utils/formatMoney';
import useOrderService from '../../../services/useOrderService';

const PackageDetail = () => {
	// State and hooks
	const [data, setData] = useState<Package | null>(null);
	const [loading, setLoading] = useState(true);
	const { id } = useParams();
	const { getPackageById } = usePackageService();
	const { createOrder } = useOrderService();

	// Fetch package data
	useEffect(() => {
		if (!id) return;
		setLoading(true);
		getPackageById(id)
			.then((response) => setData(response.data))
			.catch((error) => console.error('Error fetching package:', error))
			.finally(() => setLoading(false));
	}, [id, getPackageById]);

	// Handle booking
	const handleBookingPackage = async () => {
		if (!id) return;
		const storedUser = localStorage.getItem('USER');
		if (storedUser) {
			const userObject = JSON.parse(storedUser);
			const response = await createOrder({ userId: userObject.id, packageId: id });
			if (response) window.location.href = response;
		}
	};

	// Loading state
	if (loading) {
		return (
			<div className="container mx-auto p-6">
				<Skeleton active paragraph={{ rows: 4 }} />
			</div>
		);
	}

	// Data not found state
	if (!data) {
		return <div className="text-center text-red-500 font-semibold">Không tìm thấy gói dịch vụ</div>;
	}

	// Breadcrumbs
	const breadcrumbItems: BreadcrumbsProps[] = [
		{ title: 'Trang chủ', link: '/' },
		{ title: 'Dịch vụ', link: '/services' },
		{ title: data.name },
	];

	return (
		<div className="container mx-auto p-6 bg-gradient-to-tr from-blue-100 to-white">
			{/* Header */}
			<div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-8 rounded-xl shadow-lg">
				<CustomBreadcrumbs items={breadcrumbItems} className="text-white" />
				<h1 className="text-3xl font-bold mt-4">{data.name}</h1>
				<p className="text-xl mt-2">
					Giá: {formatMoney(data.price)} | Thời hạn: {data.period === 'WEEKLY' ? 'Theo Tuần' : 'Theo tháng'}
				</p>
				<p className="text-xl mt-2">Mô tả: {data.description}</p>
			</div>

			{/* Service Cards */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
				{data.packageServices?.map((pkgService) => (
					<div
						key={pkgService.id}
						className="relative p-6 rounded-lg bg-white shadow-lg transform hover:scale-105 transition-transform duration-300"
					>
						<div className="flex justify-center">
							<Image
								alt="services_img"
								src="/images/healthcare.png"
								width={40}
								height={40}
								className="object-contain"
								preview={false}
							/>
						</div>
						<h3 className="text-xl font-bold mt-4">{pkgService.service.name}</h3>
						<p className="text-sm my-2">{pkgService.service.description}</p>
						<p className="text-sm my-2">Số lượt: {pkgService.slot}</p>
						<span className="font-semibold">Giá: {formatMoney(pkgService.service.price)}</span>
					</div>
				))}
			</div>

			{/* Call to Action */}
			<div className="mt-8 flex justify-center">
				<button
					className="px-8 py-4 rounded-lg bg-gradient-to-r from-pink-400 to-red-500 text-white shadow-lg transform hover:scale-105 transition-transform duration-300"
					onClick={handleBookingPackage}
				>
					Mua ngay
				</button>
			</div>
		</div>
	);
};

export default PackageDetail;