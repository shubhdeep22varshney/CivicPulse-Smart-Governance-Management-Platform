
package com.civicpulse.backend.Authentication;
import com.civicpulse.backend.entity.User;
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
            PasswordEncoder passwordEncoder) {

        return args -> {

            String adminEmail = "admin@civicpulse.com";

            // Check if admin already exists
            if (!userRepository.existsByEmail(adminEmail)) {

                User admin = new User();

                admin.setName("CivicPulse Admin");
                admin.setEmail(adminEmail);

                // Password will be stored as BCrypt hash
                admin.setPassword(
                        passwordEncoder.encode("Admin@123")
                );

                admin.setRole("ADMIN");

                userRepository.save(admin);

                System.out.println("=================================");
                System.out.println("ADMIN ACCOUNT CREATED");
                System.out.println("Email: " + adminEmail);
                System.out.println("Password: Admin@123");
                System.out.println("Role: ADMIN");
                System.out.println("=================================");

            } else {
                System.out.println("Admin account already exists.");
            }
        };
    }
}