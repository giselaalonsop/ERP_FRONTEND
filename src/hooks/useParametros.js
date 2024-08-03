import useSWR from 'swr';
import axios from '@/lib/axios';
import Swal from 'sweetalert2';

const fetcher = url => axios.get(url).then(res => res.data);

export const useParametros = () => {
  // Hook para unidades de medida
  const {
    data: unidadesMedida,
    error: unidadesMedidaError,
    mutate: mutateUnidadesMedida,
  } = useSWR('/api/unidadMedida', fetcher);

  // Hook para formas de venta
  const {
    data: formasVenta,
    error: formasVentaError,
    mutate: mutateFormasVenta,
  } = useSWR('/api/formasVenta', fetcher);

  const csrf = () => axios.get('/sanctum/csrf-cookie');

  // Método para agregar una unidad de medida
  const addUnidadMedida = async (unidadData) => {
    await csrf();
    try {
      const response = await axios.post('/api/unidadMedida', unidadData);
      if (response.status === 201) {
        Swal.fire('Unidad de medida creada', '', 'success');
        mutateUnidadesMedida(); // Refrescar los datos de unidades de medida
      }
    } catch (error) {
      console.error('Error al crear la unidad de medida', error);
      Swal.fire('Error al crear la unidad de medida', '', 'error');
      throw error;
    }
  };
  const deleteUnidadMedida = async (id) => {
    await csrf();
    try {
      const response = await axios.delete(`/api/unidadMedida/${id}`);
      if (response.status === 204) {
        Swal.fire('Unidad de medida eliminada', '', 'success');
        mutateUnidadesMedida();
      }
    } catch (error) {
      Swal.fire('Error al eliminar la unidad de medida', '', 'error');
      throw error;
    }
  };

  // Método para actualizar una unidad de medida
  const updateUnidadMedida = async (id, unidadData) => {
    await csrf();
  
    try {
        const response = await axios.put(`/api/unidadMedida/${id}`, unidadData);
        if (response.status === 200) {
            Swal.fire('Unidad de medida actualizada', '', 'success');
            mutateUnidadesMedida(); // Refrescar los datos de unidades de medida
        }
    } catch (error) {
        console.error('Error al actualizar la unidad de medida', error);
        Swal.fire('Error al actualizar la unidad de medida', '', 'error');
        throw error;
    }
};


  // Método para agregar una forma de venta
  const addFormaVenta = async (formaData) => {
    await csrf();
    try {
      const response = await axios.post('/api/formasVenta', formaData);
      if (response.status === 201) {
        Swal.fire('Forma de venta creada', '', 'success');
        mutateFormasVenta(); // Refrescar los datos de formas de venta
      }
    } catch (error) {
      console.error('Error al crear la forma de venta', error);
      Swal.fire('Error al crear la forma de venta', '', 'error');
      throw error;
    }
  };
  const deleteFormaVenta = async (id) => {
    await csrf();
    try {
      const response = await axios.delete(`/api/formasVenta/${id}`);
      if (response.status === 204) {
        Swal.fire('Forma de venta eliminada', '', 'success');
        mutateFormasVenta();
      }
    } catch (error) {
      Swal.fire('Error al eliminar la forma de venta', '', 'error');
      throw error;
    }
  };

  // Método para actualizar una forma de venta
  const updateFormaVenta = async (id, formaData) => {
    await csrf();
    try {
      const response = await axios.put(`/api/formasVenta/${id}`, formaData);
      if (response.status === 200) {
        Swal.fire('Forma de venta actualizada', '', 'success');
        mutateFormasVenta(); // Refrescar los datos de formas de venta
      }
    } catch (error) {
      console.error('Error al actualizar la forma de venta', error);
      Swal.fire('Error al actualizar la forma de venta', '', 'error');
      throw error;
    }
  };

  return {
    unidadesMedida,
    unidadesMedidaError,
    formasVenta,
    formasVentaError,
    mutateUnidadesMedida,
    mutateFormasVenta,
    addUnidadMedida,
    updateUnidadMedida,
    addFormaVenta,
    updateFormaVenta,
    deleteUnidadMedida,
    deleteFormaVenta,
  };
};
