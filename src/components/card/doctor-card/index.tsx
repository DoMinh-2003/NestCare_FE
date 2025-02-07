import React from 'react'

const DoctorCard = ({name, background_color, professional_qualifications, specialty, image}: iDoctorCard) => {
  return (
    <div style={{width: "350px"}} className={`border border-solid p-5 ${background_color === "pink" ? "bg-pink-100" : "bg-blue-100"}  text-lg rounded-lg`}>
      <p className='font-bold'>{professional_qualifications} {name}</p>
      <p>{specialty}</p>
      <img src={image} alt={name} />
    </div>
  )
}

export default DoctorCard
