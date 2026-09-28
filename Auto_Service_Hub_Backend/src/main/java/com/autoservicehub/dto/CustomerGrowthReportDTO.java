package com.autoservicehub.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class CustomerGrowthReportDTO {
    private LocalDate from;
    private LocalDate to;
    private long newCustomerCount;
}
