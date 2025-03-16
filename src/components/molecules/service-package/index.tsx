import { useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '../../../constants/routes';
import { Package } from '../../../model/Pakage';
import { Services } from '../../../model/service';
import useOrderService from '../../../services/useOrderService';
import { formatMoney } from '../../../utils/formatMoney';
import style from './style.module.scss';

interface ServicePackageProps {
    servicePackage: Package;
}

const ServicePackage = ({ servicePackage }: ServicePackageProps) => {
    const { createOrder } = useOrderService();
    const navigate = useNavigate()

    const { id, name, description, packageServices, price } = servicePackage

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
                <ul className={style.lists}>
                    {packageServices?.map((item: Services) =>
                        <li className={style.list} key={item.id}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span key={item.service.id}>{item.service.name}</span>
                        </li>
                    )}
                </ul>
                <div className='flex flex-col gap-3'>
                    <button type="button" className={style.action} onClick={() => handleBookingPackage(id)}>Đăng ký Ngay</button>
                    <button type="button" className={style.action} onClick={() => navigate(`/${USER_ROUTES.SERVICES_PAGE}/${link}`)}>Xem Chi Tiết</button>
                </div>
            </div>
        </>
    )
}

export default ServicePackage
