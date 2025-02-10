import { FacebookOutlined, TikTokOutlined, YoutubeOutlined } from '@ant-design/icons';

const FooterInfo = () => {
    return (
        <div className='text-white'>
            <div className='mt-5'>
                Hotline:
            </div>
            <div className='mt-5'>
                089 830 0028
            </div>
            <div className='mt-5'>
                Hỗ trợ: info@sihospital.com.vn
            </div>
            <div className='mt-5 flex gap-3'>
                <FacebookOutlined />
                <TikTokOutlined />
                <YoutubeOutlined />
            </div>
        </div>
    )
}

export default FooterInfo