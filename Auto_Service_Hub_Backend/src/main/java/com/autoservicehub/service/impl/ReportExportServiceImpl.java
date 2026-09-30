package com.autoservicehub.service.impl;

import com.autoservicehub.dto.*;
import com.autoservicehub.service.ReportExportService;
import com.autoservicehub.service.ReportService;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

/**
 * PDF and Excel rendering for the reports module (FR-REP-8).
 *
 * <p>The flow is deliberately one-way and single-source:
 *
 * <pre>
 *   filters -> ReportService (the JSON path) -> ExportDocumentDTO -> PDF | Excel
 * </pre>
 *
 * <p>No total, rate or count is recomputed here. {@code buildDocument} only
 * reshapes values the report already computed into labelled rows, so an export
 * cannot disagree with its JSON counterpart. Formatting decisions — how a null
 * prints, how a rate is scaled — are made once, in {@link #cell}, so both output
 * formats render identically too.
 */
@Service
@RequiredArgsConstructor
public class ReportExportServiceImpl implements ReportExportService {

    public static final String CONTENT_TYPE_PDF   = "application/pdf";
    public static final String CONTENT_TYPE_EXCEL =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    private static final DateTimeFormatter STAMP =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /** How a null is written. Blank rather than "null" — absence is not a value. */
    private static final String BLANK = "";

    // Font sizes and weights. OpenPDF dropped the iText 2.x style constants
    // (Font.NORMAL / BOLDSIZE / ITALIC), so the equivalents are spelled out here
    // once rather than as magic numbers scattered through the renderer.
    private static final int FONT_TITLE   = 15;
    private static final int FONT_SECTION = 11;
    private static final int FONT_BOLD    = 9;
    private static final int FONT_BODY    = 9;
    private static final int STYLE_NORMAL = Font.NORMAL;
    private static final int STYLE_BOLD   = Font.BOLD;
    private static final int STYLE_ITALIC = Font.ITALIC;

    private final ReportService reportService;

    @Override
    public ExportFileDTO exportPdf(ExportReportType type, ReportFilterDTO filter) {
        ExportDocumentDTO doc = buildDocument(type, filter);
        return new ExportFileDTO(renderPdf(doc), CONTENT_TYPE_PDF, filename(type, "pdf"));
    }

    @Override
    public ExportFileDTO exportExcel(ExportReportType type, ReportFilterDTO filter) {
        ExportDocumentDTO doc = buildDocument(type, filter);
        return new ExportFileDTO(renderExcel(doc), CONTENT_TYPE_EXCEL, filename(type, "xlsx"));
    }

    // ── Document assembly: calls ReportService, invents nothing ───────────

    /**
     * Fetches the report through {@link ReportService} and reshapes it.
     *
     * <p>The service call is the JSON endpoint's own call, so any validation it
     * performs (reversed range, missing dates) propagates unchanged to an export.
     */
    private ExportDocumentDTO buildDocument(ExportReportType type, ReportFilterDTO filter) {
        ReportFilterDTO f = filter == null ? new ReportFilterDTO() : filter;
        ExportDocumentDTO doc = new ExportDocumentDTO(type.getTitle(), type.getRequirement(),
                describeFilters(f), LocalDateTime.now());

        switch (type) {
            case DAILY_WORKSHOP -> addDailyWorkshop(doc, reportService.getDailyWorkshopReport(f));
            case REVENUE_PAYMENT -> addRevenuePayment(doc, reportService.getRevenuePaymentReport(f));
            case MECHANIC_PERFORMANCE ->
                    addMechanicPerformance(doc, reportService.getMechanicPerformanceReport(f));
            case PARTS_USAGE -> addPartsUsage(doc, reportService.getPartsUsageReport(f));
            case CUSTOMER_GROWTH -> addCustomerGrowth(doc, reportService.getCustomerGrowthReport(f));
            case PROFIT_ANALYSIS -> addProfitAnalysis(doc, reportService.getProfitAnalysisReport(f));
        }

        if (doc.totalRowCount() == 0) {
            doc.addNote("No data matched the applied filters. The report is empty, not failed.");
        }
        return doc;
    }

