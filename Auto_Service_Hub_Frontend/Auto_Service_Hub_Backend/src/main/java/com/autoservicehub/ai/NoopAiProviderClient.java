package com.autoservicehub.ai;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Default fallback used when no AI provider is configured (app.ai.provider=none).
 * Ensures the CRM's core manual workflows keep working even if AI is unavailable
 * (SRS 18 - Integrations, 23 - Risks: AI provider outage).
 */
@Component
public class NoopAiProviderClient implements AiProviderClient {

    @Override
    public AiResult invoke(AiRequest request) {
        return new AiResult(
                request.getFeatureType(),
                "AI provider not configured.",
                BigDecimal.ZERO,
                Map.of(),
                true
        );
    }
}
