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

@Service
@RequiredArgsConstructor
@Transactional
public class ServicePackageServiceImpl implements ServicePackageService {

    private final ServicePackageRepository repository;

    @Override
    public ServicePackageResponseDTO create(ServicePackageRequestDTO request) {
        ServicePackage entity = new ServicePackage();
        mapToEntity(request, entity);
        return toResponse(repository.save(entity));
    }

    @Override
    public ServicePackageResponseDTO update(Long id, ServicePackageRequestDTO request) {
        ServicePackage existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServicePackage not found: " + id));
        mapToEntity(request, existing);
        return toResponse(repository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public ServicePackageResponseDTO getById(Long id) {
        return toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("ServicePackage not found: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ServicePackageResponseDTO> list(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("ServicePackage not found: " + id);
        repository.deleteById(id);
    }

    private void mapToEntity(ServicePackageRequestDTO r, ServicePackage e) {
        e.setName(r.getName());
        e.setType(r.getType());
        e.setPrice(r.getPrice());
        e.setActive(r.getActive() != null ? r.getActive() : true);
    }

    private ServicePackageResponseDTO toResponse(ServicePackage e) {
        ServicePackageResponseDTO dto = new ServicePackageResponseDTO();
        dto.setId(e.getId());
        dto.setName(e.getName());
        dto.setType(e.getType());
        dto.setPrice(e.getPrice());
        dto.setActive(e.getActive());
        dto.setCreatedAt(e.getCreatedAt());
        dto.setUpdatedAt(e.getUpdatedAt());
        return dto;
    }
}
