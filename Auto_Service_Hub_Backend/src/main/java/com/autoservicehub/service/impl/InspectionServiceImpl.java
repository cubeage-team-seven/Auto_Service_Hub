package com.autoservicehub.service.impl;

import com.autoservicehub.dto.InspectionRequestDTO;
import com.autoservicehub.dto.InspectionResponseDTO;
import com.autoservicehub.entity.Inspection;
import com.autoservicehub.exception.ResourceNotFoundException;
import com.autoservicehub.repository.InspectionRepository;
import com.autoservicehub.service.InspectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Vehicle Inspection (SRS 4.4)
 * Business rules to enforce here per SRS section 12 (e.g. server-side total
 * recalculation, stock limits, audit trail) before persisting.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class InspectionServiceImpl implements InspectionService {

    private final InspectionRepository repository;

    @Override
    public InspectionResponseDTO create(InspectionRequestDTO request) {
        Inspection entity = new Inspection();
        // TODO: map request -> entity
        Inspection saved = repository.save(entity);
        return toResponse(saved);
    }

    @Override
    public InspectionResponseDTO update(Long id, InspectionRequestDTO request) {
        Inspection existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inspection not found: " + id));
        // TODO: map request -> existing
        return toResponse(repository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public InspectionResponseDTO getById(Long id) {
        Inspection found = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inspection not found: " + id));
        return toResponse(found);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InspectionResponseDTO> list(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Inspection not found: " + id);
        }
        repository.deleteById(id);
    }

    private InspectionResponseDTO toResponse(Inspection entity) {
        InspectionResponseDTO dto = new InspectionResponseDTO();
        dto.setId(entity.getId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        // TODO: map remaining fields
        return dto;
    }
}
