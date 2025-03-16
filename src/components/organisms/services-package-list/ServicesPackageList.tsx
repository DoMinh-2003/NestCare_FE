
import { useEffect, useState } from 'react';
import usePackageService from '../../../services/usePackageService';
import ServicePackage from '../../molecules/service-package';
import { Package } from '../../../model/Pakage';

const ServicesPackageList = () => {

    const [servicePackages, setServicePackages] = useState([]);
    const { getPackages } = usePackageService();

    useEffect(() => {
        getPackages()
            .then((packages) => setServicePackages(packages));
        console.log("Gois service--------", servicePackages);
    }, []);


    return (
        <div className='grid md:grid-cols-3 md:gap-10 h-fit grid-cols-1 gap-3'>
            {servicePackages.map((item: Package) => (
                <div key={item.id}>
                    <ServicePackage
                        servicePackage={item}
                    />
                </div>
            ))}
        </div>
    )
}


export default ServicesPackageList