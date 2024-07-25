import useSWR from 'swr';
import axios from '@/lib/axios';
import { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const fetcher = url => axios.get(url).then(res => res.data);

export const useReportData = (startDate, endDate, location) => {
    const { data, error, mutate } = useSWR(
        `/api/analisis?start_date=${startDate}&end_date=${endDate}&location=${location}`,
        fetcher
    );

    const [recommendations, setRecommendations] = useState(null);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const [errorRecommendations, setErrorRecommendations] = useState(null);
console.log( `
    Esto es el resumen de movimientos y ventas de la semana ${JSON.stringify(data)}
    Eres un experto en modelo de negocios que ayuda a la empresa a mejorar sus ventas a través de recomendaciones.
    Debes proporcionar respuestas precisas y concisas basadas en las órdenes proporcionadas.
    Responde solo con la información relevante y necesaria.
`)
    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!data) return;

            setLoadingRecommendations(true);
            setErrorRecommendations(null);
            
            const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "AIzaSyBrOYEnvUxyH0Bg0YBHhbUneLcMNqiiU-U";
            if (!apiKey) {
                console.error('API Key is not defined');
                return;
            }

            const genAI = new GoogleGenerativeAI(apiKey);

            try {
                const model = await genAI.getGenerativeModel({
                    model: "gemini-1.5-flash-latest"
                });

                console.log("Model fetched:", model);
             
                const result = await model.generateText({
                    prompt: `
                        Esto es el resumen de movimientos y ventas de la semana ${JSON.stringify(data)}
                        Eres un experto en modelo de negocios que ayuda a la empresa a mejorar sus ventas a través de recomendaciones.
                        Debes proporcionar respuestas precisas y concisas basadas en las órdenes proporcionadas.
                        Responde solo con la información relevante y necesaria.
                    `,
                    generationConfig: {
                        temperature: 1,
                        topP: 0.9,
                    },
                });
              

                console.log("Generated result:", result);

                const response = await result.response.text();
                console.log("Response text:", response);

                setRecommendations(response);
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
