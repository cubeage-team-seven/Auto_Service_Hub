package com.autoservicehub.service;

import com.autoservicehub.dto.InspectionRequestDTO;
import com.autoservicehub.dto.InspectionResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Vehicle Inspection (SRS 4.4)
 */
public interface InspectionService {

    InspectionResponseDTO create(InspectionRequestDTO request);

    InspectionResponseDTO update(Long id, InspectionRequestDTO request);

    InspectionResponseDTO getById(Long id);

    Page<InspectionResponseDTO> list(Pageable pageable);

    void delete(Long id);
}
