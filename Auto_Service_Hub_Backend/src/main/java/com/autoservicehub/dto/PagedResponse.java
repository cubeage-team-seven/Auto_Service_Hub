package com.autoservicehub.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

/**
 * Pagination wrapper for large customer/job/inventory lists (SRS 9.1).
 */
@Getter
@Setter
@AllArgsConstructor
public class PagedResponse<T> {
    private List<T> content;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
}
