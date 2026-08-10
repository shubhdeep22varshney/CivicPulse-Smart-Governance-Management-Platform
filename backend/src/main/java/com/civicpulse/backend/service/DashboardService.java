package com.civicpulse.backend.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.civicpulse.backend.repository.ComplaintRepository;

@Service
public class DashboardService {

    private final ComplaintRepository complaintRepository;

    public DashboardService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    public Map<String, Long> getDashboardStatistics() {

        Map<String, Long> statistics = new HashMap<>();

        statistics.put("totalComplaints", complaintRepository.count());

        statistics.put("submitted",
                complaintRepository.countByStatus("SUBMITTED"));

        statistics.put("inProgress",
                complaintRepository.countByStatus("IN_PROGRESS"));

        statistics.put("resolved",
                complaintRepository.countByStatus("RESOLVED"));

        statistics.put("highPriority",
                complaintRepository.countByPriority("HIGH"));

        statistics.put("mediumPriority",
                complaintRepository.countByPriority("MEDIUM"));

        statistics.put("lowPriority",
                complaintRepository.countByPriority("LOW"));

        return statistics;
    }
}