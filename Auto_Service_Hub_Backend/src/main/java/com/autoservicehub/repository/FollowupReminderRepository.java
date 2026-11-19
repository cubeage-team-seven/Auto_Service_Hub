package com.autoservicehub.repository;

import com.autoservicehub.entity.FollowupReminder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowupReminderRepository extends JpaRepository<FollowupReminder, Long> {
    Page<FollowupReminder> findByFollowupIdOrderByCreatedAtDesc(Long followupId, Pageable pageable);
    long countByStatus(String status);
    boolean existsByFollowupId(Long followupId);
    List<FollowupReminder> findByFollowupIdAndStatus(Long followupId, String status);
}
