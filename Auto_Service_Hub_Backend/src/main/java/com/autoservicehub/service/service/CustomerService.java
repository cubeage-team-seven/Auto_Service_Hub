package com.autoservicehub.service;

import com.autoservicehub.dto.CustomerRequestDTO;
import com.autoservicehub.dto.CustomerResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Customer CRM (SRS 4.1)
 */
public interface CustomerService {

    CustomerResponseDTO create(CustomerRequestDTO request);

    CustomerResponseDTO update(Long id, CustomerRequestDTO request);

    CustomerResponseDTO getById(Long id);

    Page<CustomerResponseDTO> list(Pageable pageable);

    void delete(Long id);
}
