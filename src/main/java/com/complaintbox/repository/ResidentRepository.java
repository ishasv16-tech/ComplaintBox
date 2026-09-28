package com.complaintbox.repository;
import com.complaintbox.entity.Resident; import org.springframework.data.jpa.repository.JpaRepository; import java.util.Optional;
public interface ResidentRepository extends JpaRepository<Resident,Long>{Optional<Resident> findByEmail(String email);}
