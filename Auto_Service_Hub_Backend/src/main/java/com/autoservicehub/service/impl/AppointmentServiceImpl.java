package com.autoservicehub.service.impl;

import com.autoservicehub.dto.AppointmentRequestDTO;
import com.autoservicehub.dto.AppointmentResponseDTO;
import com.autoservicehub.entity.Appointment;
import com.autoservicehub.entity.Customer;
import com.autoservicehub.entity.Vehicle;
import com.autoservicehub.exception.ResourceNotFoundException;
import com.autoservicehub.repository.AppointmentRepository;
import com.autoservicehub.repository.CustomerRepository;
import com.autoservicehub.repository.VehicleRepository;
import com.autoservicehub.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository repository;
    private final CustomerRepository customerRepository;
    private final VehicleRepository vehicleRepository;

    @Override
    public AppointmentResponseDTO create(AppointmentRequestDTO request) {
        Appointment entity = new Appointment();
        mapToEntity(request, entity);
        return toResponse(repository.save(entity));
    }

    @Override
    public AppointmentResponseDTO update(Long id, AppointmentRequestDTO request) {
        Appointment existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id));
        mapToEntity(request, existing);
        return toResponse(repository.save(existing));
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentResponseDTO getById(Long id) {
        return toResponse(repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found: " + id)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AppointmentResponseDTO> list(Pageable pageable) {
        return repository.findAll(pageable).map(this::toResponse);
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) throw new ResourceNotFoundException("Appointment not found: " + id);
        repository.deleteById(id);
    }

    private void mapToEntity(AppointmentRequestDTO r, Appointment e) {
        Customer customer = customerRepository.findById(r.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found: " + r.getCustomerId()));
        Vehicle vehicle = vehicleRepository.findById(r.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found: " + r.getVehicleId()));
        e.setCustomer(customer);
        e.setVehicle(vehicle);
        e.setServiceType(r.getServiceType());
        e.setAppointmentAt(r.getAppointmentAt());
        e.setPickupDrop(r.getPickupDrop());
        e.setNotes(r.getNotes());
        e.setStatus(r.getStatus() != null ? r.getStatus() : "SCHEDULED");
    }

    private AppointmentResponseDTO toResponse(Appointment e) {
        AppointmentResponseDTO dto = new AppointmentResponseDTO();
        dto.setId(e.getId());
        if (e.getCustomer() != null) {
            dto.setCustomerId(e.getCustomer().getId());
            dto.setCustomerName(e.getCustomer().getName());
            dto.setCustomerPhone(e.getCustomer().getPhone());
        }
        if (e.getVehicle() != null) {
            dto.setVehicleId(e.getVehicle().getId());
            dto.setVehicleInfo(e.getVehicle().getRegistrationNo() + " | " + e.getVehicle().getModel());
        }
        dto.setServiceType(e.getServiceType());
        dto.setAppointmentAt(e.getAppointmentAt());
        dto.setPickupDrop(e.getPickupDrop());
        dto.setNotes(e.getNotes());
        dto.setStatus(e.getStatus());
        dto.setCreatedAt(e.getCreatedAt());
        dto.setUpdatedAt(e.getUpdatedAt());
        return dto;
    }
}
