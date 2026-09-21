package com.autoservicehub.service.impl;

import com.autoservicehub.dto.CustomerRequestDTO;
import com.autoservicehub.dto.CustomerResponseDTO;
import com.autoservicehub.entity.Customer;
import com.autoservicehub.exception.ResourceNotFoundException;
import com.autoservicehub.repository.CustomerRepository;
import com.autoservicehub.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository repository;

    @Override
    public CustomerResponseDTO create(CustomerRequestDTO request) {
        Customer entity = new Customer();
        mapToEntity(request, entity);
        return toResponse(repository.save(entity));
    }

    @Override
    public CustomerResponseDTO update(Long id, CustomerRequestDTO request) {
        Customer existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
        mapToEntity(request, existing);
        return toResponse(repository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDTO getById(Long id) {
        return toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponseDTO> list(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Customer not found: " + id);
        repository.deleteById(id);
    }

    private void mapToEntity(CustomerRequestDTO r, Customer e) {
        e.setName(r.getName());
        e.setPhone(r.getPhone());
        e.setEmail(r.getEmail());
        e.setAddress(r.getAddress());
        e.setStatus(r.getStatus() != null ? r.getStatus() : "ACTIVE");
    }

    private CustomerResponseDTO toResponse(Customer e) {
        CustomerResponseDTO dto = new CustomerResponseDTO();
        dto.setId(e.getId());
        dto.setName(e.getName());
        dto.setPhone(e.getPhone());
        dto.setEmail(e.getEmail());
        dto.setAddress(e.getAddress());
        dto.setStatus(e.getStatus());
        dto.setCreatedAt(e.getCreatedAt());
        dto.setUpdatedAt(e.getUpdatedAt());
        return dto;
    }
}
