package com.civicpulse.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.civicpulse.backend.entity.Complaint;
import com.civicpulse.backend.repository.ComplaintRepository;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;

    public ComplaintService(ComplaintRepository complaintRepository) {
        this.complaintRepository = complaintRepository;
    }

    // Create complaint
    public Complaint createComplaint(Complaint complaint) {
        return complaintRepository.save(complaint);
    }

    // Get all complaints
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    // Get complaint by citizen id
    public List<Complaint> getComplaintsByCitizenId(Long citizenId) {
        return complaintRepository.findByCitizenId(citizenId);
    }
    // Get complaints by status

    public List<Complaint> getComplaintsByStatus(String status) {
        return complaintRepository.findByStatus(status);
    }
// Get complaints by priority

    public List<Complaint> getComplaintsByPriority(String priority) {
        return complaintRepository.findByPriority(priority);
    }

    // Get complaint by ID
    public Optional<Complaint> getComplaintById(Long id) {
        return complaintRepository.findById(id);
    }

    // Update complaint
    public Complaint updateComplaint(Long id, Complaint updatedComplaint) {

        Complaint existingComplaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        existingComplaint.setTitle(updatedComplaint.getTitle());
        existingComplaint.setDescription(updatedComplaint.getDescription());
        existingComplaint.setCategory(updatedComplaint.getCategory());
        existingComplaint.setLocation(updatedComplaint.getLocation());
        existingComplaint.setPriority(updatedComplaint.getPriority());
        existingComplaint.setStatus(updatedComplaint.getStatus());
        existingComplaint.setDepartmentId(updatedComplaint.getDepartmentId());

        return complaintRepository.save(existingComplaint);
    }

    // Delete complaint
    public void deleteComplaint(Long id) {
        complaintRepository.deleteById(id);
    }

    public Complaint updateComplaintStatus(Long id, String status) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(status);

        return complaintRepository.save(complaint);
    }

    public Complaint assignDepartment(Long id, Long departmentId) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setDepartmentId(departmentId);

        return complaintRepository.save(complaint);
    }

    public Complaint resolveComplaint(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus("RESOLVED");

        return complaintRepository.save(complaint);
    }
}