    private void addDailyWorkshop(ExportDocumentDTO doc, DailyWorkshopReportDTO r) {
        doc.addTable(new ExportTableDTO("Summary", List.of("Metric", "Value"))
                .addRow("Date", cell(r.getDate()))
                .addRow("Total jobs", cell(r.getTotalJobs()))
                .addRow("Completed jobs", cell(r.getCompletedJobs()))
                .addRow("Pending / in-progress jobs", cell(r.getPendingJobs()))
                .addRow("Invoiced amount", cell(r.getInvoicedAmount()))
                .addRow("Collected amount", cell(r.getCollectedAmount())));

        ExportTableDTO breakdown =
                new ExportTableDTO("Status breakdown", List.of("Status", "Jobs"));
        // Insertion order is preserved, so the export matches the report's order.
        for (Map.Entry<String, Long> e : r.getStatusBreakdown().entrySet()) {
            breakdown.addRow(e.getKey(), cell(e.getValue()));
        }
        doc.addTable(breakdown);
        doc.addNote(r.getLimitation());
    }

    private void addRevenuePayment(ExportDocumentDTO doc, RevenuePaymentReportDTO r) {
        doc.addTable(new ExportTableDTO("Summary", List.of("Metric", "Value"))
                .addRow("Period", cell(r.getFrom()) + " to " + cell(r.getTo()))
                .addRow("Invoiced revenue", cell(r.getInvoicedRevenue()))
                .addRow("Invoice count", cell(r.getInvoiceCount()))
                .addRow("Average invoice value", cell(r.getAverageInvoiceValue()))
                .addRow("Collected amount (SUCCESS payments)", cell(r.getCollectedAmount()))
                .addRow("Payment count", cell(r.getPaymentCount()))
                .addRow("Average payment value", cell(r.getAveragePaymentValue()))
                .addRow("Outstanding (invoiced less collected)", cell(r.getOutstandingAmount())));

        ExportTableDTO modes =
                new ExportTableDTO("Payments by mode", List.of("Mode", "Count", "Amount"));
        for (PaymentModeSummaryDTO m : r.getPaymentModes()) {
            modes.addRow(m.getMode(), cell(m.getPaymentCount()), cell(m.getTotal()));
        }
        doc.addTable(modes);

        ExportTableDTO statuses =
                new ExportTableDTO("Invoices by status", List.of("Status", "Count", "Total"));
        for (InvoiceStatusSummaryDTO s : r.getInvoiceStatuses()) {
            statuses.addRow(s.getStatus(), cell(s.getInvoiceCount()), cell(s.getTotal()));
        }
        doc.addTable(statuses);

        ExportTableDTO trend =
                new ExportTableDTO("Revenue by day", List.of("Date", "Invoices", "Total"));
        for (DailyRevenueSummaryDTO d : r.getDailyTrend()) {
            trend.addRow(cell(d.getDate()), cell(d.getInvoiceCount()), cell(d.getTotal()));
        }
        doc.addTable(trend);
    }

    private void addMechanicPerformance(ExportDocumentDTO doc,
                                         List<MechanicPerformanceReportDTO> rows) {
        ExportTableDTO t = new ExportTableDTO("Per mechanic",
                List.of("Mechanic", "Employee code", "Assigned", "Completed", "Open",
                        "Completion rate", "Revenue", "Avg revenue/job", "Avg rating", "Ratings"));
        for (MechanicPerformanceReportDTO m : rows) {
            t.addRow(m.getMechanicName(), m.getEmployeeCode(),
                    cell(m.getAssignedJobs()), cell(m.getCompletedJobs()), cell(m.getOpenJobs()),
                    cell(m.getCompletionRate()), cell(m.getTotalRevenue()),
                    cell(m.getAverageRevenuePerJob()),
                    // Null rating stays null: "not rated" is not "rated zero".
                    m.getAverageCustomerRating() == null ? BLANK : cell(m.getAverageCustomerRating()),
                    cell(m.getRatingCount()));
        }
        doc.addTable(t);

        String unsupported = rows.isEmpty() ? null : rows.get(0).getUnsupportedMetrics();
        doc.addNote(unsupported);
    }

    private void addPartsUsage(ExportDocumentDTO doc, PartsUsageReportDTO r) {
        ExportTableDTO totals = new ExportTableDTO("Summary", List.of("Metric", "Value"))
                .addRow("Period", cell(r.getFrom()) + " to " + cell(r.getTo()))
                .addRow("Distinct parts", cell(r.getDistinctPartCount()))
                .addRow("Total quantity consumed", cell(r.getTotalQuantityConsumed()))
                .addRow("Total estimated cost", cell(r.getTotalEstimatedCost()));

        ExportTableDTO parts = new ExportTableDTO("Parts consumed",
                List.of("SKU", "Part", "Unit", "Quantity", "Movements",
                        "Current purchase price", "Estimated cost"));
        for (PartsUsageRowDTO p : r.getParts()) {
            parts.addRow(p.getSku(), p.getPartName(), p.getUnit(),
                    cell(p.getQuantityConsumed()), cell(p.getMovementCount()),
                    // A part with no recorded price shows blank, never 0.00,
                    // which would read as "free" rather than "unknown".
                    p.getCurrentPurchasePrice() == null ? BLANK : cell(p.getCurrentPurchasePrice()),
                    cell(p.getEstimatedCost()));
        }

        doc.addTable(totals).addTable(parts);
        doc.addNote(r.getMethodology());
    }

