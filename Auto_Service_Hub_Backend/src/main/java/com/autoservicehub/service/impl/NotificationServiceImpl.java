package com.autoservicehub.service.impl;

import com.autoservicehub.service.NotificationService;
import org.springframework.stereotype.Service;

/**
 * Default implementation logs/no-ops until WhatsApp/Email/SMS providers are
 * selected and credentials configured (SRS 25, Open Questions 3).
 */
@Service
public class NotificationServiceImpl implements NotificationService {

    @Override
    public void sendInApp(Long userId, String title, String message) {
        // TODO: persist to `notifications` table and push via websocket/poll
    }

    @Override
    public void sendEmail(String toEmail, String subject, String body) {
        // TODO: integrate SMTP/email API provider
    }

    @Override
    public void sendWhatsApp(String toPhone, String templateName, Object templateData) {
        // TODO: integrate WhatsApp Business API provider
    }

    @Override
    public void sendSms(String toPhone, String message) {
        // TODO: integrate SMS provider
    }
}
