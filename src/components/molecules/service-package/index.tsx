import {
    CheckOutlined,
} from '@ant-design/icons';
import BookingNowButton from '../../atoms/button/BookingNowButton';

interface iServicePackage {
    name: string;
    description?: string
    services: string[];
    image: string;
}
const ServicePackage = ({ name, services, image }: iServicePackage) => {

    return (
        <div className='border border-solid rounded-lg p-10 bg-pink-50 mt-10'>
            <div className='grid grid-cols-12 gap-10'>
                <div className='col-span-7'>
                    <img className='rounded-lg' src={image} alt="" />
                </div>
                <div className='col-span-5'>
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
                    <div className='mt-10 flex gap-5'>
                        <BookingNowButton />
                        <button type="button" className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2">
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServicePackage