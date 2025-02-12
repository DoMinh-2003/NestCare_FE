
import Title from '../../../components/atoms/text/Title'
import SpecialtiesList from '../../../components/organisms/specialties-list/SecialtyList'

const Specialty = () => {
    return (
        <div className='mx-5'>
            <div className='mt-20 container mx-auto'>
                <Title text='Các chuyên khoa' />
                <div className='mt-20'>
                <SpecialtiesList/>
                </div>
            </div>
        </div>
    )
}

export default Specialty
