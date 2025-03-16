import { Input } from 'antd';
import Title from '../../atoms/text/Title';

const LearnMoreAboutNestCare = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-center mt-20 px-4 md:px-12">
            {/* Left side: Content */}
            <div className="md:col-span-5 flex flex-col justify-center h-full">
                <Title text="Tìm hiểu thêm về NestCare" />
                <Title className='mt-2' text="Đăng ký nhận thông tin" />
                <div className="grid grid-cols-12 gap-6 mt-8">
                    <div className="col-span-7">
                        <Input
                            className="h-12 p-2 border border-gray-300 hover:border-red-700"
                            placeholder="Nhập email của bạn"
                            type="text"
                        />
                    </div>
                    <div className="col-span-5">
                        <button
                            type="button"
                            className="w-full h-12 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-6 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                        >
                            Nhận bản tin
                        </button>
                    </div>
                </div>
            </div>

            {/* Right side: Image */}
            <div className="md:col-span-7 flex justify-center">
                <img
                    className="rounded-xl w-full max-w-lg shadow-lg"
                    src="https://sihospital.com.vn/images/timhieuthemsih.jpg"
                    alt="NestCare"
                />
            </div>
        </div>
    );
};

export default LearnMoreAboutNestCare;
