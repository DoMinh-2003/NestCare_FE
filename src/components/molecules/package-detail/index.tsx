import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CustomBreadcrumbs, { BreadcrumbsProps } from '../../atoms/breadcrumbs/CustomBreadcrumbs';
import usePackageService from '../../../services/usePackageService';
import { Package } from '../../../model/Pakage';
import { formatMoney } from '../../../utils/formatMoney';
import useOrderService from '../../../services/useOrderService';
import { Image } from 'antd';

function PackageDetail() {
	// Define state with proper typing and initial value
	const [data, setData] = useState<Package | null>(null);
	const [loading, setLoading] = useState(true);

	const { getPackageById } = usePackageService();
	const { createOrder } = useOrderService();
	const { id } = useParams();

	useEffect(() => {
		if (!id) return;

		setLoading(true);
		getPackageById(id)
			.then((response) => {
				setData(response.data);
				setLoading(false);
			})
			.catch((error) => {
				console.error("Error fetching package:", error);
				setLoading(false);
			});
	}, []);

	// Show loading state while fetching data
	if (loading) {
		return <div>Loading...</div>;
	}

	// Handle case where data couldn't be fetched
	if (!data) {
		return <div>Package not found</div>;
	}

	// Dynamic breadcrumbs using package name
	const breadcrumbItems: BreadcrumbsProps[] = [
		{ title: "Trang chủ", link: "/" },
		{ title: "Dịch vụ", link: "/services" },
		{ title: data.name },
	];

	const handleBookingPackage = async () => {
		console.log('orderid:-=--------------------', id);
		const storedUser = localStorage.getItem('USER');
		if (storedUser) {
			const userObject = JSON.parse(storedUser);
			console.log(userObject);
			const response = await createOrder({ userId: userObject.id, packageId: id });
			if (response) {
				window.location.href = response;
			}
		}
	}

	return (
		<div className="container mx-auto p-6 bg-gradient-to-tr from-blue-100 to-white">
			{/* Header */}
			<div className="relative bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-8 rounded-xl shadow-lg">
				<div className="breadcrumbs">
					<span className="text-sm text-white">
						<CustomBreadcrumbs items={breadcrumbItems} className='text-white' />
					</span>
				</div>
				<h1 className="text-3xl font-bold">Khám dịch vụ VIP</h1>
				<p className="text-xl mt-2">Giá: {formatMoney(data.price)} | Thời hạn: {data.period === 'WEEKLY' ? 'Theo Tuần' : '...'}</p>
				<p className="text-xl mt-2">Mô tả gói dịch vụ: {data.description}</p>
			</div>

			{/* Body */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
				{data?.packageServices?.map((pkgService) => (
					<div>
						<div
							key={pkgService.id}
							className="relative p-6 rounded-lg bg-white shadow-lg hover:scale-105 transition-transform duration-300"
						>
							<div className='flex justify-center'>
								<Image alt='services_img' src='../../../../public/images/healthcare.png' width={40} height={40} className='object-contain text-center w-6 h-6' preview={false} />
							</div>
							<h3 className="text-xl font-bold font-sans">{pkgService.service.name}</h3>
							<p className="text-sm my-2 font-sans">{pkgService.service.description}</p>
							<p className="text-sm my-2 font-sans">Số lượt: {pkgService.slot}</p>
							<span className="font-semibold font-sans">Giá: {formatMoney(pkgService.service.price)}</span>
						</div>
					</div>
				))}
			</div>

			{/* CTA */}
			<div className="mt-8 flex justify-center">
				<button className="px-8 py-4 rounded-lg bg-gradient-to-r from-pink-400 to-red-500 text-white shadow-lg hover:scale-105 transition-transform duration-300" onClick={handleBookingPackage}>
					Mua ngay
				</button>
			</div>
		</div>
	);
}

export default PackageDetail;