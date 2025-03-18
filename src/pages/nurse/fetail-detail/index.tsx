
import { useParams } from 'react-router-dom'
import useFetalService from '../../../services/useFetalService'
import { useEffect, useState } from 'react';
export interface FetalRecord {
    id: string;
    name: string;
    note: string;
    dateOfPregnancyStart: string;
    expectedDeliveryDate: string;
    actualDeliveryDate: string | null;
    healthStatus: string;
    status: "PREGNANT" | "DELIVERED"; // You can add more possible statuses if needed
    isDeleted: number;
    createdAt: string;
    updatedAt: string;
    checkupRecords: any[]; // You can replace `any` with a specific type if available
    appointments: any[]; // You can replace `any` with a specific type if available
  }
  
const FetalDetail = () => {
    const { id } = useParams();
    const { getFetalsByMotherId } = useFetalService();
    const [fetals, setFetals] = useState<FetalRecord[]>([])
    
    useEffect(() => {
        if (id) {
            getFetalsByMotherIdFromNurse()
        }
    }, [id])

    const getFetalsByMotherIdFromNurse = async () => {
        const response = await getFetalsByMotherId(id)
        setFetals(response)
    }
    return (
        <div>

        </div>
    )
}

export default FetalDetail
