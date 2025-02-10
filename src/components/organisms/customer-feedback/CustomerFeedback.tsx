import React from 'react'
import Title from '../../atoms/text/Title'

const CustomerFeedback = () => {
    return (
        <div>
            <Title text='Cảm nghĩ khách hàng' className='my-20'/>
            <div className="grid grid-cols-3 gap-10">
                <iframe width={"100%"} className="h-56" src="https://www.youtube.com/embed/nNl_g6DLYJ0?si=jwc17zfbOD-ZqCxA"></iframe>
                <iframe width={"100%"} className="h-56" src="https://www.youtube.com/embed/nNl_g6DLYJ0?si=jwc17zfbOD-ZqCxA"></iframe>
                <iframe width={"100%"} className="h-56" src="https://www.youtube.com/embed/nNl_g6DLYJ0?si=jwc17zfbOD-ZqCxA"></iframe>
            </div>
        </div>
    )
}

export default CustomerFeedback