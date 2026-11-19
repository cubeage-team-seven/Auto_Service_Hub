package com.autoservicehub.service;

import com.autoservicehub.dto.ResetPasswordRequest;
import com.autoservicehub.dto.VerifyOtpRequest;
import com.autoservicehub.entity.PasswordResetOtp;
import com.autoservicehub.entity.User;
import com.autoservicehub.exception.PasswordResetRejectedException;
import com.autoservicehub.exception.PasswordResetValidationException;
import com.autoservicehub.repository.PasswordResetOtpRepository;
import com.autoservicehub.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final int OTP_VALIDITY_MINUTES = 10;
    private static final int RESET_TOKEN_VALIDITY_MINUTES = 10;
    private static final int OTP_RESEND_COOLDOWN_SECONDS = 60;
    private static final int MAX_OTP_REQUESTS_PER_HOUR = 5;
    private static final int MAX_OTP_ATTEMPTS = 5;
    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);

    private final UserRepository userRepository;
    private final PasswordResetOtpRepository otpRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public void sendOtp(String email) {
        Optional<User> matchingUser = userRepository.findByEmailIgnoreCaseForPasswordReset(email.trim());
        if (matchingUser.isEmpty()) {
            return;
        }

        User user = matchingUser.get();
        LocalDateTime now = LocalDateTime.now();
        Optional<PasswordResetOtp> latestRequest =
                otpRepository.findTopByUserIdOrderByIdDesc(user.getId());
        if (latestRequest.isPresent()
                && latestRequest.get().getCreatedAt() != null
                && latestRequest.get().getCreatedAt().isAfter(
                        now.minusSeconds(OTP_RESEND_COOLDOWN_SECONDS))) {
            return;
        }
        if (otpRepository.countByUserIdAndCreatedAtAfter(
                user.getId(), now.minusHours(1)) >= MAX_OTP_REQUESTS_PER_HOUR) {
            return;
        }

        String otp = generateOtp();

        otpRepository.findTopByUserIdAndUsedFalseOrderByIdDesc(user.getId())
                .ifPresent(previousOtp -> {
                    previousOtp.setUsed(true);
                    otpRepository.save(previousOtp);
                });
        otpRepository.findAllByUserIdAndResetTokenHashIsNotNull(user.getId())
                .forEach(previousReset -> {
                    previousReset.setResetTokenHash(null);
                    previousReset.setResetTokenExpiresAt(null);
                    otpRepository.save(previousReset);
                });

        PasswordResetOtp passwordResetOtp = new PasswordResetOtp();
        passwordResetOtp.setUserId(user.getId());
        passwordResetOtp.setOtpHash(passwordEncoder.encode(otp));
        passwordResetOtp.setExpiresAt(
                LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES)
        );
        passwordResetOtp.setUsed(false);

        otpRepository.save(passwordResetOtp);

        try {
            emailService.sendOtpEmail(user.getEmail(), otp);
        } catch (MailException ex) {
            passwordResetOtp.setUsed(true);
            otpRepository.save(passwordResetOtp);
            log.warn("Password reset email delivery failed ({})", ex.getClass().getSimpleName());
        }
    }

    @Transactional
    public Optional<String> verifyOtp(VerifyOtpRequest request) {
        Optional<User> matchingUser =
                userRepository.findByEmailIgnoreCaseForPasswordReset(request.getEmail().trim());
        if (matchingUser.isEmpty()) {
            return Optional.empty();
        }

        Optional<PasswordResetOtp> matchingOtp =
                otpRepository.findTopByUserIdAndUsedFalseOrderByIdDesc(matchingUser.get().getId());
        if (matchingOtp.isEmpty()) {
            return Optional.empty();
        }

        PasswordResetOtp otpRecord = matchingOtp.get();
        LocalDateTime now = LocalDateTime.now();
        if (!otpRecord.getExpiresAt().isAfter(now)
                || otpRecord.getAttemptCount() >= MAX_OTP_ATTEMPTS) {
            otpRecord.setUsed(true);
            otpRepository.save(otpRecord);
            return Optional.empty();
        }

        if (!passwordEncoder.matches(request.getOtp(), otpRecord.getOtpHash())) {
            int attemptCount = otpRecord.getAttemptCount() + 1;
            otpRecord.setAttemptCount(attemptCount);
            if (attemptCount >= MAX_OTP_ATTEMPTS) {
                otpRecord.setUsed(true);
            }
            otpRepository.save(otpRecord);
            return Optional.empty();
        }

        String resetToken = generateResetToken();
        otpRecord.setUsed(true);
        otpRecord.setResetTokenHash(passwordEncoder.encode(resetToken));
        otpRecord.setResetTokenExpiresAt(now.plusMinutes(RESET_TOKEN_VALIDITY_MINUTES));
        otpRepository.save(otpRecord);
        return Optional.of(resetToken);
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmailIgnoreCaseForPasswordReset(request.getEmail().trim())
                .orElseThrow(PasswordResetRejectedException::new);

        PasswordResetOtp resetRecord = otpRepository
                .findTopByUserIdAndResetTokenHashIsNotNullOrderByIdDesc(user.getId())
                .orElseThrow(PasswordResetRejectedException::new);

        if (resetRecord.getResetTokenExpiresAt() == null
                || !resetRecord.getResetTokenExpiresAt().isAfter(LocalDateTime.now())
                || !passwordEncoder.matches(request.getResetToken(), resetRecord.getResetTokenHash())) {
            throw new PasswordResetRejectedException();
        }
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new PasswordResetValidationException("Passwords do not match.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetRecord.setResetTokenHash(null);
        resetRecord.setResetTokenExpiresAt(null);
        otpRepository.save(resetRecord);
    }

    private String generateOtp() {
        int otp = secureRandom.nextInt(900000) + 100000;
        return String.valueOf(otp);
    }

    private String generateResetToken() {
        byte[] token = new byte[32];
        secureRandom.nextBytes(token);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(token);
    }
}