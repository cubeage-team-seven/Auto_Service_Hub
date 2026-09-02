package com.autoservicehub.service.impl;

import com.autoservicehub.dto.PartRequestDTO;
import com.autoservicehub.dto.PartResponseDTO;
import com.autoservicehub.entity.Part;
import com.autoservicehub.exception.ResourceNotFoundException;
import com.autoservicehub.repository.PartRepository;
import com.autoservicehub.service.PartService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Spare Parts Inventory (SRS 4.7)
 * Business rules to enforce here per SRS section 12 (e.g. server-side total
 * recalculation, stock limits, audit trail) before persisting.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class PartServiceImpl implements PartService {

    private final PartRepository repository;

    @Override
    public PartResponseDTO create(PartRequestDTO request) {
        Part entity = new Part();
        // TODO: map request -> entity
        Part saved = repository.save(entity);
        return toResponse(saved);
    }

    @Override
    public PartResponseDTO update(Long id, PartRequestDTO request) {
        Part existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found: " + id));
        // TODO: map request -> existing
        return toResponse(repository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public PartResponseDTO getById(Long id) {
        Part found = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found: " + id));
        return toResponse(found);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PartResponseDTO> list(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Part not found: " + id);
        }
        repository.deleteById(id);
    }

    private PartResponseDTO toResponse(Part entity) {
        PartResponseDTO dto = new PartResponseDTO();
        dto.setId(entity.getId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        // TODO: map remaining fields
        return dto;
    }
}
