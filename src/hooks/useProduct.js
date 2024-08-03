import axios from '@/lib/axios';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { set } from 'date-fns';

export const useProduct = () => {
    const [errors, setErrors] = useState([]);
    const { data: products, error, mutate } = useSWR('/api/productos', () =>
        axios
            .get('/api/productos')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status === 401) {
                    router.push('/login')
                }
                throw error
            }),
    );
    const {data: productsInhabilitados, error: errorInhabilitado, mutate: mutateInhabilitado} = useSWR('/api/productos/inhabilitados', () =>
        axios
            .get('/api/productos/inhabilitados')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status === 401) {
                    router.push('/login')
                }
                throw error
            }),
    );

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const addProduct = async (data) => {
        setErrors([]);

        await csrf();

        try {
            const response = await axios.post('/api/productos', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200 || response.status === 201) {
                Swal.fire("Producto agregado", "", "success");
                mutate();
                return response;
            } else {
                Swal.fire("Error al agregar el producto", "", "error");
            }
        } catch (err) {
            setErrors(err.response.data.errors);
            if (err.response.status === 422) {
                Swal.fire("Error al agregar el producto", "Código de barras ya existe", "error");
            } else {
                Swal.fire("Error al agregar el producto", "", "error");
            }
        }
    };

    const updateProduct = async (id, dataToSend) => {
        await csrf();

        try {
            const response = await axios.post(`/api/productos/${id}`, dataToSend, {
                headers: {
                    'method': 'PUT',
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200 || response.status === 201) {
                Swal.fire("Producto actualizado", "", "success");
                mutate();
                return response;
            } else {
                Swal.fire("Error al actualizar los datos", "", "error");
            }
        } catch (error) {
            setErrors(error.response.data.errors);
            if (error.response.status === 422) {
                Swal.fire("Error al actualizar los datos", "Código de barras ya existe", "error");
            } else {
                Swal.fire("Error al actualizar los datos", "", "error");
            }
        }
    };

    const removeProduct = async (id) => {
        await csrf();

        try {
            const response = await axios.delete(`/api/productos/${id}`);
            if (response.status === 204) {
                Swal.fire("Producto eliminado", "", "success");
                mutate(); // Actualiza los productos después de eliminar uno
            } else {
                console.error("Error al eliminar el producto");
                Swal.fire("Error al eliminar el producto", "", "error");
            }
        } catch (error) {
            console.error("Error al eliminar el producto", error);
            Swal.fire("Error al eliminar el producto", "", "error");
        }
    };

    const cargarInventario = async (productoId, cantidad_a_cargar, ubicacion_destino) => {
        await csrf();

        const selectedProduct = products.find(product => product.id === productoId);

        try {
            const response = await axios.post(`/api/productos/${productoId}/cargar`, {
                
                codigo_barras: selectedProduct.codigo_barras,
                nombre: selectedProduct.nombre,
                descripcion: selectedProduct.descripcion,
                categoria: selectedProduct.categoria,
                cantidad_a_cargar,
                unidad_de_medida: selectedProduct.unidad_de_medida,
                ubicacion_destino,
                precio_compra: selectedProduct.precio_compra,
                porcentaje_ganancia: selectedProduct.porcentaje_ganancia,
                porcentaje_ganancia_mayor: selectedProduct.porcentaje_ganancia_mayor,
                forma_de_venta_mayor: selectedProduct.forma_de_venta_mayor,
                forma_de_venta: selectedProduct.forma_de_venta,
                proveedor: selectedProduct.proveedor,
                fecha_entrada: selectedProduct.fecha_entrada,
                fecha_caducidad: selectedProduct.fecha_caducidad,
                peso: selectedProduct.peso,
                imagen: selectedProduct.imagen
            });

            if (response.status === 200 || response.status === 201) {
                Swal.fire("Inventario cargado", "", "success");
                mutate(); // Actualiza los productos después de cargar inventario
                return response;
            } else {
                console.error("Error al cargar el inventario");
                Swal.fire("Error al cargar el inventario", "", "error");
            }
        } catch (error) {
            if (error.response.status !== 422) throw error;
            setErrors(error.response.data.errors);
            Swal.fire("Error al cargar el inventario", "", "error");
        }
    };

    const descargarInventario = async (productoId, cantidad_a_descargar, ubicacion_origen, ubicacion_destino, cantidad_a_enviar) => {
        await csrf();

        const selectedProduct = products.find(product => product.id === productoId);

        try {
            const response = await axios.post(`/api/productos/${productoId}/descargar`, {
                codigo_barras: selectedProduct.codigo_barras,
                cantidad_a_descargar,
                ubicacion_origen,
                ubicacion_destino,
                cantidad_a_enviar
            });

            if (response.status === 200 || response.status === 201) {
                Swal.fire("Inventario descargado", "", "success");
                mutate(); // Actualiza los productos después de descargar inventario
                return response;
            } else {
                console.error("Error al descargar el inventario");
                Swal.fire("Error al descargar el inventario", "", "error");
            }
        } catch (error) {
            if (error.response.status !== 422) throw error;
            setErrors(error.response.data.errors);
            Swal.fire("Error al descargar el inventario", "", "error");
        }
    };
    const habilitarProducto = async (id) => {
        await csrf();

        try {
            const response = await axios.post(`/api/productos/${id}/habilitar`);
            if (response.status === 200 || response.status === 201) {
                mutateInhabilitado();
                return true; // Indica éxito
            } else {
                console.error("Error al habilitar el producto");
                return false; // Indica fallo
            }
        } catch (error) {
            console.error("Error al habilitar el producto", error);
            return false; // Indica fallo
        }
    };

    return {
        products,
        addProduct,
        updateProduct,
        removeProduct,
        cargarInventario,
        descargarInventario,
        error,
        productsInhabilitados,
        mutateInhabilitado,
        errors,
        habilitarProducto

    };
};
