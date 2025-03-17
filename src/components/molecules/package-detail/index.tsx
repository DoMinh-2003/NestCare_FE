import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CustomBreadcrumbs, { BreadcrumbsProps } from '../../atoms/breadcrumbs/CustomBreadcrumbs';
import usePackageService from '../../../services/usePackageService';


const breadcrumbItems: BreadcrumbsProps[] = [
	{ title: "Trang chủ", link: "/" },
	{ title: "Dịch vụ", link: "/goi-dich-vu" },
	{ title: "Thông tin gói dịch vụ" },
];

function PackageDetail() {

	const { getPackageById } = usePackageService()

	const { id } = useParams();

	useEffect(() => {
		if (!id) return;
		console.log(id);
		const response = getPackageById(id);
		console.log(response);
	}, [id])

	return (
		<div>PackageDetail
			<CustomBreadcrumbs items={breadcrumbItems} />



		</div>
	)
}

export default PackageDetail