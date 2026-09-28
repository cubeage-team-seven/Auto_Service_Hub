package com.autoservicehub.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

/**
 * Maps to the 'ai_insights' table (SRS section 8.2 High-Level Entities).
 */
@Getter
@Setter
@Entity
@Table(name = "ai_insights")
public class AiInsight extends BaseEntity {

    @Column(name = "feature_type")
    private String featureType;
    @Column(name = "input_ref")
    private String inputRef;
    @Column(name = "result_json")
    private String resultJson;
    @Column(name = "confidence")
    private BigDecimal confidence;
}
