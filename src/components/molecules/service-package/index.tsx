import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '../../../constants/routes';
import { Package } from '../../../model/Pakage';
import useOrderService from '../../../services/useOrderService';
import { formatMoney } from '../../../utils/formatMoney';
import style from './style.module.scss';

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
            <div className={style.card}>
                <div className={style.header}>
                    <span className={style.title}>{name}</span>
                    <span className={style.price}>{formatMoney(Number(price))}</span>
                </div>
                <p className={style.desc}>{description}</p>
                <div className='flex flex-col gap-3'>
                    <button type="button" className={style.action} onClick={() => handleBookingPackage(id)}>Đăng ký Ngay</button>
                    <button type="button" className={style.action} onClick={() => navigate(`/${USER_ROUTES.SERVICES_PAGE}/${id}`)}>Xem Chi Tiết</button>
                </div>
            </div>
        </>
    )
}

export default ServicePackage
