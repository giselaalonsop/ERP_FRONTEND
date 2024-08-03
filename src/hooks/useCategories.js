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
  const updateCategoria = async (id, categoryData) => {
    await csrf();
    try {
      const response = await axios.put(`/api/categorias/${id}`, categoryData);
      if (response.status === 200) {
        Swal.fire('Categoría actualizada', '', 'success');
        mutateCategories(); // Refrescar los datos
      }
    } catch (error) {
      console.error('Error al actualizar la categoría', error);
      Swal.fire('Error al actualizar la categoría', '', 'error');
      throw error;
    }
  }
  const deleteCategoria = async (id) => {
    await csrf();
    try {
      const response = await axios.delete(`/api/categorias/${id}`);
      if (response.status === 200) {
       
        mutateCategories(); 
        return true;
      }else{
        return false;
      }
    } catch (error) {
      console.error('Error al eliminar la categoría', error);
     return false;
     
    }
  }
  
  const {data: categoriasInhabilitada, error: categoriasInhabilitadaError} = useSWR('/api/categorias/inhabilitadas', fetcher)
  const habilitarCategoria = async (id) => {
    await csrf();
    try {
      const response = await axios.put(`/api/categorias/habilitar/${id}`);
      if (response.status === 200 || response.status === 201) {
        mutateCategories(); 
        return true;
      }else{
          return false;
      }
    } catch (error) {
      console.error('Error al habilitar la categoría', error);
      return false;
      
    }
  }

  return {
    categories,
    categoriesError,
    addCategoria,
    mutateCategories,
    isLoading: !categoriesError && !categories,
    isError: categoriesError,
    updateCategoria,
    deleteCategoria,
    categoriasInhabilitada,
    categoriasInhabilitadaError,
    habilitarCategoria

  };
};
