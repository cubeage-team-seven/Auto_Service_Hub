package com.autoservicehub.service;

import com.autoservicehub.dto.FollowupRequestDTO;
import com.autoservicehub.dto.FollowupResponseDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Customer Follow-up & Retention (SRS 4.10)
 */
public interface FollowupService {

    FollowupResponseDTO create(FollowupRequestDTO request);

    FollowupResponseDTO update(Long id, FollowupRequestDTO request);

    FollowupResponseDTO getById(Long id);

    Page<FollowupResponseDTO> list(Pageable pageable);

    void delete(Long id);
}
