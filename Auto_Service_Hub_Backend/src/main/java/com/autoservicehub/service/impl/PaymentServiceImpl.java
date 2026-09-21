package com.autoservicehub.service.impl;

import com.autoservicehub.dto.PaymentRequestDTO;
import com.autoservicehub.dto.PaymentResponseDTO;
import com.autoservicehub.entity.Payment;
import com.autoservicehub.exception.ResourceNotFoundException;
import com.autoservicehub.repository.PaymentRepository;
import com.autoservicehub.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Billing - Payments (SRS 4.9)
 * Business rules to enforce here per SRS section 12 (e.g. server-side total
 * recalculation, stock limits, audit trail) before persisting.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository repository;

    @Override
    public PaymentResponseDTO create(PaymentRequestDTO request) {
        Payment entity = new Payment();
        // TODO: map request -> entity
        Payment saved = repository.save(entity);
        return toResponse(saved);
    }

    @Override
    public PaymentResponseDTO update(Long id, PaymentRequestDTO request) {
        Payment existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + id));
        // TODO: map request -> existing
        return toResponse(repository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public PaymentResponseDTO getById(Long id) {
        Payment found = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + id));
        return toResponse(found);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PaymentResponseDTO> list(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Payment not found: " + id);
        }
        repository.deleteById(id);
    }

    private PaymentResponseDTO toResponse(Payment entity) {
        PaymentResponseDTO dto = new PaymentResponseDTO();
        dto.setId(entity.getId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        // TODO: map remaining fields
        return dto;
    }
}
