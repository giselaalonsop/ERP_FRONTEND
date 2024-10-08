import useSWR from 'swr';
import axios from '@/lib/axios';
import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Definimos el fetcher para obtener datos
const fetcher = url => axios.get(url).then(res => res.data);

// Hook personalizado para obtener datos y generar recomendaciones
export const useReportData = (startDate, endDate, location) => {
    const { data, error, mutate } = useSWR(
        `/api/analisis?start_date=${startDate}&end_date=${endDate}&location=${location}`,
        fetcher
    );

    const [recommendations, setRecommendations] = useState(null);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const [errorRecommendations, setErrorRecommendations] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
          
            if (!data) return;

            setLoadingRecommendations(true);
            setErrorRecommendations(null);
            
            const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyBrOYEnvUxyH0Bg0YBHhbUneLcMNqiiU-U";

            const genAI = new GoogleGenerativeAI(apiKey);

            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash-latest",
                systemInstruction: `
                    Se te proporciona un resumen de movimientos y ventas en un rango de fechas y ubicación.
                    Eres un experto en modelo de negocios que ayuda a la empresa a mejorar sus ventas a través de recomendaciones.
                    Debes proporcionar respuestas precisas y concisas basadas en la informacion proporcionada.
                    Responde solo con la información relevante y necesaria.
                   
                `,
                generationConfig: {
                    temperature: 1,
                    topP: 0.9,
                },
            });

            try {
                const chat = model.startChat({});
                const result = await chat.sendMessage(`
                    Esto es el resumen de movimientos y ventas en el rango ${startDate} y ${endDate} ${JSON.stringify(data)} y con lagunos datos generales.
                    Tomando en cuenta los del rango y los generales y toda la informacion que has recibido
                    , genera un parrafo con recomendaciones para mejorar las ventas .
                    

                `);

                const response = await result.response;
                const text = await response.text();

                setRecommendations(text);
            } catch (err) {
                console.error("Error fetching recommendations:", err);
                setErrorRecommendations(err);
            } finally {
                setLoadingRecommendations(false);
            }
        };

        fetchRecommendations();
    }, [data]);

    return {
        reportData: data,
        loading: !error && !data,
        error,
        mutate,
        recommendations,
        loadingRecommendations,
        errorRecommendations,
    };
};

export default useReportData;
