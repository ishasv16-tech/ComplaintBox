package com.complaintbox.controller;

import com.complaintbox.dto.ComplaintDtos.Status;
import com.complaintbox.entity.Staff;
import com.complaintbox.entity.StaffRole;
import com.complaintbox.repository.ComplaintRepository;
import com.complaintbox.repository.ResidentRepository;
import com.complaintbox.repository.StaffRepository;
import com.complaintbox.service.AuthService;
import com.complaintbox.service.ComplaintService;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.*;

@RestController
@RequestMapping("/api/warden")
public class WardenController {

    private final ComplaintService complaintService;
    private final AuthService authService;
    private final StaffRepository staffRepository;
    private final ResidentRepository residentRepository;
    private final ComplaintRepository complaintRepository;

    public WardenController(
            ComplaintService complaintService,
            AuthService authService,
            StaffRepository staffRepository,
            ResidentRepository residentRepository,
            ComplaintRepository complaintRepository) {

        this.complaintService = complaintService;
        this.authService = authService;
        this.staffRepository = staffRepository;
        this.residentRepository = residentRepository;
        this.complaintRepository = complaintRepository;
    }

    // =========================
    // DASHBOARD
    // =========================

    @GetMapping("/dashboard")
    public Object dashboard(HttpSession session) {

        authService.staffId(session);

        return complaintService.dashboard();
    }

    // =========================
    // ALL COMPLAINTS
    // =========================

    @GetMapping("/complaints")
    public Object complaints(HttpSession session) {

        authService.staffId(session);

        return complaintService.allMapped();
    }

    // =========================
    // UPDATE COMPLAINT
    // =========================

    @PatchMapping("/complaints/{id}")
    public Object update(
            @PathVariable Long id,
            @RequestBody Status status,
            HttpSession session) {

        return complaintService.map(
                complaintService.update(
                        authService.staffId(session),
                        id,
                        status
                )
        );
    }

    // =========================
    // STAFF LIST
    // =========================

    @GetMapping("/staff")
    public Object staffList(HttpSession session) {

        authService.staffId(session);

        return staffRepository.findAll();
    }

    // =========================
    // ADD STAFF
    // =========================

    @PostMapping("/staff")
    public Object addStaff(
            @RequestBody Map<String, String> data,
            HttpSession session) {

        authService.staffId(session);

        Staff staff = new Staff(
                data.get("name"),
                data.getOrDefault("phone", data.get("email")),
                "",
                data.getOrDefault("specialty", "General"),
                StaffRole.MAINTENANCE
        );

        staff.setPhone(data.get("phone"));
        staff.setActive(true);

        return staffRepository.save(staff);
    }

    // =========================
    // ENABLE / DISABLE STAFF
    // =========================

    @PatchMapping("/staff/{id}")
    public Object toggleStaff(
            @PathVariable Long id,
            @RequestBody Map<String, Object> data,
            HttpSession session) {

        authService.staffId(session);

        Staff staff = staffRepository.findById(id)
                .orElseThrow();

        staff.setActive(
                Boolean.TRUE.equals(data.get("active"))
        );

        return staffRepository.save(staff);
    }

    // =========================
    // STUDENTS
    // =========================

    @GetMapping("/students")
    public Object students(HttpSession session) {

        authService.staffId(session);

        List<Map<String, Object>> result = new ArrayList<>();

        residentRepository.findAll().forEach(resident -> {

            Map<String, Object> student = new LinkedHashMap<>();

            student.put("id", resident.getId());
            student.put("name", resident.getName());
            student.put("email", resident.getEmail());

            student.put(
                    "studentId",
                    Objects.toString(
                            resident.getResidentId(),
                            ""
                    )
            );

            student.put(
                    "roomNumber",
                    Objects.toString(
                            resident.getRoomNumber(),
                            ""
                    )
            );

            student.put(
                    "hostelBlock",
                    Objects.toString(
                            resident.getHostelBlock(),
                            ""
                    )
            );

            student.put(
                    "complaintCount",
                    complaintService
                            .mine(resident.getId())
                            .size()
            );

            result.add(student);
        });

        return result;
    }

    // =========================
    // ANALYTICS
    // =========================

    @GetMapping("/analytics")
    public Object analytics(HttpSession session) {

        authService.staffId(session);

        // Get complaints directly from the repository.
        // Do NOT use complaintService.repo because that field is null.
        var complaints = complaintRepository.findAll();

        List<Map<String, Object>> categories =
                count(complaints, "cat");

        List<Map<String, Object>> statuses =
                count(complaints, "status");

        List<Map<String, Object>> blocks =
                count(complaints, "block");

        double averageResolutionDays =
                averageResolutionDays(complaints);

        Map<String, Object> result =
                new LinkedHashMap<>();

        result.put("categories", categories);
        result.put("statuses", statuses);
        result.put("blocks", blocks);
        result.put("timeline", List.of());
        result.put(
                "averageResolutionDays",
                averageResolutionDays
        );

        return result;
    }

    // =========================
    // COUNT ANALYTICS
    // =========================

    private List<Map<String, Object>> count(
            List<com.complaintbox.entity.Complaint> complaints,
            String type) {

        Map<String, Integer> counts =
                new HashMap<>();

        for (var complaint : complaints) {

            String key;

            // CATEGORY
            if (type.equals("cat")) {

                if (complaint.getCategory() != null) {

                    key = complaint
                            .getCategory()
                            .getName();

                } else {

                    key = "Other";
                }

                // HOSTEL BLOCK
            } else if (type.equals("block")) {

                key = complaint.getHostelBlock();

                if (key == null || key.isBlank()) {
                    key = "Unknown";
                }

                // STATUS
            } else {

                if (complaint.getStatus() != null) {

                    key = complaint
                            .getStatus()
                            .name()
                            .toLowerCase();

                } else {

                    key = "unknown";
                }
            }

            counts.put(
                    key,
                    counts.getOrDefault(key, 0) + 1
            );
        }

        List<Map<String, Object>> result =
                new ArrayList<>();

        counts.entrySet()
                .stream()
                .sorted(
                        (a, b) ->
                                b.getValue()
                                        - a.getValue()
                )
                .forEach(entry -> {

                    Map<String, Object> item =
                            new LinkedHashMap<>();

                    item.put(
                            "name",
                            entry.getKey()
                    );

                    item.put(
                            "value",
                            entry.getValue()
                    );

                    result.add(item);
                });

        return result;
    }

    // =========================
    // AVERAGE RESOLUTION TIME
    // =========================

    private double averageResolutionDays(
            List<com.complaintbox.entity.Complaint> complaints) {

        double average =
                complaints.stream()

                        .filter(
                                c ->
                                        c.getResolvedAt()
                                                != null
                        )

                        .mapToDouble(
                                c ->
                                        Duration.between(
                                                        c.getCreatedAt(),
                                                        c.getResolvedAt()
                                                )
                                                .toMinutes()
                                                / 1440.0
                        )

                        .average()

                        .orElse(0);

        return Math.round(
                average * 10
        ) / 10.0;
    }
}