    private void addCustomerGrowth(ExportDocumentDTO doc, CustomerGrowthReportDTO r) {
        doc.addTable(new ExportTableDTO("Summary", List.of("Metric", "Value"))
                .addRow("Period", cell(r.getFrom()) + " to " + cell(r.getTo()))
                .addRow("New customers", cell(r.getNewCustomerCount()))
                .addRow("Total customers at end of period", cell(r.getTotalCustomersAtEndOfPeriod()))
                .addRow("Repeat customers", cell(r.getRepeatCustomerCount()))
                .addRow("Customers served in period", cell(r.getCustomersServedInPeriod()))
                .addRow("Jobs in period", cell(r.getJobsInPeriod()))
                .addRow("Repeat rate", r.getRepeatRate() == null ? BLANK : cell(r.getRepeatRate())));
        doc.addNote(r.getNotes());
    }

    private void addProfitAnalysis(ExportDocumentDTO doc, ProfitAnalysisReportDTO r) {
        doc.addTable(new ExportTableDTO("Revenue", List.of("Metric", "Value"))
                .addRow("Period", cell(r.getFrom()) + " to " + cell(r.getTo()))
                .addRow("Invoiced revenue", cell(r.getInvoicedRevenue()))
                .addRow("Invoice count", cell(r.getInvoiceCount()))
                .addRow("Collected amount", cell(r.getCollectedAmount()))
                .addRow("Payment count", cell(r.getPaymentCount()))
                .addRow("Outstanding", cell(r.getOutstandingAmount())));

        doc.addTable(new ExportTableDTO("Cost", List.of("Metric", "Value"))
                .addRow("Estimated parts cost (OUT movements)", cell(r.getPartsCostEstimate()))
                .addRow("Parts consumed quantity", cell(r.getPartsConsumedQuantity())));

        // The conclusion is stated in the export itself, so a downloaded file
        // cannot be read as a profit margin when none was calculated.
        doc.addTable(new ExportTableDTO("Conclusion", List.of("Metric", "Value"))
                .addRow("Profit available", r.isProfitAvailable() ? "yes" : "no")
                .addRow("Gross profit", r.getGrossProfit() == null
                        ? "NOT CALCULATED — see limitations" : cell(r.getGrossProfit())));

        ExportTableDTO limits =
                new ExportTableDTO("Limitations", List.of("#", "Limitation"));
        int i = 1;
        for (String limitation : r.getLimitations()) {
            limits.addRow(cell(i++), limitation);
        }
        doc.addTable(limits);
    }

    // ── PDF rendering ─────────────────────────────────────────────────────

    /**
     * Renders the document with OpenPDF.
     *
     * <p>Helvetica is used rather than a system font: it is one of the fourteen
     * faces PDF requires every reader to supply, so the file renders identically
     * everywhere and needs no font embedding.
     */
    private byte[] renderPdf(ExportDocumentDTO doc) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document pdf = new Document(PageSize.A4, 36, 36, 42, 42);
            PdfWriter.getInstance(pdf, out);
            pdf.open();

            pdf.add(new Paragraph(doc.getTitle(), new Font(STYLE_BOLD, FONT_TITLE, 0)));
            pdf.add(new Paragraph("Requirement: " + doc.getRequirement(),
                    new Font(STYLE_NORMAL, FONT_BODY, 0)));
            pdf.add(new Paragraph("Generated: " + STAMP.format(doc.getGeneratedAt()),
                    new Font(STYLE_NORMAL, FONT_BODY, 0)));
            pdf.add(new Paragraph("Filters: " + doc.getAppliedFilters(), new Font(STYLE_NORMAL, FONT_BODY, 0)));
            pdf.add(Paragraph.getInstance("\n"));

            for (ExportTableDTO table : doc.getTables()) {
                pdf.add(new Paragraph(table.getTitle(), new Font(STYLE_BOLD, FONT_SECTION, 0)));
                if (table.isEmpty()) {
                    pdf.add(new Paragraph("No rows.", new Font(STYLE_ITALIC, FONT_BODY, 0)));
                    pdf.add(Paragraph.getInstance("\n"));
                    continue;
                }
                pdf.add(renderPdfTable(table));
                pdf.add(Paragraph.getInstance("\n"));
            }

