'use client'
import React from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'

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
            className="absolute top-10 right-20 m-2 text-black">
            <FontAwesomeIcon icon={faDownload} size="2x" />
        </button>
    )
}

export default PdfGenerator
