package com.autoservicehub.service.impl;

import com.autoservicehub.dto.EstimateRequestDTO;
import com.autoservicehub.dto.EstimateResponseDTO;
import com.autoservicehub.entity.Estimate;
import com.autoservicehub.exception.ResourceNotFoundException;
import com.autoservicehub.repository.EstimateRepository;
import com.autoservicehub.service.EstimateService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Billing - Estimates (SRS 4.9)
 * Business rules to enforce here per SRS section 12 (e.g. server-side total
 * recalculation, stock limits, audit trail) before persisting.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class EstimateServiceImpl implements EstimateService {

    private final EstimateRepository repository;

    @Override
    public EstimateResponseDTO create(EstimateRequestDTO request) {
        Estimate entity = new Estimate();
        // TODO: map request -> entity
        Estimate saved = repository.save(entity);
        return toResponse(saved);
    }

    @Override
    public EstimateResponseDTO update(Long id, EstimateRequestDTO request) {
        Estimate existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estimate not found: " + id));
        // TODO: map request -> existing
        return toResponse(repository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public EstimateResponseDTO getById(Long id) {
        Estimate found = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estimate not found: " + id));
        return toResponse(found);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EstimateResponseDTO> list(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Estimate not found: " + id);
        }
        repository.deleteById(id);
    }

    private EstimateResponseDTO toResponse(Estimate entity) {
        EstimateResponseDTO dto = new EstimateResponseDTO();
        dto.setId(entity.getId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        // TODO: map remaining fields
        return dto;
    }
}
