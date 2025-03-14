import {
    CheckOutlined,
} from '@ant-design/icons';
import BookingNowButton from '../../atoms/button/BookingNowButton';
import { Link } from 'react-router-dom';
import { USER_ROUTES } from '../../../constants/routes';

interface iServicePackage {
    name: string;
    description?: string
    services: string[];
    image: string;
    link?: string;
}
const ServicePackage = ({ name, services, image, link }: iServicePackage) => {

    return (
        <div className='border border-solid rounded-lg p-10 bg-pink-50'>
            <div className=' gap-10'>

                <div className=''>
                    <div className='text-3xl font-bold'>
                        {name}
                    </div>
                    <div className='grid grid-cols-2'>
                        {
                            services.map((item) => (
                                <button type="button" className="mt-5 font-bold text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                                    <CheckOutlined className='text-pink-700 font-bold text-lg' />   {item}
                                </button>
                            ))
                        }
                    </div>
                    <div className='mt-10 flex justify-center gap-5'>
                        <BookingNowButton />
                        <Link to={`/${USER_ROUTES.SERVICES_PAGE}/${link}`}>
                            <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                                Xem chi tiết
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServicePackage