package com.autoservicehub.service.impl;

import com.autoservicehub.dto.JobCardRequestDTO;
import com.autoservicehub.dto.JobCardResponseDTO;
import com.autoservicehub.entity.JobCard;
import com.autoservicehub.exception.ResourceNotFoundException;
import com.autoservicehub.repository.JobCardRepository;
import com.autoservicehub.service.JobCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Digital Job Card (SRS 4.5)
 * Business rules to enforce here per SRS section 12 (e.g. server-side total
 * recalculation, stock limits, audit trail) before persisting.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class JobCardServiceImpl implements JobCardService {

    private final JobCardRepository repository;

    @Override
    public JobCardResponseDTO create(JobCardRequestDTO request) {
        JobCard entity = new JobCard();
        // TODO: map request -> entity
        JobCard saved = repository.save(entity);
        return toResponse(saved);
    }

    @Override
    public JobCardResponseDTO update(Long id, JobCardRequestDTO request) {
        JobCard existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobCard not found: " + id));
        // TODO: map request -> existing
        return toResponse(repository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public JobCardResponseDTO getById(Long id) {
        JobCard found = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobCard not found: " + id));
        return toResponse(found);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobCardResponseDTO> list(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("JobCard not found: " + id);
        }
        repository.deleteById(id);
    }

    private JobCardResponseDTO toResponse(JobCard entity) {
        JobCardResponseDTO dto = new JobCardResponseDTO();
        dto.setId(entity.getId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        // TODO: map remaining fields
        return dto;
    }
}
