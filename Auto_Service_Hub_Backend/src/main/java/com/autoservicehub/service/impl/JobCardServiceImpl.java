package com.autoservicehub.service.impl;

import com.autoservicehub.dto.JobCardRequestDTO;
import com.autoservicehub.dto.JobCardResponseDTO;
import com.autoservicehub.entity.*;
import com.autoservicehub.exception.ResourceNotFoundException;
import com.autoservicehub.repository.*;
import com.autoservicehub.service.JobCardService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Transactional
public class JobCardServiceImpl implements JobCardService {

    private final JobCardRepository repository;
    private final CustomerRepository customerRepository;
    private final VehicleRepository vehicleRepository;
    private final MechanicRepository mechanicRepository;
    private final AppointmentRepository appointmentRepository;

    @Override
    public JobCardResponseDTO create(JobCardRequestDTO request) {
        JobCard entity = new JobCard();
        mapToEntity(request, entity);
        entity.setStatus("RECEIVED");
        entity.setAssignedDate(LocalDateTime.now());
        entity.setJobCardNumber(generateJobCardNumber());
        return toResponse(repository.save(entity));
    }

    @Override
    public JobCardResponseDTO update(Long id, JobCardRequestDTO request) {
        JobCard existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobCard not found: " + id));
        mapToEntity(request, existing);
        if ("DELIVERED".equalsIgnoreCase(request.getStatus()) && existing.getCompletedDate() == null) {
            existing.setCompletedDate(LocalDateTime.now());
        }
        return toResponse(repository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public JobCardResponseDTO getById(Long id) {
        return toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("JobCard not found: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobCardResponseDTO> list(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("JobCard not found: " + id);
        repository.deleteById(id);
    }

    private void mapToEntity(JobCardRequestDTO r, JobCard e) {
        Customer customer = customerRepository.findById(r.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + r.getCustomerId()));
        Vehicle vehicle = vehicleRepository.findById(r.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + r.getVehicleId()));
        e.setCustomer(customer);
        e.setVehicle(vehicle);
        if (r.getMechanicId() != null) {
            e.setMechanic(mechanicRepository.findById(r.getMechanicId())
                    .orElseThrow(() -> new ResourceNotFoundException("Mechanic not found: " + r.getMechanicId())));
        }
        if (r.getAppointmentId() != null) {
            e.setAppointment(appointmentRepository.findById(r.getAppointmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + r.getAppointmentId())));
        }
        e.setServiceType(r.getServiceType());
        e.setComplaint(r.getComplaint());
        e.setTechnicianNotes(r.getTechnicianNotes());
        e.setOdometerReading(r.getOdometerReading());
        e.setEstimatedDelivery(r.getEstimatedDelivery());
        e.setEstimatedCost(r.getEstimatedCost());
        if (r.getStatus() != null) e.setStatus(r.getStatus());
    }

    private int statusToProgress(String status) {
        if (status == null) return 1;
        return switch (status.toUpperCase()) {
            case "RECEIVED" -> 1;
            case "INSPECTION" -> 2;
            case "IN_REPAIR", "IN REPAIR" -> 3;
            case "QUALITY_CHECK", "QUALITY CHECK", "QC" -> 4;
            case "DELIVERED" -> 5;
            default -> 1;
        };
    }

    private String generateJobCardNumber() {
        return "JC-" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
    }

    private JobCardResponseDTO toResponse(JobCard e) {
        JobCardResponseDTO dto = new JobCardResponseDTO();
        dto.setId(e.getId());
        dto.setJobCardNumber(e.getJobCardNumber());
        if (e.getCustomer() != null) {
            dto.setCustomerId(e.getCustomer().getId());
            dto.setCustomerName(e.getCustomer().getName());
        }
        if (e.getVehicle() != null) {
            dto.setVehicleId(e.getVehicle().getId());
            dto.setVehicleInfo(e.getVehicle().getRegistrationNo() + " | " + e.getVehicle().getModel());
        }
        if (e.getMechanic() != null) {
            dto.setMechanicId(e.getMechanic().getId());
            dto.setMechanicName(e.getMechanic().getName());
        }
        dto.setServiceType(e.getServiceType());
        dto.setComplaint(e.getComplaint());
        dto.setTechnicianNotes(e.getTechnicianNotes());
        dto.setOdometerReading(e.getOdometerReading());
        dto.setEstimatedDelivery(e.getEstimatedDelivery());
        dto.setEstimatedCost(e.getEstimatedCost());
        dto.setStatus(e.getStatus());
        dto.setProgress(statusToProgress(e.getStatus()));
        dto.setAssignedDate(e.getAssignedDate());
        dto.setCompletedDate(e.getCompletedDate());
        dto.setCreatedAt(e.getCreatedAt());
        dto.setUpdatedAt(e.getUpdatedAt());
        return dto;
    }
}
