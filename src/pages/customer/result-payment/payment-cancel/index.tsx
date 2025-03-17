import { Link } from 'react-router-dom';
import paymentCancelImg from '../../../../../public/images/cancel.png';


const PaymentCancel = () => {
	// const { state } = useLocation();
	// const { orderId, errorCode } = state || {};

	return (
		<>
			<div className="border border-solid h-fit p-5 flex flex-col items-center gap-5 max-w-[550px] mx-auto rounded-md bg-[#fff3f3]" style={{ boxShadow: "15px 15px 30px #bebebe, -15px -15px 30px #ffffff" }}>
				<img src={paymentCancelImg} alt="payment-success" className='h-[300px]' />
				<h1 className="text-2xl font-bold text-red-800">Đã Hủy Thanh Toán!</h1>
				<p className='text-xl font-sans'>Thanh Toán Đã Được Hủy</p>
				<Link to="/">
					<button className="text-gray-900 mt-5 bg-blue-500 text-lg px-12 py-3 rounded-lg bg-gray-200 cursor-pointer border border-gray-200 transition duration-300 shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] active:text-gray-500 active:shadow-[inset_4px_4px_12px_#c5c5c5,inset_-4px_-4px_12px_#ffffff]">
						Trở về trang chủ
					</button>
				</Link>
				<Link to="/services">
					<button className="text-gray-900 mt-5 bg-blue-500 px-7 py-3 text-lg rounded-lg bg-gray-200 cursor-pointer border border-gray-200 transition duration-300 shadow-[6px_6px_12px_#c5c5c5,-6px_-6px_12px_#ffffff] active:text-gray-500 active:shadow-[inset_4px_4px_12px_#c5c5c5,inset_-4px_-4px_12px_#ffffff]">
						Xem thông tin dịch vụ
					</button>
				</Link>
			</div>
		</>
	);
};

export default PaymentCancel;
