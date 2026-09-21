package com.autoservicehub.ai;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.util.Map;

/**
 * Normalized AI response, always labeled as assistive (SRS FR-AI-04, BR-09):
 * results must be confirmed by staff and never silently change a business record.
 */
@Getter
@Setter
@AllArgsConstructor
public class AiResult {
    private AiFeatureType featureType;
    private String summary;
    private BigDecimal confidence;
    private Map<String, Object> details;
    private boolean requiresHumanConfirmation;
}
