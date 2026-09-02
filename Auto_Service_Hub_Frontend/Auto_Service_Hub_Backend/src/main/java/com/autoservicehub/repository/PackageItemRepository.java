package com.autoservicehub.repository;

import com.autoservicehub.entity.PackageItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for PackageItem. Extends JpaSpecificationExecutor so
 * list/report endpoints (SRS 9, 17) can apply dynamic filters.
 */
@Repository
public interface PackageItemRepository extends JpaRepository<PackageItem, Long>, JpaSpecificationExecutor<PackageItem> {
}
