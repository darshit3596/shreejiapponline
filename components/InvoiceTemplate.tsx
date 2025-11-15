import React from 'react';
import type { Invoice } from '../types';

interface InvoiceTemplateProps {
    invoice: Invoice;
}

const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ invoice }) => {
    const amountToWords = (amount: number): string => {
        const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const numToWords = (num: number): string => {
            if (num === 0) return '';
            if (num < 20) return ones[num];
            const digit = num % 10;
            return tens[Math.floor(num / 10)] + (digit ? ' ' + ones[digit] : '');
        };
        
        const inWords = (num: number): string => {
            if (num === 0) return '';
            let words = '';
            if (num >= 10000000) {
                words += inWords(Math.floor(num / 10000000)) + ' Crore ';
                num %= 10000000;
            }
            if (num >= 100000) {
                words += inWords(Math.floor(num / 100000)) + ' Lakh ';
                num %= 100000;
            }
            if (num >= 1000) {
                words += inWords(Math.floor(num / 1000)) + ' Thousand ';
                num %= 1000;
            }
            if (num >= 100) {
                words += inWords(Math.floor(num / 100)) + ' Hundred ';
                num %= 100;
            }
            if (num > 0) {
                if (words !== '') words += 'and ';
                words += numToWords(num);
            }
            return words.trim();
        }
        
        const integerPart = Math.floor(amount);
        if (integerPart === 0) return 'Zero Rupees Only.';

        const words = inWords(integerPart);
        return words.charAt(0).toUpperCase() + words.slice(1) + ' Rupees Only.';
    };

    const totalWords = amountToWords(invoice.total);
    const formattedDate = invoice.date.split('-').reverse().join('-');

    const renderItems = () => {
        const allItems = [...invoice.items];
        const rows = [];
        const minRows = 9;
        
        for (let i = 0; i < Math.max(minRows, allItems.length); i++) {
            const item = allItems[i];
            rows.push(
                <tr key={i} className="h-9 align-top">
                    <td className="border-r-2 border-black p-2 text-center text-lg" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{item ? i + 1 : ''}</td>
                    
                    <td className="border-r-2 border-black p-2 text-lg" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{item?.description || ''}</td>
                   
                    <td className="border-r-2 border-black p-2 text-center text-lg" style={{ fontFamily: "'Times New Roman', Times, serif" }} >{item?.qty || ''}</td>
                   
                    <td className="border-r-2 border-black p-2 text-center text-lg" style={{ fontFamily: "'Times New Roman', Times, serif" }} >{item ? item.rate.toFixed(2) : ''}</td>
                   
                    <td className="p-2 text-center text-lg" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{item ? (item.qty * item.rate).toFixed(2) : ''}</td>
                </tr>
            );
        }
        return rows;
    };
    
    return (
        <div className="p-6 bg-white font-serif text-black text-sm ">
            <div className="border-2 border-black p-2 m-2">
                <header className="text-center border-b-2 border-black pb-4 mb-4">
                    <h1 className="text-4xl font-bold tracking-widest mt-6 " style={{ fontFamily: "'Times New Roman', Times, serif" }}>SHREEJI MOTERS</h1>
                    <h2 className="text-lg font-bold mt-1 ">TYRES SALES & SERVICE</h2>
                    <p className="mt-2" style={{ fontFamily: "'Times New Roman', Times, serif" }}>Near Sorath tyres, Veraval Road, Keshod-362220, Mo.9904641233</p>
                </header>

                <div className=" text-2xl text-center border-b-2 border-black font-bold pb-2 mb-4" style={{ fontFamily: "'Times New Roman', Times, serif" }}>
                    Sales Invoice
                </div>
                
                <div className="flex justify-between border-b-2 border-black p-2 text-xs">
                    <div className="w-3/5 m-3 " >
                       
                        <div className="flex mb-2" ><span className="w-28 font-bold text-base">Name :</span><span className="w-100 font-bold text-base">{invoice.customerName}</span></div>
                        
                        <div className="flex mb-2"><span className="w-28 font-bold text-base">Vehicle :</span><span className="w-24 font-bold text-base " style={{ fontFamily: "'Times New Roman', Times, serif" }} >{invoice.vehicle}</span></div>
                        
                        <div className="flex mb-2"><span className="w-28 font-bold text-base">Vehicle No:</span><span className="w-24 font-bold uppercase text-base" style={{ fontFamily: "'Times New Roman', Times, serif" }} >{invoice.vehicleNo}</span></div>
                        
                        <div className="flex"><span className="w-28 font-bold text-base">Mobile No:</span><span className="w-24 font-bold text-base" style={{ fontFamily: "'Times New Roman', Times, serif" }}>{invoice.mobileNo}</span></div>
                    </div>
                    <div className="w-2/5 m-3">
                        <div className="flex mb-2"><span className="w-28 font-bold text-base">K.M :</span><span className="w-26 font-bold text-base" style={{ fontFamily: "'Times New Roman', Times, serif" }} >{invoice.km}</span></div>

                        <div className="flex mb-2"><span className="w-28 font-bold text-base">Invoice No:</span><span className="w-26 font-bold text-base" style={{ fontFamily: "'Times New Roman', Times, serif" }} >{invoice.invoiceNumber}</span></div>

                        <div className="flex"><span className="w-28 font-bold text-base">Date :</span><span className="w-26 font-bold text-base" style={{ fontFamily: "'Times New Roman', Times, serif" }} >{formattedDate}</span></div>
                    </div>
                </div>

                <table className="w-full border-collapse ">
                    <thead>
                        <tr className="border-b-2 border-black m-3">
                            <th className=" text-xl w-12 border-r-2 border-black p-2 text-center font-bold">No.</th>
                            <th className="text-xl border-r-2 border-black p-2 text-center font-bold ">Description Of Goods</th>
                            <th className="text-xl w-20 border-r-2 border-black p-2 text-center font-bold">Qty.</th>
                            <th className="text-xl w-24 border-r-2 border-black p-2 text-center font-bold">Rate</th>
                            <th className="text-xl w-28 p-1 text-center font-bold" >Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderItems()}
                    </tbody>
                     <tfoot className="border-t-2 border-black">
                        <tr>
                            <td colSpan={3} className="border-r-2 border-black p-1">
                                {/* Empty space */}
                                 <p className="font-bold m-1 text-lg">   Amount in Words :   {totalWords}</p>
                               
                            </td>
                            <td className="border-r-2 border-black p-1 text-center font-bold text-lg">Total</td>
                            <td className="p-1  font-bold text-center text-xl" style={{ fontFamily: "'Times New Roman', Times, serif" }} >{invoice.total.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
                
                <div className="flex border-t-2 border-black text-xs">
                    <div className="w-3/4 border-r-2 border-black  m-2 space-y-1 " style={{ fontFamily: "'Times New Roman', Times, serif" }} >
                        <p  className="pb-2" >(1) ટાયર માં કંપની મેન્યુફેક્ચરીંગ ખામીની જવાબદારી કંપની ની રહેશે.</p>
                        <p  className="pb-2">(2) ક્લેમમાં મોકલેલ ટયુબ-ટાયર નો ખર્ચ તથા ઘસારો ગ્રાહકે આપવાનો રહેશે.</p>
                        <p  className="pb-2">(3) ટયુબ-ટાયર ક્લેમમાં મોકલ્યા બાદ કંપનીનો નિર્ણય ગ્રાહકે માન્ય રાખવાનો રહેશે.</p>
                    </div>
                    <div className="w-1/4 p-4 text-center flex flex-col justify-between">
                        <div>&nbsp;</div>
                        <div>
                            <p className="font-bold">For, Shreeji Moters</p>
                            <p>(Authorised Signatory)</p>
                        </div>
                    </div>
                </div>
                
                <footer className="border-t-2 border-black text-center p-2">
                    <p className="font-bold">Thank you ! Visit again</p>
                    <p className="text-xs">© 2025-2026 Darshit Sapariya Solutions. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default InvoiceTemplate;