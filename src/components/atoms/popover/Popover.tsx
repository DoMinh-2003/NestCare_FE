import { Popover } from 'antd';
import NavMenu from '../../molecules/nav-menu/NavMenu';

interface PopoverProps {
    content: string[];
    className?: string;
    title: string;
    link: string;
}

const PopoverNavbar = ({ content, className, title, link }: PopoverProps) => {
    const popContent =
        <div className='mb-3'>
            {
                content.map((item) => (
                    <div className=' font-semibold hover:text-pink-400 '>
                        <div>
                            <div className='hover:bg-purple-100 p-2 rounded-lg pl-5 cursor-pointer'>
                                {item}
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    return (
        <>
            <Popover className={className} content={popContent}>
                <div>
                    <NavMenu label={title} hasDropdown link={link}/>
                </div>
            </Popover>
        </>
    )
}
export default PopoverNavbar;