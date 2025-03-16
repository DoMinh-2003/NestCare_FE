
import { useEffect, useState } from 'react';
import usePackageService from '../../../services/usePackageService';
import ServicePackage from '../../molecules/service-package';

interface Package {
    id: string;
    name: string;
    price: string;
    description: string;
    packageServices: [];
    image: string;
    isDeleted: number;
    createdAt: string;
    updatedAt: string;
}

const ServicesPackageList = () => {

    const [servicePackages, setServicePackages] = useState([]);
    const { getPackages } = usePackageService();

    useEffect(() => {
        getPackages()
            .then((packages) => setServicePackages(packages));
        console.log(servicePackages);
    }, []);


    return (
        <div className='grid xl:grid-cols-2 lg:grid-cols-1 gap-10'>
            {
                servicePackages.map((item: Package) => (
                    <div className=''>
                        <ServicePackage
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            services={item?.packageServices}
                            image={item.image}
                            price={item.price}
                        />
                    </div>
                ))
            }
        </div>
    )
}


export default ServicesPackageList