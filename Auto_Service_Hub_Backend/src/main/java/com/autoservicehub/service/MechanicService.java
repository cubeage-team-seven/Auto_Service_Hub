package com.autoservicehub.service;

import com.autoservicehub.dto.MechanicRequestDTO;
import com.autoservicehub.dto.MechanicResponseDTO;
import com.autoservicehub.dto.MechanicProfileOptionDTO;
import com.autoservicehub.dto.MechanicAccountOptionDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

/**
 * Mechanic Management (SRS 4.6)
 */
public interface MechanicService {

    MechanicResponseDTO create(MechanicRequestDTO request);

    MechanicResponseDTO update(Long id, MechanicRequestDTO request);

    MechanicResponseDTO associateUser(Long mechanicId, Long userId);

    MechanicResponseDTO removeUserAssociation(Long mechanicId);

    MechanicResponseDTO getById(Long id);

    Page<MechanicResponseDTO> list(Pageable pageable);

    List<MechanicProfileOptionDTO> listUnlinkedProfiles();

    List<MechanicAccountOptionDTO> listUnlinkedMechanicAccounts();

    void delete(Long id);
}
