import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatDate } from './date-utils';
import { COMPANY_CONTACT } from '@/constants/constants';

// Helper to load and convert SVG/Image to base64 PNG for jsPDF
const getLogoBase64 = (url: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = url;
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                // The Crizbe SVG logo has roughly a 2.8:1 ratio
                canvas.width = 600;
                canvas.height = 210;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.drawImage(img, 0, 0, 600, 210);
                    resolve(canvas.toDataURL('image/png'));
                } else {
                    resolve('');
                }
            } catch (e) {
                console.error('Canvas draw failed:', e);
                resolve('');
            }
        };
        img.onerror = (e) => {
            console.error('Logo image load failed:', e);
            resolve('');
        };
    });
};

// Helper to format currency for PDF (replaces ₹ symbol with Rs. for standard Helvetica font support)
const formatCurrencyForPDF = (priceStr: string) => {
    if (!priceStr) return '';
    return priceStr.replace(/₹/g, 'Rs. ');
};

export const generateInvoicePDF = async (order: any, convertPrice: (val: number) => string) => {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    // Page dimensions: 210mm x 297mm
    // Margins: 15mm

    // Theme Colors
    const primaryColor: [number, number, number] = [78, 51, 37]; // #4E3325 (Dark Brown)
    const secondaryColor: [number, number, number] = [196, 153, 74]; // #C4994A (Gold)
    const textColor: [number, number, number] = [51, 51, 51]; // #333333
    const lightGray: [number, number, number] = [238, 238, 238]; // #EEEEEE

    // --- 1. HEADER (Branding & Invoice Title) ---
    // Load and add logo
    const logoBase64 = await getLogoBase64('/images/user/crizbe-logo.svg');

    if (logoBase64) {
        // x: 15, y: 12, width: 35, height: 12.2 (roughly matches SVG ratio)
        doc.addImage(logoBase64, 'PNG', 15, 12, 35, 12.25);
    } else {
        // Fallback to text branding if image fails to load
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(24);
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('Crizbe', 15, 22);

        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
        doc.text('ONCE IN A WHILE LUXURY', 15, 27);
    }

    // Title
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('INVOICE', 140, 25);

    // Invoice Metadata
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(119, 119, 119); // Muted gray

    const invoiceNo = `INV-${order.id.slice(0, 8).toUpperCase()}`;
    const orderDate = formatDate(order.created_at);

    doc.text(`Invoice No: ${invoiceNo}`, 140, 33);
    doc.text(`Date: ${orderDate}`, 140, 39);

    // Divider line
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setLineWidth(0.5);
    doc.line(15, 48, 195, 48);

    // --- 2. BILLING DETAILS (Two-column layout) ---
    // Column 1: Billed By (Company Details)
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Billed By:', 15, 56);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    const companyLines = [
        COMPANY_CONTACT.name,
        COMPANY_CONTACT.door,
        COMPANY_CONTACT.junction,
        COMPANY_CONTACT.location,
        `Phone: ${COMPANY_CONTACT.phone}`,
        `Email: ${COMPANY_CONTACT.email}`,
    ];

    let yCompany = 62;
    companyLines.forEach((line) => {
        doc.text(line, 15, yCompany);
        yCompany += 5;
    });

    // Column 2: Billed To (Customer Details)
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Billed To:', 110, 56);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    const customerName =
        `${order.first_name || ''} ${order.last_name || ''}`.trim() || 'Valued Customer';

    const streetAddress = [order.address_line1, order.street, order.landmark]
        .filter(Boolean)
        .join(', ');
    const cityAddress = [order.city, order.state, order.country].filter(Boolean).join(', ');
    const zipCode = order.zip_code ? `PIN: ${order.zip_code}` : '';

    const customerLines = [
        customerName,
        streetAddress,
        cityAddress,
        zipCode,
        order.phone_number ? `Phone: ${order.phone_number}` : '',
    ].filter(Boolean);

    let yCustomer = 62;
    customerLines.forEach((line) => {
        const splitLine = doc.splitTextToSize(line, 85);
        splitLine.forEach((subLine: string) => {
            doc.text(subLine, 110, yCustomer);
            yCustomer += 5;
        });
    });

    const nextYStart = Math.max(yCompany, yCustomer) + 8;

    // --- 3. ITEMS TABLE ---
    const tableHeaders = [['#', 'Item Details', 'Size / Weight', 'Qty', 'Unit Price', 'Total']];

    const tableRows = order.items.map((item: any, index: number) => {
        const itemPrice = Number(item.price || 0);
        const itemQty = Number(item.quantity || 1);
        const itemTotal = item.subtotal || itemPrice * itemQty;

        return [
            index + 1,
            item.product_name,
            item.variant_size || 'N/A',
            itemQty.toString().padStart(2, '0'),
            formatCurrencyForPDF(convertPrice(itemPrice)),
            formatCurrencyForPDF(convertPrice(itemTotal)),
        ];
    });

    autoTable(doc, {
        startY: nextYStart,
        head: tableHeaders,
        body: tableRows,
        theme: 'striped',
        headStyles: {
            fillColor: [78, 51, 37], // #4E3325
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold',
        },
        bodyStyles: {
            fontSize: 9,
            textColor: textColor,
        },
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 30 },
            3: { cellWidth: 15 },
            4: { cellWidth: 25 },
            5: { cellWidth: 25 },
        },
        styles: {
            font: 'Helvetica',
            cellPadding: 3,
        },
        didParseCell: (data) => {
            if (data.column.index === 0 || data.column.index === 3) {
                data.cell.styles.halign = 'center';
            } else if (data.column.index === 4 || data.column.index === 5) {
                data.cell.styles.halign = 'right';
            }
        },
    });

    // --- 4. SUMMARY SECTION (Below table) ---
    const finalY = (doc as any).lastAutoTable.finalY || nextYStart + 20;

    // Box for totals
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setFillColor(250, 248, 244); // Very light cream
    doc.rect(120, finalY + 5, 75, 38, 'DF');

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

    const subtotal = order.items.reduce((acc: number, item: any) => {
        const itemPrice = Number(item.price || 0);
        const itemQty = Number(item.quantity || 1);
        return acc + (item.subtotal || itemPrice * itemQty);
    }, 0);

    doc.text('Subtotal:', 125, finalY + 12);
    doc.text(formatCurrencyForPDF(convertPrice(subtotal)), 190, finalY + 12, { align: 'right' });

    doc.text('Shipping:', 125, finalY + 18);
    doc.text(formatCurrencyForPDF(convertPrice(order.shipping_fee || 0)), 190, finalY + 18, {
        align: 'right',
    });

    doc.text('Tax:', 125, finalY + 24);
    doc.text(formatCurrencyForPDF(convertPrice(order.total_tax || 0)), 190, finalY + 24, {
        align: 'right',
    });

    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.line(125, finalY + 28, 190, finalY + 28);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Total Paid:', 125, finalY + 34);
    doc.text(
        formatCurrencyForPDF(convertPrice(order.total_amount || order.total || subtotal)),
        190,
        finalY + 34,
        {
            align: 'right',
        }
    );

    // --- 5. FOOTER & TERMS ---
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text('Payment Information', 15, finalY + 12);

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(119, 119, 119);
    doc.text(`Method: ${order.payment_method || 'Razorpay'}`, 15, 17 + finalY);
    doc.text(
        `Status: ${order.payment_status === 'Paid' || (order.payment_method && order.payment_method.toUpperCase() !== 'COD') ? 'Paid' : 'Pending'}`,
        15,
        22 + finalY
    );
    if (order.transaction_id) {
        doc.text(`Transaction ID: ${order.transaction_id}`, 15, 27 + finalY);
    }

    // Bottom greeting
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(9);
    doc.setTextColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
    doc.text('Thank you for shopping with Crizbe!', 105, 280, { align: 'center' });

    doc.save(`Invoice_${invoiceNo}.pdf`);
};
