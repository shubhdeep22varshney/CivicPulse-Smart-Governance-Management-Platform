package com.civicpulse.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.civicpulse.backend.entity.Citizen;
import com.civicpulse.backend.repository.CitizenRepository;

@Service
public class CitizenService {

    private final CitizenRepository citizenRepository;

    public CitizenService(CitizenRepository citizenRepository) {
        this.citizenRepository = citizenRepository;
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
