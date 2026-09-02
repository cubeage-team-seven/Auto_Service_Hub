package com.autoservicehub.service.impl;

import com.autoservicehub.dto.MechanicRequestDTO;
import com.autoservicehub.dto.MechanicResponseDTO;
import com.autoservicehub.entity.Mechanic;
import com.autoservicehub.exception.ResourceNotFoundException;
import com.autoservicehub.repository.MechanicRepository;
import com.autoservicehub.service.MechanicService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Mechanic Management (SRS 4.6)
 * Business rules to enforce here per SRS section 12 (e.g. server-side total
 * recalculation, stock limits, audit trail) before persisting.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class MechanicServiceImpl implements MechanicService {

    private final MechanicRepository repository;

    @Override
    public MechanicResponseDTO create(MechanicRequestDTO request) {
        Mechanic entity = new Mechanic();
        // TODO: map request -> entity
        Mechanic saved = repository.save(entity);
        return toResponse(saved);
    }

    @Override
    public MechanicResponseDTO update(Long id, MechanicRequestDTO request) {
        Mechanic existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mechanic not found: " + id));
        // TODO: map request -> existing
        return toResponse(repository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public MechanicResponseDTO getById(Long id) {
        Mechanic found = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mechanic not found: " + id));
        return toResponse(found);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MechanicResponseDTO> list(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Mechanic not found: " + id);
        }
        repository.deleteById(id);
    }

    private MechanicResponseDTO toResponse(Mechanic entity) {
        MechanicResponseDTO dto = new MechanicResponseDTO();
        dto.setId(entity.getId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        // TODO: map remaining fields
        return dto;
    }
}
