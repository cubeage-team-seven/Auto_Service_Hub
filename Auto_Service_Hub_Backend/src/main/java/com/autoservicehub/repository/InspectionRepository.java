package com.autoservicehub.repository;

import com.autoservicehub.entity.Inspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for Inspection. Extends JpaSpecificationExecutor so
 * list/report endpoints (SRS 9, 17) can apply dynamic filters.
 */
@Repository
public interface InspectionRepository extends JpaRepository<Inspection, Long>, JpaSpecificationExecutor<Inspection> {
}
