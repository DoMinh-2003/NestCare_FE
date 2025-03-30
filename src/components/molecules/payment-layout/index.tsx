
import { Image, Spin } from 'antd';
import { Calendar, Heart, Home } from "lucide-react";
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import paymentSuccessImg from '../../../../public/images/paySuccess.png'
import paymentCancelImg from '../../../../public/images/cancel.png'
import paymentFailureImg from '../../../../public/images/failure.png'
import axios from 'axios';
import api from '../../../config/api';
import { toast } from 'react-toastify';

interface PaymentBookingProps {
	bookingId: string;
	status: string;
}


const PaymentBooking = () => {

	const { bookingId } = useParams();
	const [appoimentUpate, setAppoimentUpdate] = useState(false);

	const updateStatus = async (bookingId: string, status: string) => {
		try {
			const response = await api.put('/appoitments/' + bookingId + '/' + status);
			console.log(response);
			if (response) {
				setAppoimentUpdate(true)
			}
		} catch (err) {
			console.error('Error updating order status:', err);
		}
	}

	useEffect(() => {
		if (bookingId) {
			updateStatus(bookingId, 'PENDING');
		}
	}, [bookingId])

	if (!appoimentUpate) {
		<Spin />
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-pink-50 p-4">
			<div className="mx-auto max-w-[600px] flex flex-col items-center justify-center gap-6 rounded-2xl border border-pink-100 bg-white p-8 shadow-lg">
				<div className="relative h-40 w-40 md:h-56 md:w-56">
					<div className="absolute -top-6 -right-6 z-10 rounded-full bg-pink-100 p-3">
						<Heart className="h-8 w-8 text-pink-500" fill="#ec4899" strokeWidth={1} />
					</div>
					<Image preview={false} src={paymentSuccessImg} alt="mother-baby-care" className="object-contain" />
				</div>

				<div className="mt-2 text-center">
					<h1 className="text-2xl font-bold text-teal-600 md:text-3xl">Đăng Ký Thành Công!</h1>
					<p className="mt-2 text-center text-lg font-medium text-gray-700">
						Chúc mừng bạn đã đăng ký dịch vụ của hệ thống
					</p>
				</div>

				<div className="mt-2 w-full max-w-md rounded-xl bg-blue-50 p-4">
					<div className="flex items-center gap-3 text-blue-700">
						<Calendar className="h-5 w-5" />
						<span className="font-medium">Thông tin quan trọng:</span>
					</div>
					<ul className="mt-2 ml-8 list-disc text-gray-700">
						<li>Vui lòng đến trước giờ hẹn 30 phút</li>
						<li>Mang theo giấy tờ tùy thân và thẻ bảo hiểm</li>
						<li>Mang theo sổ khám thai nếu có</li>
					</ul>
				</div>

				<div className="mt-4 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
					<Link to="/appointment-history" className="w-full sm:w-auto">
						<button className="w-full rounded-full bg-teal-500 px-8 py-3 text-base font-medium text-white shadow-md transition duration-300 hover:bg-teal-600 active:bg-teal-700 sm:w-auto">
							<div className="flex items-center justify-center gap-2">
								<Home className="h-4 w-4" />
								<span>Xem lịch khám</span>
							</div>
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PaymentBooking;
