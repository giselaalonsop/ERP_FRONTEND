'use client';

import React, { useState } from 'react';
import { useTheme } from '@/context/ThemeProvider';
import { Pie, Doughnut, Line } from 'react-chartjs-2';
import useReportData from '@/hooks/useReporteData';
import Input from '@/components/Input';
import Label from '@/components/Label';
import { useAuth } from '@/hooks/auth';
import { Button, Drawer, Tooltip } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Tooltip as ChartTooltip,
    Legend
} from 'chart.js';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    ChartTooltip,
    Legend
);

const Dashboard = () => {
    const { user } = useAuth();
    const { isDark } = useTheme();
    const bgClass = isDark ? 'bg-gray-800' : 'bg-white';
    const textClass = isDark ? 'text-white' : 'text-gray-900';
    const borderClass = isDark ? 'divide-gray-700' : 'divide-gray-200';
    const cardBgClass = isDark ? 'bg-gray-900' : 'bg-white';
    const shadowClass = isDark ? 'shadow-white' : 'shadow-md';
    const tableBgClass = isDark ? 'bg-gray-700' : 'bg-gray-50';
    const tableTextClass = isDark ? 'text-gray-300' : 'text-gray-600';
    const buttonBgClass = isDark ? 'bg-gray-700' : 'bg-gray-200';
    const buttonHoverClass = isDark ? 'hover:bg-gray-600' : 'hover:bg-gray-300';
    const drawerBgClass = isDark ? 'bg-gray-800' : 'bg-white';
    const drawerTextClass = isDark ? 'text-gray-400' : 'text-gray-500';
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)));
    const [endDate, setEndDate] = useState(new Date());
    const [location, setLocation] = useState(user.location);

    const { reportData, loading, error, recommendations } = useReportData(startDate, endDate, location);

    const handleChangeStartDate = (e) => setStartDate(new Date(e.target.value));
    const handleChangeEndDate = (e) => setEndDate(new Date(e.target.value));
    const handleChangeLocation = (e) => setLocation(e.target.value);

    const handleDownload = async () => {
        const input = document.getElementById('report-content');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        pdf.save('report.pdf');
    };

    const handleClienteInactivoClick = (cliente) => {
        Swal.fire({
            title: 'Datos del Cliente Inactivo',
            html: `<p><strong>Nombre:</strong> ${cliente.nombre}</p>
                   <p><strong>Cédula:</strong> ${cliente.cedula}</p>
                   <p><strong>Última Compra:</strong> ${cliente.ultima_compra}</p>`,
            icon: 'info',
        });
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading data</p>;

    const pieData = {
        labels: reportData.topCategorias.map(cat => cat.categoria),
        datasets: [{
            data: reportData.topCategorias.map(cat => parseFloat(cat.total_ventas)),
            backgroundColor: ['#1C64F2', '#16BDCA', '#9061F9'],
            borderColor: ['#fff', '#fff', '#fff'],
            borderWidth: 1,
            hoverOffset: 4
        }],
    };

    const doughnutDataTopProductos = {
        labels: reportData.topProductos.map(prod => prod.nombre),
        datasets: [{
            data: reportData.topProductos.map(prod => parseFloat(prod.total_vendido)),
            backgroundColor: ['#1C64F2', '#16BDCA', '#9061F9'],
            borderColor: ['#fff', '#fff', '#fff'],
            borderWidth: 1,
            hoverOffset: 4
        }],
    };

    const lineData = {
        labels: reportData.historialVentas.map(item => item.fecha),
        datasets: [{
            label: "Ventas en el rango de fechas",
            data: reportData.historialVentas.map(item => parseFloat(item.total_ventas)),
            fill: false,
            borderColor: "rgba(75, 192, 192, 1)",
            tension: 0.1
        }]
    };

    const formatValue = (value) => {
        if (isNaN(value)) return '0.00';
        return parseFloat(value).toFixed(2);
    };

    return (
        <div className={`flex flex-col h-full w-full overflow-hidden ${bgClass} ${textClass}`}>
            <div className="flex flex-wrap justify-between items-center mb-4">
                <div className="flex mx-2">
                    <div className="flex flex-col mr-4 ">
                        <Label htmlFor="fecha_inicio" className="mr-2">
                            Desde
                        </Label>
                        <Input
                            type="date"
                            id="fecha_inicio"
                            value={startDate.toISOString().split('T')[0]}
                            max={
                                new Date()
                                    .toISOString()
                                    .split('T')[0]
                            }
                            onChange={handleChangeStartDate}
                            className="bg-transparent border-none text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        />
                    </div>
                    <div className="flex flex-col">
                        <Label htmlFor="fecha_fin" className="mr-2">
                            Hasta
                        </Label>
                        <Input
                            type="date"
                            id="fecha_fin"
                            value={endDate.toISOString().split('T')[0]}
                            max={
                                new Date()
                                    .toISOString()
                                    .split('T')[0]
                            }
                            onChange={handleChangeEndDate}
                            className="bg-transparent border-none text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                        />
                    </div>
                </div>
                <div className="flex items-center mt-4 sm:mt-0 mx-2">
                    <select
                        id="location"
                        value={location}
                        onChange={handleChangeLocation}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 mr-4"
                    >
                        <option value="Bejuma">Bejuma</option>
                        <option value="Montalban">Montalban</option>
                    </select>
                    <button
                        onClick={handleDownload}
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700"
                    >
                        Descargar
                    </button>
                    <Tooltip content="Ver Recomendaciones" className={`${isDark? 'bg-gray-600': 'bg-gray-100'}`}>
                        <Button onClick={toggleDrawer} className='bg-transparent'> 
                            <FontAwesomeIcon icon={faCircleExclamation} className='text-red-600 h-6 w-6' />
                        </Button>
                    </Tooltip>
                </div>
            </div>

            <div id="report-content" className="mt-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                    {[
                        { label: 'Ventas promedio diarias', value: `$${formatValue(reportData.ventasDiariasPromedio)}` },
                        { label: 'Ventas promedio semanales', value: `$${formatValue(reportData.ventasSemanalesPromedio)}` },
                        { label: 'Ventas mensuales Promedio', value: `${reportData.ventasMensuales?.total_ventas_cantidad || 0} ventas / $${reportData.ventasMensuales?.total_ventas_mensuales || 0}` },
                        { label: 'Ventas anuales Promedio', value: `${reportData.ventasAnuales?.total_ventas_cantidad || 0} ventas / $${reportData.ventasAnuales?.total_ventas_anuales || 0}` },
                        { label: 'Ventas en rango', value: `${reportData.ventasRango?.total_ventas_cantidad || 0} ventas / $${reportData.ventasRango?.total_ventas_rango || 0}` },
                        { label: 'Producto más vendido en rango', value: `${reportData.topProducto?.nombre || 'N/A'} (${reportData.topProducto?.total_vendido || 0})` },
                        { label: 'Producto menos vendido en rango', value: `${reportData.bottomProducto?.nombre || 'N/A'} (${reportData.bottomProducto?.total_vendido || 0})` },
                        { label: 'Mejor cliente en rango ', value: `${reportData.topCliente?.nombre || 'N/A'} (${reportData.topCliente?.total_compras || 0})` },
                        { label: 'Compras a proveedores en rango', value: `$${reportData.montoCompras || 0}` },
                        { label: 'Ganancias en rango', value: `$${reportData.gananciasRango ? parseFloat(reportData.gananciasRango).toFixed(2): 0}` },
                        { label: 'Capital total', value: `$${reportData.capital ? parseFloat(reportData.capital).toFixed(2) : 0}` },
                        { label: 'Productos agotados', value: reportData.productosAgotados?.length || 0 },
                        { label: 'Productos cerca de vencimiento o vencidos', value: reportData.productosVencimiento?.length+reportData.productosVencidos?.length || 0 },
                        { label: 'Ticket promedio', value: `$${reportData.ventaPromedio ? parseFloat(reportData.ventaPromedio).toFixed(2) : 0}` },
                        { label: 'Pagos pendientes', value: `${reportData.pagosPendientes?.cantidad || 0} pagos / $${reportData.pagosPendientes?.total || 0}` },
                        { label: 'Cobros pendientes', value: `${reportData.cobrosPendientes?.cantidad || 0} cobros / $${reportData.cobrosPendientes?.total || 0}` },
                        { label: 'Clientes inactivos(30 dias o mas)', value: reportData.clientesInactivos?.length || 0 }
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

                <div className="flex flex-wrap mt-4 justify-around">
                    <div className={`rounded-lg p-4 sm:p-6 xl:p-8 w-full md:w-1/3 ${cardBgClass} ${shadowClass} ${textClass}`}>
                        <h3 className="text-xl font-bold">Categorias mas vendidas</h3>
                       
                        <Pie data={pieData} />
                    </div>
                    
                    <div className={`rounded-lg p-4 sm:p-6 xl:p-8 w-full md:w-2/3 ${cardBgClass} ${shadowClass} ${textClass}`}>
                        <h3 className="text-xl font-bold">Historial de ventas en el rango de fechas</h3>
                        <Line data={lineData} />
                    </div>
                </div>

                <div className="flex flex-wrap mt-4 justify-around">
                    <div className={`rounded-lg p-4 sm:p-6 xl:p-8 w-full md:w-2/3 ${cardBgClass} ${shadowClass} ${textClass}`}>
                        <h3 className="text-xl font-bold">Tabla de Ventas</h3>
                        {reportData.historialVentas.length > 0 ? (
                            <div className="flex flex-col mt-2">
                                <div className="overflow-x-auto rounded-lg">
                                    <div className="align-middle inline-block min-w-full">
                                        <div className="shadow overflow-hidden sm:rounded-lg">
                                            <table className={`min-w-full divide-y ${borderClass}`}>
                                                <thead className={`${tableBgClass}`}>
                                                    <tr>
                                                       
                                                        <th className={`p-4 text-left text-xs font-medium ${tableTextClass} uppercase tracking-wider`}>Fecha</th>
                                                        <th className={`p-4 text-left text-xs font-medium ${tableTextClass} uppercase tracking-wider`}>Total</th>
                                                    </tr>
                                                </thead>
                                                <tbody className={`${cardBgClass}`}>
                                                    {reportData.historialVentas.map((venta, index) => (
                                                        <tr key={index}>
                                                          
                                                            <td className={`p-4 whitespace-nowrap text-sm font-normal ${textClass}`}>{venta.fecha}</td>
                                                            <td className={`p-4 whitespace-nowrap text-sm font-semibold ${textClass}`}>${formatValue(venta.total_ventas)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>No hay datos de ventas disponibles.</p>
                        )}
                    </div>
                    <div className={`rounded-lg p-4 sm:p-6 xl:p-8 w-full md:w-1/3 ${cardBgClass} ${shadowClass} ${textClass}`}>
                        <h3 className="text-xl font-bold">Top 3 Productos</h3>
                        <span className="text-base font-normal">Cantidad de productos más vendidos</span>
                        <Doughnut data={doughnutDataTopProductos} />
                    </div>
                </div>

                <div className="flex flex-wrap mt-4 justify-around">
                    <div className={`rounded-lg p-4 sm:p-6 xl:p-8 w-full md:w-1/2 ${cardBgClass} ${shadowClass} ${textClass}`}>
                        <h3 className="text-xl font-bold">Productos Cerca de Vencimiento o Vencidos</h3>
                        {reportData.productosVencimiento.length > 0 || reportData.productosVencidos.length > 0 ? (
                            <div className="flex flex-col mt-2">
                                <div className="overflow-x-auto rounded-lg">
                                    <div className="align-middle inline-block min-w-full">
                                        <div className="shadow overflow-hidden sm:rounded-lg">
                                            <table className={`min-w-full divide-y ${borderClass}`}>
                                                <thead className={`${tableBgClass}`}>
                                                    <tr>
                                                        <th className={`p-4 text-left text-xs font-medium ${tableTextClass} uppercase tracking-wider`}>Nombre</th>
                                                        <th className={`p-4 text-left text-xs font-medium ${tableTextClass} uppercase tracking-wider`}>Código de Barras</th>
                                                        <th className={`p-4 text-left text-xs font-medium ${tableTextClass} uppercase tracking-wider`}>Fecha de Vencimiento</th>
                                                        <th className={`p-4 text-left text-xs font-medium ${tableTextClass} uppercase tracking-wider`}>Estado</th>
                                                    </tr>
                                                </thead>
                                                <tbody className={`${cardBgClass}`}>
                                                    {reportData.productosVencimiento.map((producto, index) => (
                                                        <tr key={index}>
                                                            <td className={`p-4 whitespace-nowrap text-sm font-normal ${textClass}`}>{producto.nombre}</td>
                                                            <td className={`p-4 whitespace-nowrap text-sm font-normal ${textClass}`}>{producto.codigo_barras}</td>
                                                            <td className={`p-4 whitespace-nowrap text-sm font-normal ${textClass}`}>{producto.fecha_caducidad}</td>
                                                            <td className={`p-4 whitespace-nowrap text-sm font-normal ${textClass}`}>Por Vencer</td>
                                                        </tr>
                                                    ))}
                                                    {reportData.productosVencidos.map((producto, index) => (
                                                        <tr key={index}>
                                                            <td className={`p-4 whitespace-nowrap text-sm font-normal ${textClass}`}>{producto.nombre}</td>
                                                            <td className={`p-4 whitespace-nowrap text-sm font-normal ${textClass}`}>{producto.codigo_barras}</td>
                                                            <td className={`p-4 whitespace-nowrap text-sm font-normal ${textClass}`}>{producto.fecha_caducidad}</td>
                                                            <td className={`p-4 whitespace-nowrap text-sm font-normal ${textClass}`}>Vencido</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>No hay productos cerca de vencimiento o vencidos.</p>
                        )}
                    </div>

                    <div className={`rounded-lg p-4 sm:p-6 xl:p-8 w-full md:w-1/2 ${cardBgClass} ${shadowClass} ${textClass}`}>
                        <h3 className="text-xl font-bold">Productos Agotados</h3>
                        {reportData.productosAgotados.length > 0 ? (
                            <div className="flex flex-col mt-2">
                                <div className="overflow-x-auto rounded-lg">
                                    <div className="align-middle inline-block min-w-full">
                                        <div className="shadow overflow-hidden sm:rounded-lg">
                                            <table className={`min-w-full divide-y ${borderClass}`}>
                                                <thead className={`${tableBgClass}`}>
                                                    <tr>
                                                        <th className={`p-4 text-left text-xs font-medium ${tableTextClass} uppercase tracking-wider`}>Nombre</th>
                                                        <th className={`p-4 text-left text-xs font-medium ${tableTextClass} uppercase tracking-wider`}>Código de Barras</th>
                                                    </tr>
                                                </thead>
                                                <tbody className={`${cardBgClass}`}>
                                                    {reportData.productosAgotados.map((producto, index) => (
                                                        <tr key={index}>
                                                            <td className={`p-4 whitespace-nowrap text-sm font-normal ${textClass}`}>{producto.nombre}</td>
                                                            <td className={`p-4 whitespace-nowrap text-sm font-normal ${textClass}`}>{producto.codigo_barras}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>No hay productos agotados.</p>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap mt-4 justify-around">
                    <div className={`rounded-lg p-4 sm:p-6 xl:p-8 w-full ${cardBgClass} ${shadowClass} ${textClass}`}>
                        <h3 className="text-xl font-bold">Clientes Inactivos</h3>
                        {reportData.clientesInactivos.length > 0 ? (
                            <div className="flex flex-col mt-2">
                                <div className="overflow-x-auto rounded-lg">
                                    <div className="align-middle inline-block min-w-full">
                                        <div className="shadow overflow-hidden sm:rounded-lg">
                                            <table className={`min-w-full divide-y ${borderClass}`}>
                                                <thead className={`${tableBgClass}`}>
                                                    <tr>
                                                        <th className={`p-4 text-left text-xs font-medium ${tableTextClass} uppercase tracking-wider`}>Nombre</th>
                                                        <th className={`p-4 text-left text-xs font-medium ${tableTextClass} uppercase tracking-wider`}>Cédula</th>
                                                        <th className={`p-4 text-left text-xs font-medium ${tableTextClass} uppercase tracking-wider`}>Última Compra</th>
                                                    </tr>
                                                </thead>
                                                <tbody className={`${cardBgClass}`}>
                                                    {reportData.clientesInactivos.map((cliente, index) => (
                                                        <tr key={index} onClick={() => handleClienteInactivoClick(cliente)}>
                                                            <td className={`p-4 whitespace-nowrap text-sm font-normal ${textClass} cursor-pointer`}>{cliente.nombre}</td>
                                                            <td className={`p-4 whitespace-nowrap text-sm font-normal ${textClass}`}>{cliente.cedula}</td>
                                                            <td className={`p-4 whitespace-nowrap text-sm font-normal ${textClass}`}>{cliente.ultima_compra}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p>No hay clientes inactivos.</p>
                        )}
                    </div>
                </div>
            </div>

            <Drawer open={isDrawerOpen} onClose={toggleDrawer} position="right" className={drawerBgClass}
           style={isDark ? { color: '#fff', backgroundColor: '#000' } : { color: '#000', backgroundColor: '#fff' }}
           >
                <Drawer.Header title="Recomendaciones" />
                <Drawer.Items className={drawerTextClass}>
                    <div className="p-4">
                        {recommendations ? (
                            <p className={`text-lg ${drawerTextClass}`}>{recommendations}</p>
                        ) : (
                            <p>No hay recomendaciones disponibles en este momento.</p>
                        )}
                    </div>
                </Drawer.Items>
            </Drawer>
        </div>
    );
};

export default Dashboard;
