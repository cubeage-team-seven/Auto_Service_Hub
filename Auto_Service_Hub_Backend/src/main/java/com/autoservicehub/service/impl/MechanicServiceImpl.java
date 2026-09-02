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

@Service
@RequiredArgsConstructor
@Transactional
public class MechanicServiceImpl implements MechanicService {

    private final MechanicRepository repository;

    @Override
    public MechanicResponseDTO create(MechanicRequestDTO request) {
        Mechanic entity = new Mechanic();
        mapToEntity(request, entity);
        return toResponse(repository.save(entity));
    }

    @Override
    public MechanicResponseDTO update(Long id, MechanicRequestDTO request) {
        Mechanic existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mechanic not found: " + id));
        mapToEntity(request, existing);
        return toResponse(repository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public MechanicResponseDTO getById(Long id) {
        return toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mechanic not found: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<MechanicResponseDTO> list(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Mechanic not found: " + id);
        repository.deleteById(id);
    }

    private void mapToEntity(MechanicRequestDTO r, Mechanic e) {
        e.setName(r.getName());
        e.setEmployeeCode(r.getEmployeeCode());
        e.setPhone(r.getPhone());
        e.setExperienceYears(r.getExperienceYears());
        e.setStatus(r.getStatus() != null ? r.getStatus() : "ACTIVE");
    }

    private MechanicResponseDTO toResponse(Mechanic e) {
        MechanicResponseDTO dto = new MechanicResponseDTO();
        dto.setId(e.getId());
        dto.setEmployeeCode(e.getEmployeeCode());
        dto.setName(e.getName());
        dto.setPhone(e.getPhone());
        dto.setExperienceYears(e.getExperienceYears());
        dto.setStatus(e.getStatus());
        dto.setCreatedAt(e.getCreatedAt());
        dto.setUpdatedAt(e.getUpdatedAt());
        return dto;
    }
}
