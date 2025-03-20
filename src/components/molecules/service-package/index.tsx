import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '../../../constants/routes';
import { Package } from '../../../model/Pakage';
import useOrderService from '../../../services/useOrderService';
import { formatMoney } from '../../../utils/formatMoney';
import style from './style.module.scss';
import { FaCalendarAlt, FaInfoCircle } from "react-icons/fa";


interface ServicePackageProps {
    servicePackage: Package;
}

const ServicePackage = ({ servicePackage }: ServicePackageProps) => {
    const { createOrder } = useOrderService();
    const navigate = useNavigate()

    const { id, name, description, price } = servicePackage

    const handleBookingPackage = async (packageId: string) => {
        const storedUser = localStorage.getItem('USER');
        if (storedUser) {
            const userObject = JSON.parse(storedUser);
            console.log(userObject);
            console.log("userId: ", userObject.id, "packageId: ", packageId);
            const response = await createOrder({ userId: userObject.id, packageId: packageId });
            if (response) {
                window.location.href = response;
            }
        }
    }

    return (
        <>
            <div className="flex justify-center items-center min-h-fit bg-gradient-to-r from-[#F5D4E4] to-[#E5E0F5] p-4">
                <div
                    key={id}
                    className="max-w-md bg-white rounded-2xl shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-105"
                >
                    <div className="p-6">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-sans">
                            {name}
                        </h2>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 font-sans">
                            {formatMoney(Number(price))}
                        </h2>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            {description}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button
                                className="flex-1 bg-[#E8C1C5] text-white py-3 px-6 rounded-lg font-medium
                         transform transition-all duration-300 hover:bg-[#F5D4E4] hover:shadow-md
                         focus:outline-none focus:ring-2 focus:ring-[#E8C1C5] focus:ring-opacity-50"
                                onClick={() => handleBookingPackage(id)}
                            >
                                <FaCalendarAlt className="inline-block mr-2" />
                                Đăng ký Ngay
                            </button>
                            <button
                                className="flex-1 border-2 border-[#E8C1C5] text-[#E8C1C5] py-3 px-6 rounded-lg font-medium
                         transform transition-all duration-300 hover:bg-[#E8C1C5] hover:text-white hover:shadow-md
                         focus:outline-none focus:ring-2 focus:ring-[#E8C1C5] focus:ring-opacity-50"
                                onClick={() => navigate(`${USER_ROUTES.SERVICES_PAGE}/${id}`)}
                            >
                                <FaInfoCircle className="inline-block mr-2" />
                                Xem Chi Tiết
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default ServicePackage
