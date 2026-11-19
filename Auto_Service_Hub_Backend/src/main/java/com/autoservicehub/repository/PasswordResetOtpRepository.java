package com.autoservicehub.repository;

import com.autoservicehub.entity.PasswordResetOtp;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordResetOtpRepository extends JpaRepository<PasswordResetOtp, Long> {

    long deleteAllByUserId(Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<PasswordResetOtp> findTopByUserIdAndUsedFalseOrderByIdDesc(Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    Optional<PasswordResetOtp> findTopByUserIdAndResetTokenHashIsNotNullOrderByIdDesc(Long userId);

    Optional<PasswordResetOtp> findTopByUserIdOrderByIdDesc(Long userId);

    List<PasswordResetOtp> findAllByUserIdAndResetTokenHashIsNotNull(Long userId);

    long countByUserIdAndCreatedAtAfter(Long userId, LocalDateTime createdAt);
}