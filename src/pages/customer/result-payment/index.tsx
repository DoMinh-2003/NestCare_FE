// PaymentResult.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '../../../constants/routes';

const PaymentResult = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	useEffect(() => {
		const responseCode = searchParams.get('vnp_ResponseCode');
		const orderId = searchParams.get('orderId');
		const transactionStatus = searchParams.get('vnp_TransactionStatus');

		// Handle VNPAY response codes
		switch (responseCode) {
			case '00': // Payment successful
				navigate(USER_ROUTES.PAYMENT_SUCCESS, { state: { orderId } });
				break;
			case '24': // Customer canceled
				navigate(USER_ROUTES.PAYMENT_CANCEL, { state: { orderId, errorCode: responseCode } });
				break;
			case '01': // Incomplete
			case '02': // Failed
				navigate(USER_ROUTES.PAYMENT_FAILURE, { state: { orderId, errorCode: responseCode } });
				break;
			case '07': // Suspected fraud
			case '09': // Card not registered
			case '10': // Authentication failed
			case '11': // Timeout
			default:
				navigate('/payment/failure', { state: { orderId, errorCode: responseCode } });
				break;
		}
	}, [searchParams, navigate]);

	return (
		<div className="p-10 text-center">
			<h1 className="text-2xl font-bold">Processing Payment...</h1>
			<p>Please wait while we verify your transaction.</p>
		</div>
	);
};

export default PaymentResult;

