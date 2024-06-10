import axios from '@/lib/axios';
import Swal from 'sweetalert2';
import { useEffect, useState } from 'react';

export const useProduct = () => {
    const [products, setProducts] = useState([]);
    const [errors, setErrors] = useState([]);

    const csrf = () => axios.get('/sanctum/csrf-cookie');

    const addProduct = async ({ setErrors, ...props }) => {
        await csrf();
        setErrors([]);

        try {
            const response = await axios.post('/api/productos', props);
            if (response.status === 201) {
                Swal.fire("Registro procesado", "", "success");
                getProducts(); // Actualizar productos después de agregar uno nuevo
                return response;
            } else {
                console.error("Error al guardar los datos");
                Swal.fire("Error al guardar los datos", "", "error");
            }
        } catch (error) {
            if (error.response.status !== 422) throw error;
            setErrors(error.response.data.errors);
            Swal.fire("Error al guardar los datos", "", "error");
        }
    };

    const getProducts = async () => {
        await csrf();

        try {
            const response = await axios.get('/api/productos');
            setProducts(response.data);
        } catch (error) {
            console.error("Error al obtener los datos", error);
            setErrors(error.response.data.errors || []);
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
                forma_de_venta: selectedProduct.forma_de_venta,
                proveedor: selectedProduct.proveedor,
                fecha_entrada: selectedProduct.fecha_entrada,
                fecha_caducidad: selectedProduct.fecha_caducidad,
                peso: selectedProduct.peso,
                imagen: selectedProduct.imagen
            });
    
            if (response.status === 200 || response.status === 201) {
                Swal.fire("Inventario cargado", "", "success");
                getProducts();
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

    const descargarInventario = async (productoId, cantidad_a_descargar, ubicacion_origen, ubicacion_destino = null, cantidad_a_enviar = null) => {
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
                getProducts();
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
    

    useEffect(() => {
        getProducts();
    }, []);

    return {
        products,
        addProduct,
        getProducts,
        cargarInventario,
        descargarInventario,
    };
};
