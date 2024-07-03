'use client';
import React from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend
  } from 'chart.js';
  
  // Registro de elementos y escalas necesarios para los gráficos
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip,
    Legend
  );

// Datos para los gráficos
const pieData = {
    labels: ['Producto A', 'Producto B', 'Producto C'],
    datasets: [{
        data: [150, 90, 60],
        backgroundColor: ['red', 'blue', 'green'],
    }],
};

const lineData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril"],
    datasets: [{
        label: "Ventas por mes 2024",
        data: [12000, 19000, 17000, 20000],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1
    }]
};

// Datos estáticos para la tabla de ventas
const salesData = [
    { id: 1, customer: 'Empresa XYZ', date: '2024-06-01', total: 1200 },
    { id: 2, customer: 'Empresa ABC', date: '2024-06-02', total: 1100 },
    { id: 3, customer: 'Empresa 123', date: '2024-06-03', total: 1300 },

];
const totalPurchases = 50000;  // Total compras a proveedores
const totalSales = 96000;      // Total ventas
const profit = totalSales - totalPurchases;  // Ganancia
const profitPercentage = ((profit / totalSales) * 100).toFixed(2);

const Dashboard = () => {
    const { isDark } = useTheme();
    const bgClass = isDark ? 'bg-gray-800' : 'bg-white';
    const textClass = isDark ? 'text-white' : 'text-gray-900';
    const borderClass = isDark ? 'divide-gray-700' : 'divide-gray-200';
    const cardBgClass = isDark ? 'bg-gray-900' : 'bg-white';
    const shadowClass = isDark ? 'shadow-white' : 'shadow-md';
    const tableBgClass = isDark ? 'bg-gray-700' : 'bg-gray-50';
    const tableTextClass = isDark ? 'text-gray-300' : 'text-gray-600';

    return (
        <div className={`flex flex-col h-full w-full overflow-hidden ${bgClass} ${textClass}`}>
            <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    { label: 'Ventas diarias', value: '$5,000' },
                    { label: 'Ventas mensuales', value: '$80,000' },
                    { label: 'Ventas anuales', value: '$960,000' },
                    { label: 'Producto más vendido', value: 'Producto A' },
                    { label: 'Producto menos vendido', value: 'Producto C' },
                    { label: 'Mejor cliente', value: 'Empresa XYZ' },
                    { label: 'Compras a proveedores', value: `$${totalPurchases}` },
                    { label: 'Ganancias', value: `$${profit} (${profitPercentage}%)` }
                ].map(stat => (
                    <div key={stat.label} className={`rounded-lg p-4 sm:p-6 xl:p-8 ${cardBgClass} ${shadowClass} ${textClass}`}>
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <span className="text-2xl sm:text-3xl leading-none font-bold">{stat.value}</span>
                                <h3 className="text-base font-normal">{stat.label}</h3>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex mt-4 justify-around">
                <div className={`rounded-lg p-4 sm:p-6 xl:p-8 w-1/3 ${cardBgClass} ${shadowClass} ${textClass}`}>
                    <h3 className="text-xl font-bold">Productos vendidos</h3>
                    <span className="text-base font-normal">Cantidad de productos vendidos</span>
                    <Pie data={pieData} />
                </div>
                <div className={`rounded-lg p-4 sm:p-6 xl:p-8 w-2/3 ${cardBgClass} ${shadowClass} ${textClass}`}>
                    <h3 className="text-xl font-bold">Historial de ventas anuales</h3>
                    <Line data={lineData} />
                </div>
            </div>

            <div className={`mt-4 rounded-lg p-4 sm:p-6 xl:p-8 ${cardBgClass} ${shadowClass} ${textClass}`}>
                <h3 className="text-xl font-bold">Tabla de Ventas</h3>
                <div className="flex flex-col mt-2">
                    <div className="overflow-x-auto rounded-lg">
                        <div className="align-middle inline-block min-w-full">
                            <div className="shadow overflow-hidden sm:rounded-lg">
                                <table className="min-w-full divide-y ${borderClass}">
                                    <thead className={`${tableBgClass}`}>
                                        <tr>
                                            <th className="p-4 text-left text-xs font-medium ${tableTextClass} uppercase tracking-wider">Cliente</th>
                                            <th className="p-4 text-left text-xs font-medium ${tableTextClass} uppercase tracking-wider">Fecha</th>
                                            <th className="p-4 text-left text-xs font-medium ${tableTextClass} uppercase tracking-wider">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`${cardBgClass}`}>
                                        {salesData.map(sale => (
                                            <tr key={sale.id}>
                                                <td className="p-4 whitespace-nowrap text-sm font-normal ${textClass}">{sale.customer}</td>
                                                <td className="p-4 whitespace-nowrap text-sm font-normal ${textClass}">{sale.date}</td>
                                                <td className="p-4 whitespace-nowrap text-sm font-semibold ${textClass}">${sale.total}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
