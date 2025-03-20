import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	LineElement,
	PointElement,
	Title,
	Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { getUserDataFromLocalStorage } from "../../../constants/function";
import useFetalService from "../../../services/useFetalService";
import './styles.css'

// Register required Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


function FetalHeightChart({ fetalRecords }) {
	const [chartData, setChartData] = useState({});

	const standardLengths = [
		1.6, 2.3, 3.1, 4.1, 5.4, 7.4, 8.7, 10.1, 11.6, 13.0, 14.2, 15.3, 25.6, 26.7,
		27.8, 28.9, 30.0, 34.6, 35.6, 36.6, 37.6, 38.6, 39.9, 41.1, 42.4, 43.7, 45.0,
		46.2, 47.4, 48.6, 49.8, 50.7, 51.2,
	];

	useEffect(() => {
		if (fetalRecords.length > 0) {
			const checkupRecords = fetalRecords[0]?.checkupRecords || [];
			// Tính số tuần dựa trên dữ liệu (giả sử có trường tuần thai trong checkupRecords)
			const labels = checkupRecords.map((record) => `Tuần ${record.week || "1"}`);
			const dataPoints = checkupRecords.map((record) => parseFloat(record.fetalHeight));

			setChartData({
				labels: labels,
				datasets: [
					{
						label: "Chiều dài thai (cm)",
						data: dataPoints,
						borderColor: "#42a5f5",
						backgroundColor: "rgba(66, 165, 245, 0.5)",
						fill: true,
						pointBorderColor: "#1976d2",
						pointBackgroundColor: "#42a5f5",
						pointHoverBackgroundColor: "#fff",
						pointHoverBorderColor: "#1976d2",
						tension: 0.4,
					},
					{
						label: "Chiều dài chuẩn theo tuần (cm)",
						data: standardLengths.slice(0, labels.length), // Cắt chuẩn theo số tuần thực tế
						borderColor: "#ff7043",
						backgroundColor: "rgba(255, 112, 67, 0.5)",
						fill: false,
						pointBorderColor: "#e64a19",
						pointBackgroundColor: "#ff7043",
						pointHoverBackgroundColor: "#fff",
						pointHoverBorderColor: "#e64a19",
						tension: 0.4,
					},
				],
			});
		}
	}, [fetalRecords]);

	return (
		<div className="fetal-chart-container">
			<h2 className="text-2xl font-bold mb-5">Biểu đồ phát triển chiều dài thai</h2>
			{chartData?.datasets?.length > 0 ? (
				<div className="chart-wrapper">
					<Line
						data={chartData}
						options={{
							responsive: true,
							plugins: {
								legend: { position: "top" },
								title: { display: true, text: "Chiều dài thai theo tuần" },
							},
							scales: {
								x: { title: { display: true, text: "Tuần thai kỳ" } },
								y: { title: { display: true, text: "Chiều dài (cm)" }, beginAtZero: true },
							},
						}}
					/>
				</div>
			) : (
				<p>Không có dữ liệu</p>
			)}
		</div>
	);
}

function FetalWeightChart({ fetalRecords }) {
	const [chartData, setChartData] = useState({});

	const standardWeights = Array.from({ length: 33 }, (_, i) => 0.1 * (i + 1)); // 0.1 to 3.3 kg

	useEffect(() => {
		if (fetalRecords.length > 0) {
			const checkupRecords = fetalRecords[0]?.checkupRecords || [];
			const labels = checkupRecords.map((record) => `Tuần ${record.week || "1"}`);
			const dataPoints = checkupRecords.map((record) => parseFloat(record.fetalWeight));

			setChartData({
				labels: labels,
				datasets: [
					{
						label: "Cân nặng thai (kg)",
						data: dataPoints,
						borderColor: "#66bb6a",
						backgroundColor: "rgba(102, 187, 106, 0.5)",
						fill: true,
						pointBorderColor: "#388e3c",
						pointBackgroundColor: "#66bb6a",
						pointHoverBackgroundColor: "#fff",
						pointHoverBorderColor: "#388e3c",
						tension: 0.4,
					},
					{
						label: "Cân nặng chuẩn theo tuần (kg)",
						data: standardWeights.slice(0, labels.length), // Cắt chuẩn theo số tuần thực tế
						borderColor: "#ffa726",
						backgroundColor: "rgba(255, 167, 38, 0.5)",
						fill: false,
						pointBorderColor: "#f57c00",
						pointBackgroundColor: "#ffa726",
						pointHoverBackgroundColor: "#fff",
						pointHoverBorderColor: "#f57c00",
						tension: 0.4,
					},
				],
			});
		}
	}, [fetalRecords]);

	return (
		<div className="fetal-chart-container">
			<h2 className="text-2xl font-bold mb-5">Biểu đồ phát triển cân nặng thai</h2>
			{chartData?.datasets?.length > 0 ? (
				<div className="chart-wrapper">
					<Line
						data={chartData}
						options={{
							responsive: true,
							plugins: {
								legend: { position: "top" },
								title: { display: true, text: "Cân nặng thai theo tuần" },
							},
							scales: {
								x: { title: { display: true, text: "Tuần thai kỳ" } },
								y: { title: { display: true, text: "Cân nặng (kg)" }, beginAtZero: true },
							},
						}}
					/>
				</div>
			) : (
				<p>Không có dữ liệu</p>
			)}
		</div>
	);
}

function FetalChart() {
	const [fetalRecords, setFetalRecords] = useState([]);
	const { getFetalsByMotherId } = useFetalService();
	const userData = getUserDataFromLocalStorage();

	const fetchFetalRecords = async () => {
		try {
			const response = await getFetalsByMotherId(userData.id);
			setFetalRecords(response);
			console.log("Fetal records:", response);
		} catch (error) {
			console.error("Error fetching fetal records:", error);
		}
	};

	useEffect(() => {
		fetchFetalRecords();
	}, []);

	return (
		<div className="flex justify-center gap-6">
			<FetalHeightChart fetalRecords={fetalRecords} />
			<FetalWeightChart fetalRecords={fetalRecords} />
		</div>
	);
}

export default FetalChart;