package com.civicpulse.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.civicpulse.backend.entity.Complaint;
import com.civicpulse.backend.repository.ComplaintRepository;

@Service
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final NotificationService notificationService;

    public ComplaintService(
            ComplaintRepository complaintRepository,
            NotificationService notificationService) {

        this.complaintRepository = complaintRepository;
        this.notificationService = notificationService;
    }

    // =========================================================
    // CREATE COMPLAINT
    // =========================================================

    public Complaint createComplaint(Complaint complaint) {

        if (complaint.getStatus() == null || complaint.getStatus().isBlank()) {
            complaint.setStatus("PENDING");
        }

        Complaint savedComplaint = complaintRepository.save(complaint);

        // Create real notification after successful complaint creation
        if (savedComplaint.getCitizenId() != null) {

            notificationService.createNotification(
                    savedComplaint.getCitizenId(),
                    savedComplaint.getId(),
                    savedComplaint.getTitle(),
                    "Complaint Received",
                    "Your complaint \"" + savedComplaint.getTitle()
                            + "\" has been successfully registered.",
                    "received"
            );
        }

        return savedComplaint;
    }

    // =========================================================
    // GET ALL COMPLAINTS
    // =========================================================

    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    // =========================================================
    // GET COMPLAINTS BY CITIZEN
    // =========================================================

    public List<Complaint> getComplaintsByCitizenId(Long citizenId) {
        return complaintRepository.findByCitizenId(citizenId);
    }

    // =========================================================
    // GET COMPLAINTS BY DEPARTMENT
    // =========================================================

    public List<Complaint> getComplaintsByDepartmentId(Long departmentId) {
        return complaintRepository.findByDepartmentId(departmentId);
    }

    // =========================================================
    // GET COMPLAINTS BY STATUS
    // =========================================================

    public List<Complaint> getComplaintsByStatus(String status) {
        return complaintRepository.findByStatus(status);
    }

    // =========================================================
    // GET COMPLAINTS BY PRIORITY
    // =========================================================

    public List<Complaint> getComplaintsByPriority(String priority) {
        return complaintRepository.findByPriority(priority);
    }

    // =========================================================
    // GET COMPLAINT BY ID
    // =========================================================

    public Optional<Complaint> getComplaintById(Long id) {
        return complaintRepository.findById(id);
    }

    // =========================================================
    // UPDATE COMPLAINT
    // =========================================================

    public Complaint updateComplaint(Long id, Complaint updatedComplaint) {

        Complaint existingComplaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        String oldStatus = existingComplaint.getStatus();

        existingComplaint.setTitle(updatedComplaint.getTitle());
        existingComplaint.setDescription(updatedComplaint.getDescription());
        existingComplaint.setCategory(updatedComplaint.getCategory());
        existingComplaint.setLocation(updatedComplaint.getLocation());
        existingComplaint.setPriority(updatedComplaint.getPriority());
        existingComplaint.setStatus(updatedComplaint.getStatus());
        existingComplaint.setDepartmentId(updatedComplaint.getDepartmentId());

        Complaint savedComplaint = complaintRepository.save(existingComplaint);

        // Notify citizen only if status actually changed
        if (savedComplaint.getCitizenId() != null
                && savedComplaint.getStatus() != null
                && !savedComplaint.getStatus().equalsIgnoreCase(oldStatus)) {

            createStatusNotification(savedComplaint);
        }

        return savedComplaint;
    }

    // =========================================================
    // UPDATE COMPLAINT STATUS
    // =========================================================

    public Complaint updateComplaintStatus(Long id, String status) {

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        String oldStatus = complaint.getStatus();

        complaint.setStatus(status);

        Complaint savedComplaint = complaintRepository.save(complaint);

        // Don't create duplicate notification
        if (savedComplaint.getCitizenId() != null
                && !sameStatus(oldStatus, status)) {

            createStatusNotification(savedComplaint);
        }

        return savedComplaint;
    }

    // =========================================================
    // ASSIGN DEPARTMENT
    // =========================================================

    public Complaint assignDepartment(Long id, Long departmentId) {

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setDepartmentId(departmentId);

        return complaintRepository.save(complaint);
    }

    // =========================================================
    // RESOLVE COMPLAINT
    // =========================================================

    public Complaint resolveComplaint(Long id) {

        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        String oldStatus = complaint.getStatus();

        complaint.setStatus("RESOLVED");

        Complaint savedComplaint = complaintRepository.save(complaint);

        // Notify only when it wasn't already resolved
        if (savedComplaint.getCitizenId() != null
                && !sameStatus(oldStatus, "RESOLVED")) {

            notificationService.createNotification(
                    savedComplaint.getCitizenId(),
                    savedComplaint.getId(),
                    savedComplaint.getTitle(),
                    "Complaint Resolved",
                    "Your complaint \"" + savedComplaint.getTitle()
                            + "\" has been resolved.",
                    "resolved"
            );
        }

        return savedComplaint;
    }

    // =========================================================
    // DELETE COMPLAINT
    // =========================================================

    public void deleteComplaint(Long id) {
        complaintRepository.deleteById(id);
    }

    // =========================================================
    // STATUS NOTIFICATION
    // =========================================================

    private void createStatusNotification(Complaint complaint) {

        String status = complaint.getStatus();

        String title;
        String message;
        String type;

        switch (status.toUpperCase()) {

            case "PENDING":
                title = "Complaint Status Updated";
                message = "Your complaint \"" + complaint.getTitle()
                        + "\" is pending review.";
                type = "pending";
                break;

            case "IN_PROGRESS":
                title = "Complaint In Progress";
                message = "Your complaint \"" + complaint.getTitle()
                        + "\" is now being processed.";
                type = "status";
                break;

            case "RESOLVED":
                title = "Complaint Resolved";
                message = "Your complaint \"" + complaint.getTitle()
                        + "\" has been resolved.";
                type = "resolved";
                break;

            case "REJECTED":
                title = "Complaint Rejected";
                message = "Your complaint \"" + complaint.getTitle()
                        + "\" has been rejected.";
                type = "warning";
                break;

            default:
                title = "Complaint Status Updated";
                message = "The status of your complaint \""
                        + complaint.getTitle()
                        + "\" has been updated to "
                        + status + ".";
                type = "status";
        }

        notificationService.createNotification(
                complaint.getCitizenId(),
                complaint.getId(),
                complaint.getTitle(),
                title,
                message,
                type
        );
    }

    private boolean sameStatus(String first, String second) {

        if (first == null && second == null) {
            return true;
        }

        if (first == null || second == null) {
            return false;
        }

        return first.equalsIgnoreCase(second);
    }
}