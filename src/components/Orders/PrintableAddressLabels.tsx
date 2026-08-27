'use client';

import React from 'react';

interface PrintableAddressLabelsProps {
    orders: any[];
}

export default function PrintableAddressLabels({ orders }: PrintableAddressLabelsProps) {
    if (!orders || orders.length === 0) return null;

    return (
        <div className="printable-address-labels hidden print:block bg-white text-[#4E3325] font-sans">
            <style jsx global>{`
                .printable-address-labels {
                    display: none;
                }
                @media print {
                    @page {
                        size: 4in 6in;
                        margin: 0;
                    }
                    html,
                    body {
                        background: white !important;
                        color: #4e3325 !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        width: 4in !important;
                        height: 6in !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    /* Hide website layout during print */
                    body * {
                        visibility: hidden;
                    }
                    /* Show ONLY the printable address labels container and its children */
                    .printable-address-labels,
                    .printable-address-labels * {
                        visibility: visible !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .printable-address-labels {
                        display: block !important;
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 4in !important;
                        margin: 0 !important;
                        padding: 0 !important;
                        z-index: 99999 !important;
                    }
                    .print-card {
                        width: 4in !important;
                        height: 6in !important;
                        max-height: 6in !important;
                        padding: 0.2in !important;
                        box-sizing: border-box !important;
                        page-break-after: always !important;
                        break-after: page !important;
                        display: flex !important;
                        flex-direction: column !important;
                        justify-content: space-between !important;
                        border: 2px solid #4e3325 !important;
                        background: white !important;
                        font-family:
                            -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif !important;
                    }
                    .print-card:last-child {
                        page-break-after: avoid !important;
                        break-after: avoid !important;
                    }
                }
            `}</style>

            {orders.map((order, idx) => {
                const addressObj = order.shipping_address || order.address || {};

                // Address fields on Order model in backend
                const firstName =
                    order.first_name ||
                    addressObj.first_name ||
                    order.user_details?.first_name ||
                    order.user_detail?.first_name ||
                    '';
                const lastName =
                    order.last_name ||
                    addressObj.last_name ||
                    order.user_details?.last_name ||
                    order.user_detail?.last_name ||
                    '';
                const fullName =
                    `${firstName} ${lastName}`.trim() ||
                    order.user_details?.name ||
                    order.customer_name ||
                    'Valued Customer';

                const phone =
                    order.phone_number ||
                    addressObj.phone_number ||
                    order.user_details?.phone_number ||
                    'N/A';

                const addressLine1 = order.address_line1 || addressObj.address_line1 || '';
                const street = order.street || addressObj.street || '';
                const landmark = order.landmark || addressObj.landmark || '';
                const city = order.city || addressObj.city || '';
                const state = order.state || addressObj.state_name || addressObj.state || '';
                const zipCode = order.zip_code || addressObj.zip_code || '';
                const country =
                    order.country || addressObj.country_name || addressObj.country || 'India';

                const isCod = (order.payment_method || '').toUpperCase() === 'COD';
                const orderIdShort = (order.id || '').split('-')[0].toUpperCase();

                const fullStreetLine = [addressLine1, street].filter(Boolean).join(', ');
                const cityStateZip =
                    [city, state].filter(Boolean).join(', ') + (zipCode ? ` - ${zipCode}` : '');

                const itemsList =
                    (Array.isArray(order.items) && order.items.length > 0 ? order.items : null) ||
                    (Array.isArray(order.order_items) && order.order_items.length > 0
                        ? order.order_items
                        : null) ||
                    (Array.isArray(order.order_details) && order.order_details.length > 0
                        ? order.order_details
                        : null) ||
                    [];

                const totalAmount = Number(order.total_amount || order.total || 0);
                const discountAmount = Number(order.discount_amount || order.discount || 0);
                const shippingCharge = Number(order.shipping_charge || order.shipping_fee || 0);

                return (
                    <div
                        key={order.id || idx}
                        className="print-card border-2 border-[#4E3325] p-3.5 mb-4 bg-white text-[#4E3325]"
                    >
                        <div>
                            {/* Brand Header */}
                            <div className="flex items-center justify-between border-b-2 border-[#4E3325] pb-1.5 mb-2">
                                <div>
                                    <img
                                        src="/images/user/crizbe-logo.svg"
                                        alt="CRIZBE"
                                        className="h-7 w-auto object-contain mb-0.5"
                                    />
                                    <p className="text-[8px] font-black tracking-widest text-[#9A7236] uppercase">
                                        LUXURY CONFECTIONERY OPS
                                    </p>
                                </div>
                                <div className="text-right">
                                    <h2 className="text-xs font-black tracking-wider uppercase text-[#4E3325]">
                                        ORDER #{orderIdShort}
                                    </h2>
                                    <p className="text-[9px] font-bold text-[#9A7236]">
                                        DATE:{' '}
                                        {order.created_at
                                            ? new Date(order.created_at).toLocaleDateString(
                                                  'en-US',
                                                  {
                                                      month: 'short',
                                                      day: 'numeric',
                                                      year: 'numeric',
                                                  }
                                              )
                                            : ''}
                                    </p>
                                </div>
                            </div>

                            {/* Recipient Shipping Address Grid Box */}
                            <div className="border-2 border-[#4E3325] rounded-lg overflow-hidden mb-2">
                                <div className="bg-[#4E3325] text-white px-2.5 py-0.5 flex items-center justify-between">
                                    <span className="text-[8.5px] font-black uppercase tracking-widest text-[#E8BF7A]">
                                        SHIP TO:
                                    </span>
                                    <span className="text-[8px] font-black uppercase bg-[#E8BF7A] text-[#4E3325] px-1.5 py-0.5 rounded">
                                        {order.address_type || 'HOME'}
                                    </span>
                                </div>
                                <div className="p-2 bg-[#FAF4E6]/40">
                                    <h3 className="text-sm font-black text-[#4E3325] leading-tight mb-0.5 uppercase tracking-tight">
                                        {fullName}
                                    </h3>
                                    <p className="text-[11px] font-semibold leading-snug text-[#333333]">
                                        {fullStreetLine || 'Street Address N/A'}
                                        {landmark ? (
                                            <>
                                                <br />
                                                <span className="text-[#9A7236] font-bold">
                                                    Landmark:
                                                </span>{' '}
                                                {landmark}
                                            </>
                                        ) : null}
                                        <br />
                                        <span className="font-extrabold text-[#4E3325]">
                                            {cityStateZip}
                                        </span>
                                        <br />
                                        <span className="font-bold text-[#4E3325]">{country}</span>
                                    </p>
                                    <div className="mt-1 pt-1 border-t border-[#4E3325]/20 flex items-center justify-between">
                                        <p className="text-[11px] font-black text-[#4E3325]">
                                            📞 TEL: {phone}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Package Items & Detailed Price Breakdown Table */}
                            <div className="border-2 border-[#4E3325] rounded-lg overflow-hidden mb-2">
                                <div className="bg-[#4E3325] text-[#E8BF7A] px-2.5 py-0.5 flex items-center justify-between text-[8.5px] font-black uppercase tracking-widest">
                                    <span>PACKAGE CONTENTS ({itemsList.length} ITEMS):</span>
                                    <span>TOTAL: ₹{totalAmount.toFixed(2)}</span>
                                </div>
                                <table className="w-full text-xs text-left border-collapse bg-white">
                                    <thead>
                                        <tr className="border-b-2 border-[#4E3325] text-[8.5px] font-black uppercase bg-[#FAF4E6] text-[#4E3325]">
                                            <th className="py-1 px-2">Item Description</th>
                                            <th className="py-1 px-1.5 text-right w-16 border-l border-[#4E3325]">
                                                Price
                                            </th>
                                            <th className="py-1 px-1 text-center w-8 border-l border-[#4E3325]">
                                                Qty
                                            </th>
                                            <th className="py-1 px-1.5 text-right w-16 border-l border-[#4E3325]">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {itemsList.length > 0 ? (
                                            itemsList.map((item: any, i: number) => {
                                                const itemPrice = Number(
                                                    item.price || item.unit_price || 0
                                                );
                                                const itemQty = Number(
                                                    item.quantity || item.qty || 1
                                                );
                                                const itemSubtotal = Number(
                                                    item.subtotal ||
                                                        item.total_price ||
                                                        itemPrice * itemQty
                                                );
                                                const itemName =
                                                    item.product_title ||
                                                    item.product_name ||
                                                    item.name ||
                                                    'Crizbe Confectionery';
                                                const itemVariant = [
                                                    item.variant_name,
                                                    item.variant_size || item.variant,
                                                ]
                                                    .filter(Boolean)
                                                    .join(' - ');

                                                return (
                                                    <tr
                                                        key={i}
                                                        className="border-b border-[#4E3325]/20"
                                                    >
                                                        <td className="py-1 px-2 font-bold text-[10px] text-[#333333]">
                                                            {itemName}
                                                            {itemVariant ? (
                                                                <span className="text-[8.5px] text-[#666] font-medium block">
                                                                    {itemVariant}
                                                                </span>
                                                            ) : null}
                                                        </td>
                                                        <td className="py-1 px-1.5 text-right font-semibold text-[9.5px] text-[#4E3325] border-l border-[#4E3325]/20">
                                                            {itemPrice > 0
                                                                ? `₹${itemPrice.toFixed(2)}`
                                                                : '-'}
                                                        </td>
                                                        <td className="py-1 px-1 text-center font-black text-[10px] text-[#4E3325] border-l border-[#4E3325]/20">
                                                            x{itemQty}
                                                        </td>
                                                        <td className="py-1 px-1.5 text-right font-bold text-[9.5px] text-[#4E3325] border-l border-[#4E3325]/20">
                                                            {itemSubtotal > 0
                                                                ? `₹${itemSubtotal.toFixed(2)}`
                                                                : '-'}
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr className="border-b border-[#4E3325]/20">
                                                <td
                                                    colSpan={4}
                                                    className="py-1.5 px-2 text-center text-[9.5px] font-semibold text-gray-600 italic"
                                                >
                                                    Order Manifest (Total: ₹{totalAmount.toFixed(2)})
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Price Summary Bar */}
                                <div className="bg-[#FAF4E6] px-2.5 py-1 border-t border-[#4E3325] text-[9px] text-[#4E3325] space-y-0.5 font-bold">
                                    <div className="flex justify-between">
                                        <span>Payment Method & Status:</span>
                                        <span className="font-extrabold uppercase">
                                            {order.payment_method || 'Online'} (
                                            {order.payment_status || 'Paid'})
                                        </span>
                                    </div>
                                    {discountAmount > 0 && (
                                        <div className="flex justify-between text-emerald-800">
                                            <span>Discount Applied:</span>
                                            <span>-₹{discountAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    {shippingCharge > 0 && (
                                        <div className="flex justify-between">
                                            <span>Shipping Charge:</span>
                                            <span>₹{shippingCharge.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between border-t border-[#4E3325]/30 pt-0.5 text-[9.5px] font-black text-[#4E3325]">
                                        <span>GRAND TOTAL:</span>
                                        <span className="text-[10px]">
                                            ₹{totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Crizbe Brand Payment Method Badge */}
                        <div className="border-2 border-[#4E3325] rounded-lg p-2 text-center bg-[#4E3325] text-white">
                            <p className="text-[9.5px] font-black uppercase tracking-widest mb-0.5 text-[#E8BF7A]">
                                {isCod ? '⚠️ CASH ON DELIVERY (COD)' : '✅ PREPAID ORDER'}
                            </p>
                            <p className="text-sm font-black text-white">
                                {isCod
                                    ? `COLLECT CASH: ₹${totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                    : 'DO NOT COLLECT CASH'}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
