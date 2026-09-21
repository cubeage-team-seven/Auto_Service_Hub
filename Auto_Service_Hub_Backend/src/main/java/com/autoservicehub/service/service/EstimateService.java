package com.autoservicehub.service;

import com.autoservicehub.dto.EstimateRequestDTO;
import com.autoservicehub.dto.EstimateResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Billing - Estimates (SRS 4.9)
 */
public interface EstimateService {

    EstimateResponseDTO create(EstimateRequestDTO request);

    EstimateResponseDTO update(Long id, EstimateRequestDTO request);

    EstimateResponseDTO getById(Long id);

    Page<EstimateResponseDTO> list(Pageable pageable);

    void delete(Long id);
}
