import jsPDF from 'jspdf';
import { Voucher, AppSettings } from '../types';

export class VoucherPdfService {
  /**
   * Generate and download a single voucher PDF
   */
  public static generateSingleVoucherPdf(voucher: Voucher, settings: AppSettings) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a6' // A6 is perfect for single voucher cards
    });

    const primaryColor = [20, 83, 45]; // Dark Emerald #14532d
    const accentColor = [22, 163, 74]; // Green #16a34a
    const darkGray = [30, 41, 59];
    const lightBg = [248, 250, 252];

    // Background Card Outer Frame
    doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
    doc.roundedRect(5, 5, 95, 138, 4, 4, 'F');

    // Header Banner
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.roundedRect(5, 5, 95, 28, 4, 4, 'F');
    // Cover bottom rounded corners of header
    doc.rect(5, 25, 95, 8, 'F');

    // Header Text
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(settings.businessName.toUpperCase(), 52.5, 16, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(`WiFi: ${settings.wifiName}`, 52.5, 23, { align: 'center' });

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
    doc.text('INTERNET VOUCHER', 52.5, 38, { align: 'center' });

    // Voucher Code Display Box
    doc.setFillColor(236, 253, 245); // Emerald light bg
    doc.setDrawColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.setLineWidth(0.8);
    doc.roundedRect(12, 43, 81, 20, 3, 3, 'FD');

    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.setFont('courier', 'bold');
    doc.setFontSize(16);
    doc.text(voucher.voucherCode, 52.5, 55, { align: 'center' });

    // Details Grid
    let y = 70;
    const drawRow = (label: string, value: string, isBoldValue = false) => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(label, 14, y);

      doc.setFont('helvetica', isBoldValue ? 'bold' : 'normal');
      doc.setFontSize(10);
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.text(value, 91, y, { align: 'right' });

      // Subtle divider line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.line(14, y + 2, 91, y + 2);

      y += 8;
    };

    drawRow('Package:', voucher.packageName || 'Standard', true);
    drawRow('Price:', `${settings.currency} ${voucher.price}`, true);
    drawRow('Validity:', `${voucher.validityDays} Days`);
    drawRow('Status:', voucher.status);

    if (voucher.userName) {
      drawRow('User:', voucher.userName);
    }
    if (voucher.userMobile) {
      drawRow('Mobile:', voucher.userMobile);
    }
    if (voucher.shopName) {
      drawRow('Shop:', voucher.shopName);
    }

    // Footer
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Support: ${settings.supportPhone} | Generated Offline`, 52.5, 138, { align: 'center' });

    doc.save(`Voucher_${voucher.voucherCode}.pdf`);
  }

  /**
   * Export multiple vouchers in A4 layout (4 vouchers per page)
   */
  public static generateBulkPdf(vouchers: Voucher[], settings: AppSettings, title = 'ROZOB WiFi Vouchers') {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4' // 210mm x 297mm
    });

    const primaryColor = [20, 83, 45];
    const darkGray = [30, 41, 59];

    // Card positions on A4: 2 columns, 2 rows per page = 4 cards per page
    const cardWidth = 92;
    const cardHeight = 125;
    const startX = 10;
    const startY = 22;
    const gapX = 6;
    const gapY = 8;

    const addHeader = (pageNum: number, totalPages: number) => {
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 14, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.text(`${settings.businessName} - ${title.toUpperCase()}`, 10, 9.5);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Vouchers: ${vouchers.length}  |  Page ${pageNum} of ${totalPages}`, 200, 9.5, { align: 'right' });
    };

    const totalPages = Math.ceil(vouchers.length / 4);

    vouchers.forEach((voucher, idx) => {
      const pageIndex = Math.floor(idx / 4);
      const itemOnPage = idx % 4;

      if (itemOnPage === 0) {
        if (pageIndex > 0) doc.addPage();
        addHeader(pageIndex + 1, totalPages);
      }

      const col = itemOnPage % 2;
      const row = Math.floor(itemOnPage / 2);

      const x = startX + col * (cardWidth + gapX);
      const y = startY + row * (cardHeight + gapY);

      // Draw Voucher Card Outer Box
      doc.setFillColor(250, 250, 250);
      doc.setDrawColor(203, 213, 225); // Slatted outline
      doc.setLineWidth(0.4);
      doc.roundedRect(x, y, cardWidth, cardHeight, 3, 3, 'FD');

      // Top Banner
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.roundedRect(x, y, cardWidth, 18, 3, 3, 'F');
      doc.rect(x, y + 14, cardWidth, 4, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(settings.businessName, x + cardWidth / 2, y + 10, { align: 'center' });

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`Portal: ${settings.wifiName}`, x + cardWidth / 2, y + 15, { align: 'center' });

      // Code Container
      doc.setFillColor(236, 253, 245);
      doc.setDrawColor(22, 163, 74);
      doc.setLineWidth(0.6);
      doc.roundedRect(x + 6, y + 22, cardWidth - 12, 16, 2, 2, 'FD');

      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('courier', 'bold');
      doc.setFontSize(13);
      doc.text(voucher.voucherCode, x + cardWidth / 2, y + 32, { align: 'center' });

      // Field details inside card
      let fy = y + 44;
      const printRow = (lbl: string, val: string) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text(lbl, x + 8, fy);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
        doc.text(val, x + cardWidth - 8, fy, { align: 'right' });

        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.2);
        doc.line(x + 8, fy + 1.5, x + cardWidth - 8, fy + 1.5);

        fy += 7;
      };

      printRow('Package:', voucher.packageName);
      printRow('Price:', `${settings.currency} ${voucher.price}`);
      printRow('Validity:', `${voucher.validityDays} Days`);
      printRow('Status:', voucher.status);

      if (voucher.userName) printRow('User:', voucher.userName);
      if (voucher.userMobile) printRow('Mobile:', voucher.userMobile);
      if (voucher.shopName) printRow('Shop:', voucher.shopName);

      // Card footer line
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(`Support: ${settings.supportPhone}`, x + cardWidth / 2, y + cardHeight - 4, { align: 'center' });
    });

    const filename = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(filename);
  }
}
