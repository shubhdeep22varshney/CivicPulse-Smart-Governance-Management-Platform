package com.civicpulse.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.civicpulse.backend.entity.Complaint;
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
     List<Complaint> findByCitizenId(Long citizenId);
     List<Complaint> findByStatus(String status);
     List<Complaint> findByPriority(String priority);
     long countByStatus(String status);
     long countByPriority(String priority);
}