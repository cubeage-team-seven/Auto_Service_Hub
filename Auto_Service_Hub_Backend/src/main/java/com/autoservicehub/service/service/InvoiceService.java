package com.autoservicehub.service;

import com.autoservicehub.dto.InvoiceRequestDTO;
import com.autoservicehub.dto.InvoiceResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Billing - Invoices (SRS 4.9)
 */
public interface InvoiceService {

    InvoiceResponseDTO create(InvoiceRequestDTO request);

    InvoiceResponseDTO update(Long id, InvoiceRequestDTO request);

    InvoiceResponseDTO getById(Long id);

    Page<InvoiceResponseDTO> list(Pageable pageable);

    void delete(Long id);
}
