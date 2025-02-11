import { Input } from 'antd'
import Title from '../../atoms/text/Title'

const LearnMoreAboutNestCare = () => {
    return (
        <div className="grid grid-cols-12 mt-20">
            <div className="col-span-5 text-5xl text-pink-700 font-bold grid place-items-center">
                <div>
                    <Title text='Tìm hiểu thêm về' />
                    <Title className="py-2" text='NestCare?' />
                    <Title text='Đăng ký nhận thông tin' />
                    <div className="grid grid-cols-12 gap-5 mt-20">
                        <div className="col-span-7">
                            <Input className="p-2 hover:border-red-700" placeholder="Nhập email của bạn" type="text" />
                        </div>
                        <div className="col-span-5">
                            <button type="button" className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                                Nhận bản tin
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-span-7 ">
                <div >
                    <img className="rounded-xl" src="https://sihospital.com.vn/images/timhieuthemsih.jpg" alt="" />
                </div>
            </div>
        </div>
    )
}

export default LearnMoreAboutNestCare