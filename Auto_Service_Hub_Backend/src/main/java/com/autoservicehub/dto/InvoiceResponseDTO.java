package com.autoservicehub.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class InvoiceResponseDTO {
    private Long id;
    private Long jobCardId;
    private String customerName;
    private String vehicleInfo;
    private BigDecimal subtotal;
    private BigDecimal discount;
    private BigDecimal gst;
    private BigDecimal total;
    private String status;
    private LocalDate invoiceDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
