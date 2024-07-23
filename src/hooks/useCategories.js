import useSWR from 'swr';
import axios from '@/lib/axios';
import Swal from 'sweetalert2';

const fetcher = url => axios.get(url).then(res => res.data);

export const useCategories = () => {
  const {
    data: categories,
    error: categoriesError,
    mutate: mutateCategories,
  } = useSWR('/api/categorias', fetcher);

  const csrf = () => axios.get('/sanctum/csrf-cookie');

  const addCategoria = async (categoryData) => {
    await csrf();
    try {
      const response = await axios.post('/api/categorias', categoryData);
      if (response.status === 201) {
        Swal.fire('Categoría creada', '', 'success');
        mutateCategories(); // Refrescar los datos
      }
    } catch (error) {
      console.error('Error al crear la categoría', error);
      Swal.fire('Error al crear la categoría', '', 'error');
      throw error;
    }
  };

  return {
    categories,
    categoriesError,
    addCategoria,
    mutateCategories,
    isLoading: !categoriesError && !categories,
    isError: categoriesError,
  };
};
