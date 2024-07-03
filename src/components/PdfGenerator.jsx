'use client'
import React from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const PdfGenerator = ({ htmlContentRef, fileName }) => {
    const generatePdf = async () => {
        const element = htmlContentRef.current
        const canvas = await html2canvas(element, { scale: 2 })
        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF('p', 'pt', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        pdf.save(`${fileName}.pdf`)
    }

    return (
        <button
            onClick={generatePdf}
            className="rounded-lg  px-5 py-2.5 text-sm font-medium  focus:outline-none focus:ring-4 focus:ring-primary-300 ">
            Descargar
        </button>
    )
}

export default PdfGenerator
