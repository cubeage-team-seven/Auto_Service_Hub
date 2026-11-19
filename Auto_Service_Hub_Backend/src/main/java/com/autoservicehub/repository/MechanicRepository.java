package com.autoservicehub.repository;

import com.autoservicehub.entity.Mechanic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import jakarta.persistence.LockModeType;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for Mechanic. Extends JpaSpecificationExecutor so
 * list/report endpoints (SRS 9, 17) can apply dynamic filters.
 */
@Repository
public interface MechanicRepository extends JpaRepository<Mechanic, Long>, JpaSpecificationExecutor<Mechanic> {

    /**
     * FR-AI-17: Mechanics in a given employment status, used to build the
     * candidate pool for AI Mechanic Assignment. Derived query — no schema change.
     */
    List<Mechanic> findByStatusIgnoreCase(String status);

    /** Used by MechanicServiceImpl to guarantee employee-code uniqueness. */
    boolean existsByEmployeeCode(String employeeCode);

    Optional<Mechanic> findByUser_Id(Long userId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT m FROM Mechanic m WHERE m.user.id = :userId")
    Optional<Mechanic> findByUser_IdForAssociation(@Param("userId") Long userId);

    Page<Mechanic> findByUser_Id(Long userId, Pageable pageable);

    List<Mechanic> findAllByUserIsNullOrderByEmployeeCodeAsc();

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT m FROM Mechanic m WHERE m.id = :id")
    Optional<Mechanic> findByIdForAssociation(@Param("id") Long id);
}
