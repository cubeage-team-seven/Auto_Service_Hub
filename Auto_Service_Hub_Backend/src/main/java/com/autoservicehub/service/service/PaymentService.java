package com.autoservicehub.service;

import com.autoservicehub.dto.PaymentRequestDTO;
import com.autoservicehub.dto.PaymentResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Billing - Payments (SRS 4.9)
 */
public interface PaymentService {

    PaymentResponseDTO create(PaymentRequestDTO request);

    PaymentResponseDTO update(Long id, PaymentRequestDTO request);

    PaymentResponseDTO getById(Long id);

    Page<PaymentResponseDTO> list(Pageable pageable);

    void delete(Long id);
}
