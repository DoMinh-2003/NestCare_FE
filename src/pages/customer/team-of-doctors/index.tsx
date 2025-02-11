import Title from "../../../components/atoms/text/Title"
import Deans from "../../../components/organisms/deans/Deans"
import Directors from "../../../components/organisms/directors/Directors"

const TeamOfDoctor = () => {
  return (
    <div className="mx-5">
      <div className="container mx-auto">
        <Title className="my-20" text="Đội ngũ bác sĩ" />
        <Directors/>
        <Deans/>
      </div>
     
    </div>
  )
}

export default TeamOfDoctor
