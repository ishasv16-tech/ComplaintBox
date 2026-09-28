package com.complaintbox.config;

import com.complaintbox.entity.*;
import com.complaintbox.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.util.List;

@Configuration
@EnableScheduling
public class DataInitializer {

    @Bean
    CommandLineRunner seed(
            CategoryRepository categories,
            StaffRepository staff,
            PasswordEncoder encoder) {

        return args -> {

            List<String> categoryNames = List.of(
                    "Electrical",
                    "Plumbing",
                    "Water",
                    "Cleaning",
                    "Furniture",
                    "Internet",
                    "Bathroom",
                    "Room Maintenance",
                    "Food",
                    "Garden",
                    "Other"
            );

            for (String name : categoryNames) {
                if (categories.findByName(name).isEmpty()) {
                    categories.save(new Category(name));
                }
            }

            if (staff.findByEmail("warden@hostel.com").isEmpty()) {
                Staff w = new Staff(
                        "Hostel Warden",
                        "warden@hostel.com",
                        encoder.encode("warden123"),
                        "Hostel Operations",
                        StaffRole.WARDEN
                );
                staff.save(w);
            }

            if (staff.findByEmail("maintenance@hostel.com").isEmpty()) {
                Staff m = new Staff(
                        "Maintenance Staff",
                        "maintenance@hostel.com",
                        encoder.encode("staff123"),
                        "General Maintenance",
                        StaffRole.MAINTENANCE
                );
                staff.save(m);
            }
        };
    }
}