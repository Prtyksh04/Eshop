import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../utils/axiosInstance';
import { useEffect } from 'react';


// fetch admin data from API
const fetchAdmin = async () => {
    const response = await axiosInstance.get('/api/logged-in-admin');
    return response.data.user;
}

const useAdmin = () => {
    const { data: admin, isLoading, isError, refetch } = useQuery({
        queryKey: ['admin'],
        queryFn: fetchAdmin,
        staleTime: 1000 * 60 * 5,
        retry: 1,
    });

    useEffect(() => {
        // if (!isLoading && !admin) {
        //     // redirect logic
        // }
    }, [admin, isLoading]);

    return { admin, isLoading, isError, refetch };
};

export default useAdmin;