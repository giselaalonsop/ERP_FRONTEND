import axios from '@/lib/axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

export const useCategories = () => {
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState([]);

    // Método para obtener todas las categorías
    const getCategoria = async () => {
        try {
            const response = await axios.get('/api/categorias');
            setCategories(response.data);
        } catch (error) {
            console.error('Error al obtener las categorías', error);
            setErrors(error.response.data.errors || []);
        }
    };

    // Método para agregar una nueva categoría
    const addCategoria = async (categoryData) => {
        try {
            const response = await axios.post('/api/categorias', categoryData);
            if (response.status === 201) {
                Swal.fire('Categoría creada', '', 'success');
                getCategoria(); // Actualiza la lista de categorías
            }
        } catch (error) {
            console.error('Error al crear la categoría', error);
            setErrors(error.response.data.errors || []);
            Swal.fire('Error al crear la categoría', '', 'error');
        }
    };

    useEffect(() => {
        getCategoria(); // Obtener las categorías al cargar el hook
    }, []);

    return {
        categories,
        getCategoria,
        addCategoria,
        errors,
    };
};
