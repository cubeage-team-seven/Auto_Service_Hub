package com.autoservicehub.repository;

import com.autoservicehub.entity.JobTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

/**
 * Spring Data JPA repository for JobTask. Extends JpaSpecificationExecutor so
 * list/report endpoints (SRS 9, 17) can apply dynamic filters.
 */
@Repository
public interface JobTaskRepository extends JpaRepository<JobTask, Long>, JpaSpecificationExecutor<JobTask> {
	List<JobTask> findByMechanicIdOrderByCreatedAtAsc(Long mechanicId);
	List<JobTask> findByJobCardIdOrderByCreatedAtAsc(Long jobCardId);

	@Query("select count(t) from JobTask t where t.mechanic.id = :mechanicId " +
			"and (t.status is null or upper(t.status) not in ('COMPLETED', 'DONE'))")
	long countPendingByMechanicId(@Param("mechanicId") Long mechanicId);
}
