
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
    }, []);

    return (
        <div className='flex flex-col gap-3 justify-center'>
            <div className='w-full rounded-e-md rounded-s-lg bg-[#cdbbfd] bg-gradient-to-r from-[#eaafc8] to-[#654ea3]'>
                <p className='text-4xl font-bold font-sans py-10 text-center text-slate-100'>Các gói dịch vụ</p>
            </div>
            <div className=''>
                {servicePackages.map((item: Package) => (
                    <div key={item.id}>
                        <ServicePackage
                            servicePackage={item}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}


export default ServicesPackageList