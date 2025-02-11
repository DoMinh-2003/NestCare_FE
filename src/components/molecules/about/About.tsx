import React from 'react'
import { Card } from 'antd';
import Title from '../../atoms/text/Title';

const { Meta } = Card;
const About = () => {
    return (
        <div className='w-full'>
            <div className='mt-10'>
                <Title text='Giới thiệu' />
                <div className='grid 2xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-5 mt-10 justify-items-center'>
                    <Card
                        hoverable
                        style={{ width: 490 }}
                        cover={<img alt="example" src="https://sihospital.com.vn/images/vesih.jpg" />}
                    >
                        <Meta title={<div className='text-xl hover:text-pink-700'>Về NestCare</div>} />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 490 }}
                        cover={<img alt="example" src="https://sihospital.com.vn/images/Q&A.jpg" />}
                    >
                        <Meta title={<div className='text-xl hover:text-pink-700'>Các câu hỏi thường gặp</div>} />
                    </Card>
                    <Card
                        hoverable
                        style={{ width: 490 }}
                        cover={<img alt="example" src="https://sihospital.com.vn/images/chuyenkhoa.jpg" />}
                    >
                        <Meta title={<div className='text-xl hover:text-pink-700'>Các chuyên khoa</div>} />
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default About
