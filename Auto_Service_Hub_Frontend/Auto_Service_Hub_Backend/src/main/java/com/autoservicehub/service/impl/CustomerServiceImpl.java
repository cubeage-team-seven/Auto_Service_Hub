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

/**
 * Customer CRM (SRS 4.1)
 * Business rules to enforce here per SRS section 12 (e.g. server-side total
 * recalculation, stock limits, audit trail) before persisting.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository repository;

    @Override
    public CustomerResponseDTO create(CustomerRequestDTO request) {
        Customer entity = new Customer();
        // TODO: map request -> entity
        Customer saved = repository.save(entity);
        return toResponse(saved);
    }

    @Override
    public CustomerResponseDTO update(Long id, CustomerRequestDTO request) {
        Customer existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
        // TODO: map request -> existing
        return toResponse(repository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public CustomerResponseDTO getById(Long id) {
        Customer found = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + id));
        return toResponse(found);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CustomerResponseDTO> list(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Customer not found: " + id);
        }
        repository.deleteById(id);
    }

    private CustomerResponseDTO toResponse(Customer entity) {
        CustomerResponseDTO dto = new CustomerResponseDTO();
        dto.setId(entity.getId());
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        // TODO: map remaining fields
        return dto;
    }
}
