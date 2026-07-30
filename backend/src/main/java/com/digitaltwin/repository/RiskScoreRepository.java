package com.digitaltwin.repository;

import com.digitaltwin.model.RiskScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface RiskScoreRepository extends JpaRepository<RiskScore, UUID> {
    List<RiskScore> findByServiceId(String serviceId);
}
