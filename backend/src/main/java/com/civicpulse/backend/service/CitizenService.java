package com.civicpulse.backend.service;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.civicpulse.backend.dto.CitizenDashboardStats;
import com.civicpulse.backend.entity.Citizen;
import com.civicpulse.backend.repository.CitizenRepository;
import com.civicpulse.backend.repository.ComplaintRepository;
@Service
public class CitizenService {
     private final CitizenRepository citizenRepository;
private final ComplaintRepository complaintRepository;

    public CitizenService(
        CitizenRepository citizenRepository,
        ComplaintRepository complaintRepository) {

    this.citizenRepository = citizenRepository;
    this.complaintRepository = complaintRepository;
}
    public List<Citizen> getAllCitizens() {
        return citizenRepository.findAll();
    }
    public Optional<Citizen> getCitizenById(Long id) {
        return citizenRepository.findById(id);
    }
    public Optional<Citizen> getCitizenByUserId(Long userId) {
        return citizenRepository.findByUserId(userId);
    }
    public CitizenDashboardStats getCitizenDashboard(Long citizenId) {

    citizenRepository.findById(citizenId)
            .orElseThrow(() ->
                    new RuntimeException("Citizen not found with id: " + citizenId));

    long totalComplaints =
            complaintRepository.findByCitizenId(citizenId).size();

    long pendingComplaints =
            complaintRepository
                    .findByCitizenIdAndStatus(citizenId, "PENDING")
                    .size();

    long inProgressComplaints =
            complaintRepository
                    .findByCitizenIdAndStatus(citizenId, "IN_PROGRESS")
                    .size();

    long resolvedComplaints =
            complaintRepository
                    .findByCitizenIdAndStatus(citizenId, "RESOLVED")
                    .size();

    return new CitizenDashboardStats(
            citizenId,
            totalComplaints,
            pendingComplaints,
            inProgressComplaints,
            resolvedComplaints
    );
}
    public Citizen updateCitizen(Long id, Citizen updatedCitizen) {
        Citizen citizen = citizenRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Citizen not found with id: " + id));

        citizen.setPhone(updatedCitizen.getPhone());
        citizen.setAddress(updatedCitizen.getAddress());

        return citizenRepository.save(citizen);
    }
    public void deleteCitizen(Long id) {
        citizenRepository.deleteById(id);
    }
}