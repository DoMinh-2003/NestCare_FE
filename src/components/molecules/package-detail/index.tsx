import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CustomBreadcrumbs, { BreadcrumbsProps } from '../../atoms/breadcrumbs/CustomBreadcrumbs';
import usePackageService from '../../../services/usePackageService';
import { Package } from '../../../model/Pakage';
import { formatMoney } from '../../../utils/formatMoney';
import useOrderService from '../../../services/useOrderService';

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
		<div className='mx-10'>
			<div className="w-full py-2 rounded-e-md rounded-s-lg bg-[#654ea3] bg-gradient-to-r from-[#eaafc8] to-[#654ea3] text-white">
				<CustomBreadcrumbs items={breadcrumbItems} />
			</div>
			<div className="mt-6 relative shadow-md max-w-2xl mx-auto background-card p-6 bg-gradient-to-br from-[#fafaff] to-[#e7e7e7] bg-[length:200%_200%] animate-gradient-shift select-none">
				{/* Package Header */}
				<div className=''>
					<h1 className="text-2xl font-bold text-gray-800 mb-2">{data.name}</h1>
					<p className="text-gray-600 mb-4">{data.description}</p>
				</div>

				{/* Package Details */}
				<div className="flex flex-col sm:flex-row sm:items-center mb-4">
					<span className="text-xl font-semibold text-gray-800">
						Giá: {formatMoney(Number(data.price))}
					</span>
					<span className="sm:ml-4 text-gray-700">
						Thời hạn: {data.period.toLowerCase() === 'weekly' ? 'Theo tuần' : data.period}
					</span>
				</div>

				{/* Included Services */}
				<h2 className="text-xl font-semibold text-gray-800 mb-2">Dịch vụ bao gồm</h2>
				<ul className="flex justify-center gap-10">
					{data?.packageServices?.map((pkgService) => (
						<li
							key={pkgService.id}
							className="p-4 border border-gray-300 rounded-md bg-gray-50"
						>
							<div className="font-medium text-lg text-gray-800">
								{pkgService.service.name}
							</div>
							<div className="text-gray-700">
								Giá: {formatMoney(pkgService.service.price)}
							</div>
							<div className="text-gray-700">
								Mô tả: {pkgService.service.description}
							</div>
						</li>
					))}
				</ul>

				{/* Call-to-Action Buttons */}
				<div className="mt-6 flex flex-col justify-center sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
					<button onClick={() => handleBookingPackage()} className="w-1/2 px-20 py-4 rounded-lg bg-[#ee9ca7] bg-gradient-to-r from-[#ffdde1] to-[#ee9ca7] border-0 text-center cursor-pointer transition duration-400 hover:shadow-[7px_5px_56px_-14px_#ffb4df] active:scale-[0.97] active:shadow-[7px_5px_56px_-10px_#00c0cc]">
						Mua ngay
					</button>
				</div>
			</div>
		</div>
	);
}

export default PackageDetail;