package com.civicpulse.backend.Authentication;

import com.civicpulse.backend.entity.Citizen;
import com.civicpulse.backend.entity.DepartmentOfficer;
import com.civicpulse.backend.entity.User;
import com.civicpulse.backend.repository.CitizenRepository;
import com.civicpulse.backend.repository.DepartmentOfficerRepository;
import com.civicpulse.backend.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {

    @Bean
    CommandLineRunner createAdmin(
            UserRepository userRepository,
            CitizenRepository citizenRepository,
            DepartmentOfficerRepository departmentOfficerRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // 1. Create Default Admin User in 'users' table
            String adminEmail = "admin@civicpulse.com";
            if (!userRepository.existsByEmail(adminEmail)) {
                User admin = new User();
                admin.setName("CivicPulse Admin");
                admin.setEmail(adminEmail);
                admin.setPassword(passwordEncoder.encode("Admin@123"));
                admin.setRole("ADMIN");
                userRepository.save(admin);

                System.out.println("=================================");
                System.out.println("ADMIN ACCOUNT SEEDED IN DB");
                System.out.println("Email: " + adminEmail);
                System.out.println("Password: Admin@123");
                System.out.println("Role: ADMIN");
                System.out.println("=================================");
            }

            // 2. Create Default Citizen User in 'users' and 'citizens' table
            String citizenEmail = "citizen@civicpulse.com";
            String encodedCitizenPassword = passwordEncoder.encode("Citizen@123");
            if (!userRepository.existsByEmail(citizenEmail)) {
                User citizenUser = new User();
                citizenUser.setName("John Citizen");
                citizenUser.setEmail(citizenEmail);
                citizenUser.setPassword(encodedCitizenPassword);
                citizenUser.setRole("CITIZEN");
                User savedCitizenUser = userRepository.save(citizenUser);

                Citizen citizenRecord = new Citizen();
                citizenRecord.setUserId(savedCitizenUser.getId());
                citizenRecord.setName("John Citizen");
                citizenRecord.setEmail(citizenEmail);
                citizenRecord.setPassword(encodedCitizenPassword);
                citizenRecord.setPhone("9876543210");
                citizenRecord.setAddress("Sector 15, Civic City");
                citizenRecord.setRole("CITIZEN");
                citizenRepository.save(citizenRecord);

                System.out.println("=================================");
                System.out.println("CITIZEN ACCOUNT SEEDED IN DB (USERS & CITIZENS TABLES)");
                System.out.println("Email: " + citizenEmail);
                System.out.println("Password: Citizen@123");
                System.out.println("Role: CITIZEN");
                System.out.println("=================================");
            }

            // 3. Create Default Department Officers in 'department_officers' table
            String encodedOfficerPassword = passwordEncoder.encode("Officer@123");

            seedOfficer(departmentOfficerRepository, userRepository, "pwd@civicpulse.com", "Rajesh Sharma", "Public Works Department", "PWD", 1L, "9876500001", encodedOfficerPassword);
            seedOfficer(departmentOfficerRepository, userRepository, "water@civicpulse.com", "Anita Verma", "Water Supply & Sewerage", "WATER", 2L, "9876500002", encodedOfficerPassword);
            seedOfficer(departmentOfficerRepository, userRepository, "sanitation@civicpulse.com", "Vikram Singh", "Public Health & Sanitation", "SANITATION", 3L, "9876500003", encodedOfficerPassword);
            seedOfficer(departmentOfficerRepository, userRepository, "officer@civicpulse.com", "General Department Officer", "Municipal Administration", "DEPT", 4L, "9876500000", encodedOfficerPassword);

        };
    }

    private void seedOfficer(DepartmentOfficerRepository deptRepo, UserRepository userRepo,
                             String email, String name, String deptName, String deptCode, Long deptId, String phone, String password) {
        if (!deptRepo.existsByEmailIgnoreCase(email)) {
            User officerUser = new User();
            officerUser.setName(name);
            officerUser.setEmail(email);
            officerUser.setPassword(password);
            officerUser.setRole("DEPARTMENT_OFFICER");
            User savedUser = userRepo.save(officerUser);

            DepartmentOfficer officer = new DepartmentOfficer();
            officer.setUserId(savedUser.getId());
            officer.setDepartmentId(deptId);
            officer.setName(name);
            officer.setEmail(email);
            officer.setPassword(password);
            officer.setDepartmentName(deptName);
            officer.setDepartmentCode(deptCode);
            officer.setPhone(phone);
            officer.setRole("DEPARTMENT_OFFICER");
            deptRepo.save(officer);

            System.out.println("=================================");
            System.out.println("DEPARTMENT OFFICER SEEDED IN DB (department_officers)");
            System.out.println("Email: " + email);
            System.out.println("Password: Officer@123");
            System.out.println("Department: " + deptName);
            System.out.println("=================================");
        }
    }
}