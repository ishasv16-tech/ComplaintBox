package com.complaintbox;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.concurrent.TimeUnit;

@SpringBootApplication
@EnableScheduling
public class ComplaintBoxApplication {

    public static void main(String[] args) {
        SpringApplication.run(ComplaintBoxApplication.class, args);
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CommandLineRunner openBrowser() {

        return args -> {

            Thread.startVirtualThread(() -> {

                try {

                    // Wait for Spring Boot to start
                    TimeUnit.SECONDS.sleep(2);

                    // Open the website using Windows
                    new ProcessBuilder(
                            "cmd",
                            "/c",
                            "start",
                            "",
                            "http://localhost:8080"
                    ).start();

                    System.out.println(
                            "Opening ComplaintBox in browser..."
                    );

                } catch (Exception e) {

                    System.out.println(
                            "Could not open browser automatically."
                    );

                    e.printStackTrace();
                }
            });
        };
    }
}