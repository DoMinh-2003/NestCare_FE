
import { useLocation, Link } from 'react-router-dom';

const PaymentSuccess = () => {
	const { state } = useLocation();
	const { orderId } = state || {};

	return (
		<div className="p-10 text-center">
			<h1 className="text-2xl font-bold text-green-600">Payment Successful!</h1>
			<p>Thank you for your purchase. Order ID: {orderId || 'N/A'}</p>
			<Link to="/services">
				<button className="mt-5 bg-blue-500 text-white px-5 py-2 rounded-lg">
					Back to Services
				</button>
			</Link>
		</div>
	);
};

export default PaymentSuccess;
