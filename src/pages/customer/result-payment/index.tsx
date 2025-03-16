// PaymentResult.tsx
import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { USER_ROUTES } from '../../../constants/routes';
import style from './style.module.scss';

const PaymentResult = () => {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	useEffect(() => {
		const responseCode = searchParams.get('vnp_ResponseCode');
		const orderId = searchParams.get('orderId');
		const transactionStatus = searchParams.get('vnp_TransactionStatus');

		console.log('Search Params:', Object.fromEntries(searchParams));
		console.log('Response Code:', responseCode);
		console.log('Order ID:', orderId);

		// Set a 3-second delay before processing the redirect
		const timer = setTimeout(() => {
			if (!responseCode) {
				console.log('No responseCode, redirecting to PAYMENT_FAILURE');
				navigate(USER_ROUTES.PAYMENT_FAILURE, { state: { orderId, errorCode: 'N/A' }, replace: true });
				return;
			}

			// Handle VNPAY response codes
			switch (responseCode) {
				case '00': // Payment successful
					console.log('Navigating to PAYMENT_SUCCESS');
					navigate(USER_ROUTES.PAYMENT_SUCCESS, { state: { orderId }, replace: true });
					break;

				case '24': // Customer canceled
					console.log('Navigating to PAYMENT_CANCEL');
					navigate(USER_ROUTES.PAYMENT_CANCEL, { state: { orderId, errorCode: responseCode }, replace: true });
					break;

				// Failure cases
				case '07': // Suspected fraud
				case '09': // Card not registered for Internet Banking
				case '10': // Authentication failed (too many attempts)
				case '11': // Payment timeout
				case '12': // Card/Account locked
				case '13': // Wrong OTP
				case '51': // Insufficient balance
				case '65': // Exceeded daily limit
				case '75': // Bank under maintenance
				case '79': // Too many wrong password attempts
				case '99': // Other unspecified errors
					console.log(`Navigating to PAYMENT_FAILURE with code ${responseCode}`);
					navigate(USER_ROUTES.PAYMENT_FAILURE, { state: { orderId, errorCode: responseCode }, replace: true });
					break;

				default: // Any unhandled codes
					console.log('Navigating to PAYMENT_FAILURE (default)');
					navigate(USER_ROUTES.PAYMENT_FAILURE, { state: { orderId, errorCode: responseCode || 'Unknown' }, replace: true });
					break;
			}
		}, 22000);

		// Cleanup the timer if the component unmounts before the delay completes
		return () => clearTimeout(timer);
	}, [searchParams, navigate]);

	return (
		<div className='flex flex-col items-center justify-center my-auto'>
			<div className={`${style.loadingText}`}>
				Đang xử lý<span className={style.dot}>.</span><span className={style.dot}>.</span><span className={style.dot}>.</span>
			</div>
			<div className={style.spinner}>
				<div className='spinner'>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
					<span></span>
				</div>
			</div>
		</div>
	);
};

export default PaymentResult;