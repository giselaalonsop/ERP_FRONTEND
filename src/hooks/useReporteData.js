import useSWR from 'swr';
import axios from '@/lib/axios';

const fetcher = url => axios.get(url).then(res => res.data);

export const useReportData = (startDate, endDate, location) => {
    const { data, error, mutate } = useSWR(
        `/api/analisis?start_date=${startDate}&end_date=${endDate}&location=${location}`,
        fetcher
    );

    return {
        reportData: data,
        loading: !error && !data,
        error,
        mutate,
    };
};

export default useReportData;
