/**
 * DTO <-> Entity mapping. Use MapStruct (see pom.xml) to generate mappers, e.g.:
 *
 * @Mapper(componentModel = "spring")
 * public interface CustomerMapper {
 *     CustomerResponseDTO toDto(Customer entity);
 *     Customer toEntity(CustomerRequestDTO dto);
 * }
 *
 * Keeps JPA entities out of the REST layer (SRS 9.1).
 */
package com.autoservicehub.mapper;
