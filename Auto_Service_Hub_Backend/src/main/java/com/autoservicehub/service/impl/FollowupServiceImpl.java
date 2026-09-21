package com.autoservicehub.service.impl;

import com.autoservicehub.dto.FollowupRequestDTO;
import com.autoservicehub.dto.FollowupResponseDTO;
import com.autoservicehub.entity.Customer;
import com.autoservicehub.entity.Followup;
import com.autoservicehub.entity.JobCard;
import com.autoservicehub.exception.ResourceNotFoundException;
import com.autoservicehub.repository.CustomerRepository;
import com.autoservicehub.repository.FollowupRepository;
import com.autoservicehub.repository.JobCardRepository;
import com.autoservicehub.service.FollowupService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class FollowupServiceImpl implements FollowupService {

    private final FollowupRepository repository;
    private final CustomerRepository customerRepository;
    private final JobCardRepository jobCardRepository;

    @Override
    public FollowupResponseDTO create(FollowupRequestDTO request) {
        Followup entity = new Followup();
        mapToEntity(request, entity);
        return toResponse(repository.save(entity));
    }

    @Override
    public FollowupResponseDTO update(Long id, FollowupRequestDTO request) {
        Followup existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Followup not found: " + id));
        mapToEntity(request, existing);
        return toResponse(repository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public FollowupResponseDTO getById(Long id) {
        return toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Followup not found: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<FollowupResponseDTO> list(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Followup not found: " + id);
        repository.deleteById(id);
    }

    private void mapToEntity(FollowupRequestDTO r, Followup e) {
        Customer customer = customerRepository.findById(r.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + r.getCustomerId()));
        e.setCustomer(customer);
        if (r.getJobCardId() != null) {
            JobCard jobCard = jobCardRepository.findById(r.getJobCardId())
                    .orElseThrow(() -> new ResourceNotFoundException("JobCard not found: " + r.getJobCardId()));
            e.setJobCard(jobCard);
        }
        e.setDueDate(r.getDueDate());
        e.setReason(r.getReason());
        e.setStatus(r.getStatus() != null ? r.getStatus() : "PENDING");
    }

    private FollowupResponseDTO toResponse(Followup e) {
        FollowupResponseDTO dto = new FollowupResponseDTO();
        dto.setId(e.getId());
        if (e.getCustomer() != null) {
            dto.setCustomerId(e.getCustomer().getId());
            dto.setCustomerName(e.getCustomer().getName());
            dto.setCustomerPhone(e.getCustomer().getPhone());
        }
        if (e.getJobCard() != null) {
            dto.setJobCardId(e.getJobCard().getId());
        }
        dto.setDueDate(e.getDueDate());
        dto.setReason(e.getReason());
        dto.setStatus(e.getStatus());
        dto.setCreatedAt(e.getCreatedAt());
        dto.setUpdatedAt(e.getUpdatedAt());
        return dto;
    }
}
