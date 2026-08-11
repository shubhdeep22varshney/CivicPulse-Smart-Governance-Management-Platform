package com.civicpulse.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.civicpulse.backend.entity.Citizen;

public interface CitizenRepository extends JpaRepository<Citizen, Long> {

    Optional<Citizen> findByUserId(Long userId);
}