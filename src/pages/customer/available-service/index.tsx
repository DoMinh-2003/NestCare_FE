
import { useState, useEffect } from "react"
import {
	Card,
	Typography,
	Row,
	Col,
	Badge,
	Tag,
	Button,
	Empty,
	Input,
	Select,
	Tooltip,
	Skeleton,
	Modal,
	Divider,
	Progress,
	message,
	Avatar,
} from "antd"
import {
	CalendarOutlined,
	SearchOutlined,
	InfoCircleOutlined,
	SortAscendingOutlined,
	RightOutlined,
	HeartOutlined,
	MedicineBoxOutlined,
	StarOutlined,
} from "@ant-design/icons"
import { motion } from "framer-motion"
import { getUserDataFromLocalStorage } from "../../../constants/function"
import { formatMoney } from "../../../utils/formatMoney"
import api from "../../../config/api"
import { useNavigate } from "react-router-dom"

const { Title, Text, Paragraph } = Typography
const { Option } = Select

interface Service {
	id: string
	name: string
	price: string
	description: string
	isDeleted: boolean
	createdAt: string
	updatedAt: string
}

interface PackageService {
	id: string
	slot: number
	service: Service
}

function AvailableService() {
	const [services, setServices] = useState<PackageService[]>([])
	const [filteredServices, setFilteredServices] = useState<PackageService[]>([])
	const [loading, setLoading] = useState(true)
	const [searchText, setSearchText] = useState("")
	const [sortBy, setSortBy] = useState<"name" | "price" | "slots">("name")
	const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
	const [filterBySlots, setFilterBySlots] = useState<"all" | "available" | "unavailable">("all")
	const [selectedService, setSelectedService] = useState<PackageService | null>(null)
	const [detailModalVisible, setDetailModalVisible] = useState(false)
	const [bookingModalVisible, setBookingModalVisible] = useState(false)
	const [hoveredCard, setHoveredCard] = useState<string | null>(null)
	const user = getUserDataFromLocalStorage()
	const navigate = useNavigate();

	useEffect(() => {
		fetchServices()
	}, [])

	useEffect(() => {
		applyFiltersAndSort()
	}, [services, searchText, sortBy, sortOrder, filterBySlots])

	const fetchServices = async () => {
		try {
			setLoading(true)
			const userId = user?.id
			if (!userId) {
				message.error("Không tìm thấy thông tin người dùng")
				setLoading(false)
				return
			}

			const response = await api.get(`/users/available-services/${userId}`)
			setServices(response.data)
			setFilteredServices(response.data)
		} catch (error) {
			console.error("Error fetching services:", error)
			message.error("Không thể tải dữ liệu dịch vụ")
		} finally {
			setLoading(false)
		}
	}

	const applyFiltersAndSort = () => {
		let result = [...services]

		// Apply search filter
		if (searchText) {
			const lowerSearchText = searchText.toLowerCase()
			result = result.filter(
				(service) =>
					service.service.name.toLowerCase().includes(lowerSearchText) ||
					service.service.description.toLowerCase().includes(lowerSearchText),
			)
		}

		// Apply slots filter
		if (filterBySlots === "available") {
			result = result.filter((service) => service.slot > 0)
		} else if (filterBySlots === "unavailable") {
			result = result.filter((service) => service.slot === 0)
		}

		// Apply sorting
		result.sort((a, b) => {
			let comparison = 0
			if (sortBy === "name") {
				comparison = a.service.name.localeCompare(b.service.name)
			} else if (sortBy === "price") {
				comparison = Number.parseFloat(a.service.price) - Number.parseFloat(b.service.price)
			} else if (sortBy === "slots") {
				comparison = a.slot - b.slot
			}

			return sortOrder === "asc" ? comparison : -comparison
		})

		setFilteredServices(result)
	}

	const handleSearch = (value: string) => {
		setSearchText(value)
	}

	const toggleSort = (field: "name" | "price" | "slots") => {
		if (sortBy === field) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc")
		} else {
			setSortBy(field)
			setSortOrder("asc")
		}
	}

	const showServiceDetail = (service: PackageService) => {
		setSelectedService(service)
		setDetailModalVisible(true)
	}

	const showBookingModal = (service: PackageService) => {
		if (service.slot <= 0) {
			message.warning("Dịch vụ này đã hết lượt sử dụng")
			return
		}
		setSelectedService(service)
		setBookingModalVisible(true)
	}

	const handleBookService = () => {
		// In a real app, you would call your API to book the service
		message.success("Đã đến trang đặt lịch hẹn! Hãy đặt lịch hẹn của bạn!")
		setBookingModalVisible(false)
		// Redirect to booking page
		navigate("/booking-doctor")
	}

	const getServiceIcon = (serviceName: string) => {
		const name = serviceName.toLowerCase()
		if (name.includes("siêu âm")) return <HeartOutlined />
		if (name.includes("khám")) return <MedicineBoxOutlined />
		return <StarOutlined />
	}

	const getServiceColor = (serviceName: string) => {
		const name = serviceName.toLowerCase()
		if (name.includes("siêu âm")) return "#ff4d4f"
		if (name.includes("khám")) return "#1890ff"
		return "#722ed1"
	}

	const renderSkeletons = () => {
		return Array(4)
			.fill(null)
			.map((_, index) => (
				<Col xs={24} sm={12} md={8} lg={6} key={`skeleton-${index}`}>
					<Card className="service-card" style={{ height: "100%", borderRadius: "12px", overflow: "hidden" }}>
						<Skeleton.Avatar active size={64} shape="square" style={{ marginBottom: "16px" }} />
						<Skeleton active paragraph={{ rows: 3 }} />
						<div style={{ marginTop: "16px" }}>
							<Skeleton.Button active style={{ width: "100%" }} />
						</div>
					</Card>
				</Col>
			))
	}

	const renderEmptyState = () => (
		<Empty
			image={Empty.PRESENTED_IMAGE_DEFAULT}
			description={
				<span>
					Không tìm thấy dịch vụ nào
					{searchText && (
						<span>
							{" "}
							phù hợp với từ khóa "<strong>{searchText}</strong>"
						</span>
					)}
				</span>
			}
			style={{ margin: "40px 0" }}
		>
			<Button
				type="primary"
				onClick={() => {
					setSearchText("")
					setFilterBySlots("all")
					setSortBy("name")
					setSortOrder("asc")
				}}
			>
				Xóa bộ lọc
			</Button>
		</Empty>
	)

	const renderServiceCards = () => {
		if (filteredServices.length === 0) {
			return renderEmptyState()
		}

		return (
			<Row gutter={[16, 16]}>
				{filteredServices?.map((packageService) => (
					<Col xs={24} sm={12} md={8} lg={6} key={packageService.id}>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
							whileHover={{
								y: -5,
								boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
								transition: { duration: 0.2 },
								borderRadius: '20px'
							}}
							onHoverStart={() => setHoveredCard(packageService.id)}
							onHoverEnd={() => setHoveredCard(null)}
							className="rounded-[20px]"
						>
							<Card
								className="service-card"
								style={{
									height: "100%",
									borderRadius: "20px",
									overflow: "hidden",
									boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
									border:
										hoveredCard === packageService.id
											? `1px solid ${getServiceColor(packageService.service.name)}`
											: "1px solid #f0f0f0",
									transform: hoveredCard === packageService.id ? "scale(1.05)" : "scale(1)",
									transition: "all 0.3s ease",
								}}
								bodyStyle={{ padding: "16px" }}
								cover={
									<div
										style={{
											height: "120px",
											background: `linear-gradient(135deg, ${getServiceColor(packageService.service.name)} 0%, ${getServiceColor(packageService.service.name)}88 100%)`,
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											position: "relative",
											padding: "16px",
											borderRadius: "20px"
										}}
									>
										<div style={{ position: "absolute", top: "12px", right: "12px" }}>
											<Badge
												count={packageService.slot}
												overflowCount={99}
												style={{
													backgroundColor: packageService.slot > 0 ? "#52c41a" : "#f5222d",
												}}
											/>
										</div>
										<div style={{ textAlign: "center" }}>
											<Avatar
												icon={getServiceIcon(packageService.service.name)}
												size={48}
												style={{
													backgroundColor: "white",
													color: getServiceColor(packageService.service.name),
													marginBottom: "8px",
												}}
											/>
											<Title level={4} style={{ color: "white", margin: 0, textAlign: "center" }}>
												{packageService.service.name}
											</Title>
										</div>
									</div>
								}
							>
								<div style={{ height: "150px", display: "flex", flexDirection: "column" }}>
									<div style={{ marginBottom: "12px" }}>
										<Text type="secondary">Giá dịch vụ:</Text>
										<div>
											<Text strong style={{ fontSize: "16px", color: "#f5222d" }}>
												{formatMoney(Number(packageService.service.price))}
											</Text>
										</div>
									</div>

									<Paragraph ellipsis={{ rows: 2 }} style={{ flex: 1, marginBottom: "12px", color: "#595959" }}>
										{packageService.service.description || "Không có mô tả"}
									</Paragraph>

									<div>
										<Text type="secondary">Số lượt còn lại:</Text>
										<Progress
											percent={(packageService.slot / 5) * 100}
											format={() => `${packageService.slot}/5`}
											status={packageService.slot > 0 ? "active" : "exception"}
											size="small"
											strokeColor={{
												from: "#108ee9",
												to: "#87d068",
											}}
										/>
									</div>
								</div>

								<div className="flex justify-between mt-4">
									<Button
										type="default"
										icon={<InfoCircleOutlined />}
										onClick={() => showServiceDetail(packageService)}
									>
										Chi tiết
									</Button>
									<Button
										type="primary"
										icon={<CalendarOutlined />}
										disabled={packageService.slot <= 0}
										onClick={() => showBookingModal(packageService)}
										style={{
											backgroundColor:
												packageService.slot > 0 ? getServiceColor(packageService.service.name) : undefined,
											borderColor: packageService.slot > 0 ? getServiceColor(packageService.service.name) : undefined,
										}}
									>
										Đặt lịch
									</Button>
								</div>
							</Card>
						</motion.div>
					</Col>
				))}
			</Row>
		)
	}

	return (
		<div className="available-services-container" style={{ padding: "24px" }}>
			<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
				<div style={{ marginBottom: "24px" }}>
					<Title level={2} style={{ marginBottom: "8px" }}>
						Dịch vụ khả dụng của bạn
					</Title>
					<Text type="secondary">Quản lý và đặt lịch sử dụng các dịch vụ có sẵn trong gói thai sản của bạn</Text>
				</div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
			>
				<Card
					style={{
						marginBottom: "24px",
						borderRadius: "12px",
						boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
					}}
					bodyStyle={{ padding: "16px" }}
				>
					<Row gutter={[16, 16]} align="middle">
						<Col xs={24} md={8}>
							<Input
								placeholder="Tìm kiếm dịch vụ..."
								prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
								value={searchText}
								onChange={(e) => handleSearch(e.target.value)}
								style={{ borderRadius: "8px" }}
								allowClear
							/>
						</Col>
						<Col xs={24} md={8}>
							<Select
								style={{ width: "100%", borderRadius: "8px" }}
								placeholder="Lọc theo số lượt"
								value={filterBySlots}
								onChange={(value) => setFilterBySlots(value)}
							>
								<Option value="all">Tất cả dịch vụ</Option>
								<Option value="available">Còn lượt sử dụng</Option>
								<Option value="unavailable">Đã hết lượt</Option>
							</Select>
						</Col>
						<Col xs={24} md={8}>
							<div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", flexWrap: "wrap" }}>
								<Tooltip title="Sắp xếp theo tên">
									<Button
										icon={<SortAscendingOutlined />}
										onClick={() => toggleSort("name")}
										type={sortBy === "name" ? "primary" : "default"}
									>
										Tên {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
									</Button>
								</Tooltip>
								<Tooltip title="Sắp xếp theo giá">
									<Button
										icon={<SortAscendingOutlined />}
										onClick={() => toggleSort("price")}
										type={sortBy === "price" ? "primary" : "default"}
									>
										Giá {sortBy === "price" && (sortOrder === "asc" ? "↑" : "↓")}
									</Button>
								</Tooltip>
								<Tooltip title="Sắp xếp theo số lượt còn lại">
									<Button
										icon={<SortAscendingOutlined />}
										onClick={() => toggleSort("slots")}
										type={sortBy === "slots" ? "primary" : "default"}
									>
										Lượt {sortBy === "slots" && (sortOrder === "asc" ? "↑" : "↓")}
									</Button>
								</Tooltip>
							</div>
						</Col>
					</Row>
				</Card>
			</motion.div>

			<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
				{loading ? renderSkeletons() : renderServiceCards()}
			</motion.div>

			{/* Service Detail Modal */}
			<Modal
				title={
					<div style={{ display: "flex", alignItems: "center" }}>
						<InfoCircleOutlined
							style={{
								marginRight: "8px",
								color: selectedService ? getServiceColor(selectedService.service.name) : "#1890ff",
							}}
						/>
						<span>Chi tiết dịch vụ</span>
					</div>
				}
				open={detailModalVisible}
				onCancel={() => setDetailModalVisible(false)}
				footer={[
					<Button key="back" onClick={() => setDetailModalVisible(false)}>
						Đóng
					</Button>,
					<Button
						key="book"
						type="primary"
						icon={<CalendarOutlined />}
						disabled={selectedService?.slot <= 0}
						onClick={() => {
							setDetailModalVisible(false)
							if (selectedService) showBookingModal(selectedService)
						}}
						style={{
							backgroundColor:
								selectedService?.slot > 0 && selectedService
									? getServiceColor(selectedService.service.name)
									: undefined,
							borderColor:
								selectedService?.slot > 0 && selectedService
									? getServiceColor(selectedService.service.name)
									: undefined,
						}}
					>
						Đặt lịch sử dụng
					</Button>,
				]}
				width={600}
			>
				{selectedService && (
					<div>
						<div style={{ marginBottom: "16px", display: "flex", alignItems: "center", gap: "16px" }}>
							<Avatar
								icon={getServiceIcon(selectedService.service.name)}
								size={64}
								style={{
									backgroundColor: getServiceColor(selectedService.service.name),
									color: "white",
								}}
							/>
							<div>
								<Title level={3} style={{ marginBottom: "8px" }}>
									{selectedService.service.name}
								</Title>
								<Tag color={selectedService.slot > 0 ? "success" : "error"}>
									{selectedService.slot > 0 ? "Còn lượt sử dụng" : "Đã hết lượt"}
								</Tag>
							</div>
						</div>

						<Divider />

						<div style={{ marginBottom: "16px" }}>
							<Text strong>Mô tả dịch vụ:</Text>
							<Paragraph style={{ marginTop: "8px", fontSize: "15px" }}>
								{selectedService.service.description || "Không có mô tả chi tiết cho dịch vụ này."}
							</Paragraph>
						</div>

						<div style={{ marginBottom: "16px" }}>
							<Text strong>Giá dịch vụ:</Text>
							<Paragraph style={{ marginTop: "8px", color: "#f5222d", fontWeight: "bold", fontSize: "16px" }}>
								{formatMoney(selectedService.service.price)}
							</Paragraph>
						</div>

						<div style={{ marginBottom: "16px" }}>
							<Text strong>Số lượt còn lại:</Text>
							<div style={{ marginTop: "8px" }}>
								<Progress
									percent={(selectedService.slot / 5) * 100}
									format={() => `${selectedService.slot}/5`}
									status={selectedService.slot > 0 ? "active" : "exception"}
									strokeColor={{
										from: "#108ee9",
										to: "#87d068",
									}}
								/>
							</div>
						</div>

						<Card style={{ backgroundColor: "#f9f9f9", borderRadius: "8px" }}>
							<Text strong>Lưu ý:</Text>
							<ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
								<li>Vui lòng đặt lịch trước ít nhất 24 giờ để đảm bảo dịch vụ được chuẩn bị tốt nhất</li>
								<li>Bạn có thể hủy lịch trước 12 giờ mà không bị trừ lượt sử dụng</li>
								<li>Mỗi lần đặt lịch sẽ sử dụng 1 lượt dịch vụ</li>
							</ul>
						</Card>
					</div>
				)}
			</Modal>

			{/* Booking Modal */}
			<Modal
				title={
					<div style={{ display: "flex", alignItems: "center" }}>
						<CalendarOutlined
							style={{
								marginRight: "8px",
								color: selectedService ? getServiceColor(selectedService.service.name) : "#1890ff",
							}}
						/>
						<span>Đặt lịch sử dụng dịch vụ</span>
					</div>
				}
				open={bookingModalVisible}
				onCancel={() => setBookingModalVisible(false)}
				footer={[
					<Button key="back" onClick={() => setBookingModalVisible(false)}>
						Hủy
					</Button>,
				]}
				width={600}
			>
				{selectedService && (
					<div>
						<div style={{ marginBottom: "24px", textAlign: "center" }}>
							<Avatar
								icon={getServiceIcon(selectedService.service.name)}
								size={80}
								style={{
									backgroundColor: getServiceColor(selectedService.service.name),
									color: "white",
									marginBottom: "16px",
								}}
							/>
							<Title level={3} style={{ marginBottom: "8px" }}>
								{selectedService.service.name}
							</Title>
							<Tag color="blue" style={{ fontSize: "14px", padding: "4px 8px" }}>
								Còn {selectedService.slot} lượt sử dụng
							</Tag>
						</div>

						<Card style={{ marginBottom: "24px", borderRadius: "8px" }}>
							<Paragraph style={{ fontSize: "15px" }}>
								Bạn đang đặt lịch sử dụng dịch vụ <strong>{selectedService.service.name}</strong>. Sau khi xác nhận, bạn
								sẽ được chuyển đến trang đặt lịch để chọn thời gian phù hợp.
							</Paragraph>

							<div style={{ marginTop: "16px" }}>
								<Text strong>Lưu ý quan trọng:</Text>
								<ul style={{ marginTop: "8px", paddingLeft: "20px" }}>
									<li>Mỗi lần đặt lịch sẽ sử dụng 1 lượt dịch vụ</li>
									<li>Bạn có thể hủy lịch trước 12 giờ mà không bị trừ lượt</li>
									<li>Vui lòng đến đúng giờ để được phục vụ tốt nhất</li>
								</ul>
							</div>
						</Card>

						<div style={{ textAlign: "center" }}>
							<Button
								type="primary"
								size="large"
								icon={<RightOutlined />}
								onClick={handleBookService}
								style={{
									height: "48px",
									padding: "0 32px",
									fontSize: "16px",
									backgroundColor: getServiceColor(selectedService.service.name),
									borderColor: getServiceColor(selectedService.service.name),
								}}
							>
								Tiếp tục đặt lịch
							</Button>
						</div>
					</div>
				)}
			</Modal>
		</div>
	)
}

export default AvailableService
