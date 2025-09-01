import { useState, useEffect, useMemo } from 'react';
import axios from '@/lib/axios';

const DEFAULT_CONFIG = {
  logo: null,
  IVA: 0,
  porcentaje_ganancia: 0,
  nombre_empresa: '',
  telefono: '',
  rif: '',
  correo: '',
  numero_sucursales: 1,
  direcciones: null,      // o {}
  pago_movil: [],         // si es JSON
  transferencias: [],     // si es JSON
  location: 'Principal',
};

const useConfiguracion = () => {
  const [configuracion, setConfiguracion] = useState(null); // null = no hay registro aún
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -------------- solo 1 useEffect --------------
  useEffect(() => {
    let cancel = false;

    const fetchConfiguracion = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get('/api/configuracion', {
          // acepta 204 como “OK sin contenido”
          validateStatus: s => (s >= 200 && s < 300) || s === 204,
        });

        if (cancel) return;

        if (res.status === 204 || !res.data || (res.data && !res.data.config)) {
          setConfiguracion(null);
          setLogo(null);
        } else {
          // el controller devuelve { ok:true, config: {...} }
          const cfg = res.data.config ?? res.data;
          setConfiguracion(cfg);
          setLogo(cfg?.logo ?? null);
        }
      } catch (err) {
        if (!cancel) {
          setError(err);
          setConfiguracion(null);
          setLogo(null);
        }
      } finally {
        if (!cancel) setLoading(false);
      }
    };

    fetchConfiguracion();
    return () => { cancel = true; };
  }, []);

  // objeto seguro para consumir en el UI
  const configOrDefault = useMemo(
    () => configuracion ?? DEFAULT_CONFIG,
    [configuracion]
  );

  const createConfiguracion = async (data) => {
    try {
      const res = await axios.post('/api/configuracion', data, {
        // si mandas archivo (logo), asegúrate de enviar FormData y este header:
        // headers: { 'Content-Type': 'multipart/form-data' },
      });
      const cfg = res.data.config ?? res.data ?? null;
      setConfiguracion(cfg);
      setLogo(cfg?.logo ?? null);
      return res;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const deleteConfiguracion = async (id) => {
    try {
      await axios.delete(`/api/configuracion/${id}`);
      setConfiguracion(null);
      setLogo(null);
    } catch (err) {
      setError(err);
    }
  };

  return {
    configuracion,        // puede ser null
    configOrDefault,      // siempre tiene valores por defecto
    logo,
    loading,
    error,
    createConfiguracion,
    deleteConfiguracion,
  };
};

export default useConfiguracion;
