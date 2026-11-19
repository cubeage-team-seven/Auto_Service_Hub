package com.autoservicehub.repository;

import com.autoservicehub.entity.PackageApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for PackageApplication. Extends
 * JpaSpecificationExecutor so list/report endpoints (SRS 9, 17) can apply dynamic
 * filters.
 */
@Repository
public interface PackageApplicationRepository
        extends JpaRepository<PackageApplication, Long>, JpaSpecificationExecutor<PackageApplication> {

    /**
     * Whether this package has already been applied to this vehicle.
     *
     * <p>Backs the duplicate rule in {@code PackageApplicationServiceImpl}. The
     * authoritative guarantee is the
     * {@code uq_package_application_package_vehicle} unique constraint, which
     * also covers two advisors racing; this query exists so the common case
     * answers with a specific message instead of a generic conflict.
     */
    boolean existsByServicePackageIdAndVehicleId(Long servicePackageId, Long vehicleId);

    /**
     * Whether this package has ever been applied to a vehicle. Backs the
     * delete guard in {@code ServicePackageServiceImpl}: an applied package
     * is referenced by a restrictive foreign key (and, through the
     * application, by job cards), so it must be deactivated rather than
     * permanently deleted.
     */
    boolean existsByServicePackageId(Long servicePackageId);

    /** Applications of one package, newest first. */
    List<PackageApplication> findByServicePackageIdOrderByCreatedAtDescIdDesc(Long servicePackageId);

    /** Paged variant of the above. */
    Page<PackageApplication> findByServicePackageIdOrderByCreatedAtDescIdDesc(Long servicePackageId, Pageable pageable);
}
