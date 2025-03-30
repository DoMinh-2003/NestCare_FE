import React from 'react'
import { Button, Checkbox, Col, Form, Input, Row, Typography } from 'antd'

function ForgotPassword() {
	return (
		<Row justify="center" xl={24} >
			<Col span={8}>
				<p className="text-2xl font-bold">Quên mật khẩu ?</p>
				<Form layout="vertical" onFinish={(values) => console.log(values)}>
					<Form.Item
						label="Email" name="email"
						rules={[
							{ required: true, message: 'Vui lòng nhập email' },
							{ type: 'email', message: 'Email không hợp lệ' },
						]}
					>
						<Input type="email" placeholder="Email" />
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit" block>
							Đăng nhập
						</Button>
					</Form.Item>
				</Form>
			</Col>
		</Row>
	)
}

export default ForgotPassword