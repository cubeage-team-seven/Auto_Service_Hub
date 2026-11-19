package com.autoservicehub.repository;

import com.autoservicehub.entity.AccessRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AccessRequestRepository extends JpaRepository<AccessRequest, Long> {
    @Modifying
    @Query("UPDATE AccessRequest a SET a.reviewedBy = null WHERE a.reviewedBy.id = :userId")
    int clearReviewerReferences(@Param("userId") Long userId);

    boolean existsByEmailIgnoreCaseAndStatus(String email, String status);

    List<AccessRequest> findAllByOrderByCreatedAtDesc();
}
