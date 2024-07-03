import { useState, useEffect } from 'react';
import axios from '@/lib/axios';

const useConfiguracion = () => {
    const [configuracion, setConfiguracion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchConfiguracion = async () => {
            try {
                const response = await axios.get('/api/configuracion');
                setConfiguracion(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchConfiguracion();
    }, []);

    const createConfiguracion = async (data) => {
        try {
            const response = await axios.post('/api/configuracion', data);
            setConfiguracion(response.data);
            return response;
        } catch (err) {
            setError(err);
        }
    };

    const updateConfiguracion = async (id, data) => {
        try {
            const response = await axios.put(`/api/configuracion/${id}`, data);
            setConfiguracion(response.data);
        } catch (err) {
            setError(err);
        }
    };

    const deleteConfiguracion = async (id) => {
        try {
            await axios.delete(`/api/configuracion/${id}`);
            setConfiguracion(null);
        } catch (err) {
            setError(err);
        }
    };

    return {
        configuracion,
        loading,
        error,
        createConfiguracion,
        updateConfiguracion,
        deleteConfiguracion,
    };
};

export default useConfiguracion;
