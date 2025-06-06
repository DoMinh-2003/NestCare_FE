import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../../molecules/common/ChartTab";
import { Order } from "../../../pages/admin/manage-overview";

interface StatisticsChartProps {
  orders: Order[];
}

const formatMoney = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const StatisticsChart = ({ orders }: StatisticsChartProps) => {
  const totalPrice =
    orders?.reduce((accumulator: number, currentOrder: Order) => {
      return accumulator + parseInt(currentOrder.package.price);
    }, 0) || 0;

  console.log(orders);

  const salesData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  const revenueData = [0, 0, totalPrice, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  const maxValue = Math.ceil(Math.max(...salesData, ...revenueData) / 1000000) * 1000000;

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: { show: false },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: {
        lines: { show: true },
        min: 0,
        max: maxValue,
        tickAmount: 5,
        title: { text: undefined },
      },
    },
    dataLabels: { enabled: false },
    tooltip: {
      enabled: true,
      x: { format: "dd MMM yyyy" },
      y: {
        formatter: (value) => formatMoney(value),
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "12px", colors: ["#6B7280"] },
        formatter: (value) => formatMoney(value),
      },
      title: { text: "", style: { fontSize: "0px" } },
    },
  };

  const series = [
    { name: "Số đơn hàng", data: salesData },
    { name: "Doanh thu", data: revenueData },
  ];

  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Thống kê</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Mục tiêu doanh thu theo từng tháng
          </p>
        </div>
        <div className="relative flex items-start w-full gap-3 sm:justify-end">
          <button className="p-2 border rounded"></button>
          <ChartTab />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </div>
  );
};

export default StatisticsChart;
