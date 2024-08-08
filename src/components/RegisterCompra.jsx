import React, { useState, useEffect } from 'react'
import { useCompras } from '@/hooks/useCompras'
import { useAuth } from '@/hooks/auth'
import { AutoComplete } from 'primereact/autocomplete'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Label from '@/components/Label'
import Swal from 'sweetalert2'
import Modal from '@/components/Modal'
import RegisterProveedor from '@/components/RegisterProveedorForm'

const RegisterCompra = ({ compra, onClose, editMode }) => {
    const { hasPermission, user } = useAuth({ middleware: 'auth' })
    const { addCompra, updateCompra, proveedores } = useCompras()
    
    const [formData, setFormData] = useState({
        proveedor_id: '',
        fecha: '',
        descripcion: '',
        monto_total: 0,
        monto_abonado: 0,
        estado: 'pendiente',
    })
    const [filteredProveedores, setFilteredProveedores] = useState([])
    const [selectedProveedor, setSelectedProveedor] = useState(null)
    const [errors, setErrors] = useState({})
    const [touched, setTouched] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalContent, setModalContent] = useState(null)
    const [modalTitle, setModalTitle] = useState('')

    useEffect(() => {
        if (compra) {
            setFormData({ ...compra })
            setSelectedProveedor(
                proveedores.find(p => p.id === compra.proveedor_id),
            )
        }
    }, [compra, proveedores])

    useEffect(() => {
        validateForm()
    }, [formData])

    const openModal = (content, title) => {
        setModalContent(content)
        setModalTitle(title)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setModalContent(null)
        setModalTitle('')
    }

    const handleChange = e => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleBlur = field => {
        setTouched({
            ...touched,
            [field]: true,
        })
    }

    const searchProveedor = event => {
        const query = event.query.toLowerCase()
        const filtered = proveedores.filter(proveedor =>
            proveedor.empresa.toLowerCase().includes(query),
        )

        if (filtered.length === 0) {
            if (
                hasPermission(user, 'agregarProveedores') ||
                user?.rol === 'admin'
            ) {
                filtered.push({ id: 'new', empresa: 'Agregar nuevo proveedor' })
            }
        }

        setFilteredProveedores(filtered)
    }

    const handleProveedorSelect = e => {
        const selected = e.value

        if (selected.id === 'new') {
            openModal(
                <RegisterProveedor onClose={closeModal} />,
                'Agregar Nuevo Proveedor',
            )
            setSelectedProveedor(null) // Limpiar el AutoComplete
            setFormData({ ...formData, proveedor_id: '' }) // Limpiar el formData
        } else {
            setSelectedProveedor(selected)
            setFormData({ ...formData, proveedor_id: selected.id })
        }
    }

    const validateForm = () => {
        const newErrors = {}
        if (!formData.proveedor_id) {
            newErrors.proveedor_id = 'El proveedor debe ser seleccionado'
        }
        if (!formData.fecha.trim()) {
            newErrors.fecha = 'La fecha no puede estar vacía'
        }
        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción no puede estar vacía'
        }

        if (formData.monto_total <= 0) {
            newErrors.monto_total = 'El monto total debe ser mayor a 0'
        } else if (isNaN(parseFloat(formData.monto_total))) {
            newErrors.monto_total = 'El monto total debe ser un número'
        }
        if (formData.monto_abonado === '') {
            newErrors.monto_abonado = 'El monto abonado no puede estar vacío'
        } else if (isNaN(parseFloat(formData.monto_abonado))) {
            newErrors.monto_abonado = 'El monto abonado debe ser un número'
        } else if (
            parseFloat(formData.monto_abonado) >
            parseFloat(formData.monto_total)
        ) {
            newErrors.monto_abonado =
                'El monto abonado no puede ser mayor que el monto total'
        }

        setErrors(newErrors)
        return newErrors
    }

    const handleSubmit = async e => {
        e.preventDefault()

        // Marcar todos los campos como tocados
        setTouched({
            proveedor_id: true,
            fecha: true,
            descripcion: true,
            monto_total: true,
            monto_abonado: true,
        })

        const newErrors = validateForm()

        if (Object.keys(newErrors).length > 0) {
            Swal.fire('Error en la validación', '', 'error')
            return
        }

        const montoTotal =
            Math.round(parseFloat(formData.monto_total) * 100) / 100
        const montoAbonado =
            Math.round(parseFloat(formData.monto_abonado) * 100) / 100

        const formDataToSubmit = {
            ...formData,
            usuario_id: user ? user.id : '',
            monto_total: montoTotal,
            monto_abonado: montoAbonado,
            estado: montoAbonado >= montoTotal ? 'pagada' : 'pendiente',
        }

        console.log(formDataToSubmit)

        try {
            if (editMode) {
                const response = await updateCompra(compra.id, formDataToSubmit)
                if (response.status === 200 || response.status === 201) {
                    Swal.fire('Compra Actualizada', '', 'success')
                } else {
                    Swal.fire(
                        'Error',
                        'Hubo un problema al procesar la solicitud',
                        'error',
                    )
                }
            } else {
                const response = await addCompra(formDataToSubmit)
                if (response.status === 200 || response.status === 201) {
                    Swal.fire('Compra Registrada', '', 'success')
                } else {
                    Swal.fire(
                        'Error',
                        'Hubo un problema al procesar la solicitud',
                        'error',
                    )
                }
            }
            onClose()
        } catch (error) {
            Swal.fire(
                'Error',
                error.response?.data?.error ||
                    'Hubo un problema al procesar la solicitud',
                'error',
            )
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
                {modalContent}
            </Modal>
            <div className="text-center mb-10">
                <h2 className="text-2xl font-bold">
                    {editMode ? 'Editar Compra' : 'Registrar Compra'}
                </h2>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <Label
                            htmlFor="proveedor_id"
                            className="block mb-2 text-sm font-medium">
                            Proveedor
                        </Label>
                        <AutoComplete
                            value={selectedProveedor}
                            suggestions={filteredProveedores}
                            completeMethod={searchProveedor}
                            field="empresa"
                            itemTemplate={item => (
                                <div className="bg-white text-gray-900">
                                    {item.empresa}
                                </div>
                            )}
                            onChange={e => {
                                setSelectedProveedor(e.value)
                                setFormData({
                                    ...formData,
                                    proveedor_id: e.value ? e.value.id : '',
                                })
                                handleBlur('proveedor_id')
                            }}
                            onSelect={handleProveedorSelect}
                            inputClassName={`bg-gray-50 border text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5`}
                            dropdown
                            forceSelection={false}
                            completeOnFocus
                            style={{ width: '100%' }}
                            panelStyle={{ background: 'white' }}
                            placeholder="Seleccione un proveedor"
                        />
                        <div
                            style={{
                                minHeight: '24px',
                                marginTop: '4px',
                                color: 'red',
                                fontSize: '12px',
                            }}>
                            {touched.proveedor_id &&
                                errors.proveedor_id &&
                                errors.proveedor_id}
                        </div>
                    </div>
                    <div>
                        <Label
                            htmlFor="fecha"
                            className="block mb-2 text-sm font-medium">
                            Fecha
                        </Label>
                        <Input
                            id="fecha"
                            name="fecha"
                            type="date"
                            value={formData.fecha}
                            max={new Date().toISOString().split('T')[0]}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleChange}
                            onBlur={() => handleBlur('fecha')}
                            required
                        />
                        <div
                            style={{
                                minHeight: '24px',
                                marginTop: '4px',
                                color: 'red',
                                fontSize: '12px',
                            }}>
                            {touched.fecha && errors.fecha && errors.fecha}
                        </div>
                    </div>
                    <div>
                        <Label
                            htmlFor="monto_total"
                            className="block mb-2 text-sm font-medium">
                            Monto Total
                        </Label>
                        <Input
                            disabled={editMode}
                            id="monto_total"
                            name="monto_total"
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.monto_total}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleChange}
                            onBlur={() => handleBlur('monto_total')}
                            required
                        />
                        <div
                            style={{
                                minHeight: '24px',
                                marginTop: '4px',
                                color: 'red',
                                fontSize: '12px',
                            }}>
                            {touched.monto_total &&
                                errors.monto_total &&
                                errors.monto_total}
                        </div>
                    </div>
                    <div>
                        <Label
                            htmlFor="monto_abonado"
                            className="block mb-2 text-sm font-medium">
                            Monto Abonado
                        </Label>
                        <Input
                            id="monto_abonado"
                            name="monto_abonado"
                            type="number"
                            value={formData.monto_abonado}
                            min="0"
                            step="0.01"
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleChange}
                            onBlur={() => handleBlur('monto_abonado')}
                            required
                        />
                        <div
                            style={{
                                minHeight: '24px',
                                marginTop: '4px',
                                color: 'red',
                                fontSize: '12px',
                            }}>
                            {touched.monto_abonado &&
                                errors.monto_abonado &&
                                errors.monto_abonado}
                        </div>
                    </div>
                    <div>
                        <Label
                            htmlFor="descripcion"
                            className="block mb-2 text-sm font-medium">
                            Descripción
                        </Label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            value={formData.descripcion}
                            className="border border-gray-300 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            onChange={handleChange}
                            required
                        />
                        <div
                            style={{
                                minHeight: '24px',
                                marginTop: '4px',
                                color: 'red',
                                fontSize: '12px',
                            }}>
                            {touched.descripcion &&
                                errors.descripcion &&
                                errors.descripcion}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end pl-4 mt-4">
                    <Button className="bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                        {editMode ? 'ACTUALIZAR' : 'REGISTRAR'}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default RegisterCompra
