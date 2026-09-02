package com.autoservicehub.service.impl;

import com.autoservicehub.dto.FollowupRequestDTO;
import com.autoservicehub.dto.FollowupResponseDTO;
import com.autoservicehub.entity.Followup;
import com.autoservicehub.exception.ResourceNotFoundException;
import com.autoservicehub.repository.FollowupRepository;
import com.autoservicehub.service.FollowupService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Customer Follow-up & Retention (SRS 4.10)
 * Business rules to enforce here per SRS section 12 (e.g. server-side total
 * recalculation, stock limits, audit trail) before persisting.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class FollowupServiceImpl implements FollowupService {

    private final FollowupRepository repository;

    @Override
    public FollowupResponseDTO create(FollowupRequestDTO request) {
        Followup entity = new Followup();
        // TODO: map request -> entity
        Followup saved = repository.save(entity);
        return toResponse(saved);
    }

    @Override
    public FollowupResponseDTO update(Long id, FollowupRequestDTO request) {
        Followup existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Followup not found: " + id));
        // TODO: map request -> existing
        return toResponse(repository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public FollowupResponseDTO getById(Long id) {
        Followup found = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Followup not found: " + id));
        return toResponse(found);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FollowupResponseDTO> list(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Followup not found: " + id);
        }
        repository.deleteById(id);
    }

    private FollowupResponseDTO toResponse(Followup entity) {
        FollowupResponseDTO dto = new FollowupResponseDTO();
        dto.setId(entity.getId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        // TODO: map remaining fields
        return dto;
    }
}
