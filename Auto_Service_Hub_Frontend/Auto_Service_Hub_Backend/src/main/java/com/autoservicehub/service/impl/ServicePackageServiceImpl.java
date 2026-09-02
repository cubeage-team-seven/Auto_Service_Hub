package com.autoservicehub.service.impl;

import com.autoservicehub.dto.ServicePackageRequestDTO;
import com.autoservicehub.dto.ServicePackageResponseDTO;
import com.autoservicehub.entity.ServicePackage;
import com.autoservicehub.exception.ResourceNotFoundException;
import com.autoservicehub.repository.ServicePackageRepository;
import com.autoservicehub.service.ServicePackageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Package Management (SRS 4.8)
 * Business rules to enforce here per SRS section 12 (e.g. server-side total
 * recalculation, stock limits, audit trail) before persisting.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ServicePackageServiceImpl implements ServicePackageService {

    private final ServicePackageRepository repository;

    @Override
    public ServicePackageResponseDTO create(ServicePackageRequestDTO request) {
        ServicePackage entity = new ServicePackage();
        // TODO: map request -> entity
        ServicePackage saved = repository.save(entity);
        return toResponse(saved);
    }

    @Override
    public ServicePackageResponseDTO update(Long id, ServicePackageRequestDTO request) {
        ServicePackage existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServicePackage not found: " + id));
        // TODO: map request -> existing
        return toResponse(repository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public ServicePackageResponseDTO getById(Long id) {
        ServicePackage found = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServicePackage not found: " + id));
        return toResponse(found);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServicePackageResponseDTO> list(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("ServicePackage not found: " + id);
        }
        repository.deleteById(id);
    }

    private ServicePackageResponseDTO toResponse(ServicePackage entity) {
        ServicePackageResponseDTO dto = new ServicePackageResponseDTO();
        dto.setId(entity.getId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        // TODO: map remaining fields
        return dto;
    }
}