            if (!doc.getNotes().isEmpty()) {
                pdf.add(new Paragraph("Notes", new Font(STYLE_BOLD, FONT_SECTION, 0)));
                for (String note : doc.getNotes()) {
                    // "•" plus a space: not all PDF standard fonts carry a bullet.
                    pdf.add(new Paragraph("- " + note, new Font(STYLE_NORMAL, FONT_BODY, 0)));
                }
            }

            pdf.close();
            return out.toByteArray();
        } catch (Exception ex) {
            // Rendering must never surface a raw IO stack trace to the client.
            throw new IllegalStateException("Failed to render PDF export", ex);
        }
    }

    /**
     * Builds the table body with {@link PdfPTable}.
     *
     * <p>PdfPTable is used rather than the older {@code Table} because it is the
     * type that supports percentage widths and per-cell padding, and it inherits
     * from Element so it can be added to the Document directly.
     */
    private PdfPTable renderPdfTable(ExportTableDTO table) {
        int columns = table.getHeaders().size();
        PdfPTable pdfTable = new PdfPTable(columns);
        pdfTable.setWidthPercentage(100);
        pdfTable.setSpacingBefore(4);
        pdfTable.setSpacingAfter(4);
        pdfTable.setHorizontalAlignment(Element.ALIGN_LEFT);
        pdfTable.setWidths(columnWidths(columns));

        for (String header : table.getHeaders()) {
            pdfTable.addCell(new Phrase(header, new Font(STYLE_BOLD, FONT_BOLD, 0)));
        }
        for (List<String> row : table.getRows()) {
            for (String value : row) {
                pdfTable.addCell(new Phrase(value, new Font(STYLE_NORMAL, FONT_BODY, 0)));
            }
        }
        return pdfTable;
    }

    /**
     * Even column widths in relative units, summing to 100.
     *
     * <p>Widths are relative rather than fixed because the usable page width
     * depends on the margins; a fixed total would either overflow or under-fill
     * depending on the page size.
     */
    private float[] columnWidths(int columns) {
        float[] widths = new float[columns];
        float each = 100f / columns;
        for (int i = 0; i < columns; i++) {
            widths[i] = each;
        }
        return widths;
    }

    // ── Excel rendering ───────────────────────────────────────────────────

    /**
     * Renders the document as a single workbook with one sheet per table.
     *
     * <p>Numbers are written as cells, not text, so a user can sum a column in
     * Excel. That is why {@link #cell} formats for display but the row values
     * stay strings: the trade-off is deliberate — the cell text is exactly what
     * the PDF shows, while Excel still gets real, typed cells.
     *
     * <p>Sheet names are sanitised and truncated to Excel's 31-character limit.
     */
    private byte[] renderExcel(ExportDocumentDTO doc) {
        try (XSSFWorkbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            CellStyle metaStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font metaFont = workbook.createFont();
            metaFont.setBold(true);
            metaStyle.setFont(metaFont);

            Sheet info = workbook.createSheet(sheetName("Overview"));
            int r = 0;
            r = writeInfoRow(info, r, metaStyle, "Report", doc.getTitle());
            r = writeInfoRow(info, r, metaStyle, "Requirement", doc.getRequirement());
            r = writeInfoRow(info, r, metaStyle, "Generated", STAMP.format(doc.getGeneratedAt()));
            writeInfoRow(info, r, metaStyle, "Filters applied", doc.getAppliedFilters());

            int noteRow = r + 1;
            int rowCursor = noteRow;
            if (!doc.getNotes().isEmpty()) {
                rowCursor = writeInfoRow(info, rowCursor, metaStyle, "Notes", null);
                for (String note : doc.getNotes()) {
                    rowCursor = writeInfoRow(info, rowCursor, metaStyle, null, note);
                }
            }
            info.setColumnWidth(0, 24 * 256);
            info.setColumnWidth(1, 100 * 256);

            for (ExportTableDTO table : doc.getTables()) {
                Sheet sheet = workbook.createSheet(sheetName(table.getTitle()));

                CellStyle headerStyle = workbook.createCellStyle();
                org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
                headerFont.setBold(true);
                headerStyle.setFont(headerFont);

                Row header = sheet.createRow(0);
                for (int c = 0; c < table.getHeaders().size(); c++) {
                    Cell cell = header.createCell(c);
                    cell.setCellValue(table.getHeaders().get(c));
                    cell.setCellStyle(headerStyle);
                }

                int rowIndex = 1;
                for (List<String> row : table.getRows()) {
                    Row sheetRow = sheet.createRow(rowIndex++);
                    for (int c = 0; c < row.size(); c++) {
                        writeTyped(sheetRow, c, row.get(c));
                    }
                }
                for (int c = 0; c < table.getHeaders().size(); c++) {
                    sheet.setColumnWidth(c, 22 * 256);
                }
                if (table.isEmpty()) {
                    // An empty table still gets a visible, explicit marker row.
                    Row marker = sheet.createRow(1);
                    marker.createCell(0).setCellValue("No rows matched the applied filters.");
                }
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (Exception ex) {
            throw new IllegalStateException("Failed to render Excel export", ex);
        }
    }

    private int writeInfoRow(Sheet sheet, int rowIndex, CellStyle style, String label, String value) {
        Row row = sheet.createRow(rowIndex);
        if (label != null) {
            Cell labelCell = row.createCell(0);
            labelCell.setCellValue(label);
            labelCell.setCellStyle(style);
        }
        if (value != null) {
            row.createCell(1).setCellValue(value);
        }
        return rowIndex + 1;
    }

    /**
     * Writes a value as the type it actually is.
     *
     * <p>Keeping numbers numeric is what makes the export useful in a
     * spreadsheet; anything that is not a clean number falls back to text so no
     * value is silently corrupted into {@code 0}.
     */
    private void writeTyped(Row row, int column, String value) {
        Cell cell = row.createCell(column);
        if (value == null || value.isEmpty()) {
            cell.setBlank();
            return;
        }
        if (value.matches("-?\\d+")) {
            try {
                cell.setCellValue(Long.parseLong(value));
                return;
            } catch (NumberFormatException ignored) {
                // Falls through to text below; a too-large integer stays text.
            }
        }
        if (value.matches("-?\\d*\\.\\d+")) {
            try {
                cell.setCellValue(new BigDecimal(value).doubleValue());
                return;
            } catch (NumberFormatException ignored) {
                // Falls through to text below.
            }
        }
        cell.setCellValue(value);
    }

    /** Sheet names are capped at Excel's 31-character limit and cannot be blank. */
    private String sheetName(String title) {
        String name = title == null ? "Sheet" : title.replaceAll("[\\\\/*?\\[\\]:]", " ").trim();
        if (name.isEmpty()) {
            name = "Sheet";
        }
        return name.length() > 31 ? name.substring(0, 31) : name;
    }

    // ── Shared formatting ──────────────────────────────────────────────────

    /**
     * Renders one value for display, identically in both formats.
     *
     * <p>A null becomes a blank cell rather than the text "null" or a zero: a
     * missing measurement is not a measurement of zero, and printing either would
     * turn "unknown" into a fact. This is the single place that decision is made,
     * so the PDF and the workbook cannot disagree about it.
     */
    private String cell(Object value) {
        if (value == null) {
            return BLANK;
        }
        if (value instanceof BigDecimal decimal) {
            // Plain string, never scientific notation, so a large or
            // small-scale amount stays readable and matches the JSON report.
            return decimal.stripTrailingZeros().toPlainString();
        }
        if (value instanceof Double d) {
            return BigDecimal.valueOf(d).stripTrailingZeros().toPlainString();
        }
        return String.valueOf(value);
    }

    /**
     * Describes the filters actually applied, for the document header.
     *
     * <p>A filter the report supports is never dropped silently: an unset filter
     * is written as "all" so a reader can tell "no filter" apart from "a filter
     * that was quietly discarded".
     */
    private String describeFilters(ReportFilterDTO f) {
        StringBuilder sb = new StringBuilder();
        sb.append("date=").append(f.getDate() == null ? "today" : f.getDate());
        sb.append("; from=").append(f.getFrom() == null ? "-" : f.getFrom());
        sb.append("; to=").append(f.getTo() == null ? "-" : f.getTo());
        sb.append("; mechanicId=").append(f.getMechanicId() == null ? "all" : f.getMechanicId());
        sb.append("; vehicleId=").append(f.getVehicleId() == null ? "all" : f.getVehicleId());
        sb.append("; serviceType=").append(f.getServiceType() == null ? "all" : f.getServiceType());
        sb.append("; status=").append(f.getStatus() == null ? "all" : f.getStatus());
        sb.append("; jobCardId=").append(f.getJobCardId() == null ? "all" : f.getJobCardId());
        return sb.toString();
    }

    /**
     * Builds a safe download filename, e.g. {@code daily-workshop-2026-03-10.pdf}.
     *
     * <p>The report slug is a fixed enum value, so the only caller-controlled part
     * is the date; it is validated and never allowed to contain a path
     * separator, which keeps the header safe from header/filename injection.
     */
    private String filename(ExportReportType type, String extension) {
        String stamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        return type.getSlug() + "-" + stamp + "." + extension;
    }
}
