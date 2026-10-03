package com.sleepgenemap.repository;

import com.sleepgenemap.model.DisorderBiomarker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DisorderBiomarkerRepository extends JpaRepository<DisorderBiomarker, Long> {
    List<DisorderBiomarker> findByDisorderId(Long disorderId);
    List<DisorderBiomarker> findByBiomarkerId(Long biomarkerId);
    Optional<DisorderBiomarker> findByDisorderIdAndBiomarkerId(Long disorderId, Long biomarkerId);
}
