import React from 'react'
import { Card } from 'antd';

const { Meta } = Card;
const About = () => {
    return (
        <div className='mt-10'>
            <div className='text-pink-700 text-5xl font-bold py-10'>
                Giới thiệu
            </div>

            <div className='grid grid-cols-3 gap-5 mt-10'>
                <Card
                    hoverable
                    style={{ width: 400 }}
                    cover={<img alt="example" src="https://sihospital.com.vn/images/vesih.jpg" />}
                >
                    <Meta title={<div className='text-xl hover:text-pink-700'>Về NestCare</div>} />
                </Card>
                <Card
                    hoverable
                    style={{ width: 400 }}
                    cover={<img alt="example" src="https://sihospital.com.vn/images/Q&A.jpg" />}
                >
                    <Meta title={<div className='text-xl hover:text-pink-700'>Các câu hỏi thường gặp</div>} />
                </Card>
                <Card
                    hoverable
                    style={{ width: 400 }}
                    cover={<img alt="example" src="https://sihospital.com.vn/images/chuyenkhoa.jpg" />}
                >
                    <Meta title={<div className='text-xl hover:text-pink-700'>Các chuyên khoa</div>} />
                </Card>
            </div>
        </div>
    )
}

export default About
