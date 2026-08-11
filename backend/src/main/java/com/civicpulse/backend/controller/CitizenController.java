package com.civicpulse.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.civicpulse.backend.entity.Citizen;
import com.civicpulse.backend.service.CitizenService;

@RestController
@RequestMapping("/api/citizens")
@CrossOrigin(origins = "*")
public class CitizenController {

    private final CitizenService citizenService;

    public CitizenController(CitizenService citizenService) {
        this.citizenService = citizenService;
    }

    @GetMapping
    public ResponseEntity<List<Citizen>> getAllCitizens() {
        return ResponseEntity.ok(citizenService.getAllCitizens());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Citizen> getCitizenById(@PathVariable Long id) {
        return citizenService.getCitizenById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Citizen> getCitizenByUserId(@PathVariable Long userId) {
        return citizenService.getCitizenByUserId(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Citizen> updateCitizen(
            @PathVariable Long id,
            @RequestBody Citizen citizen) {
        return ResponseEntity.ok(citizenService.updateCitizen(id, citizen));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCitizen(@PathVariable Long id) {
        citizenService.deleteCitizen(id);
        return ResponseEntity.noContent().build();
    }
}
