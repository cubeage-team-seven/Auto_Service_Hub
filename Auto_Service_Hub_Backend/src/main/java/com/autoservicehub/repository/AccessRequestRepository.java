package com.autoservicehub.repository;

import com.autoservicehub.entity.AccessRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccessRequestRepository extends JpaRepository<AccessRequest, Long> {
    boolean existsByEmailIgnoreCaseAndStatus(String email, String status);

    List<AccessRequest> findAllByOrderByCreatedAtDesc();
}
