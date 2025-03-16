import { useLocation, Link } from 'react-router-dom';

const PaymentCancel = () => {
	const { state } = useLocation();
	const { orderId, errorCode } = state || {};

	return (
		<div className="p-10 text-center">
			<h1 className="text-2xl font-bold text-yellow-600">Payment Canceled</h1>
			<p>You canceled your payment. Order ID: {orderId || 'N/A'}</p>
			{errorCode && <p>Error Code: {errorCode}</p>}
			<Link to="/services">
				<button className="mt-5 bg-blue-500 text-white px-5 py-2 rounded-lg">
					Back to Services
				</button>
			</Link>
		</div>
	);
};

export default PaymentCancel;
