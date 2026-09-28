package com.autoservicehub.repository;

import com.autoservicehub.entity.AiInsight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for AiInsight. Extends JpaSpecificationExecutor so
 * list/report endpoints (SRS 9, 17) can apply dynamic filters.
 */
@Repository
public interface AiInsightRepository extends JpaRepository<AiInsight, Long>, JpaSpecificationExecutor<AiInsight> {
}
