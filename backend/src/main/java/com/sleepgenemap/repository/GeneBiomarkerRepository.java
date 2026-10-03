package com.sleepgenemap.repository;

import com.sleepgenemap.model.GeneBiomarker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GeneBiomarkerRepository extends JpaRepository<GeneBiomarker, Long> {
    List<GeneBiomarker> findByGeneId(Long geneId);
    List<GeneBiomarker> findByBiomarkerId(Long biomarkerId);
    Optional<GeneBiomarker> findByGeneIdAndBiomarkerId(Long geneId, Long biomarkerId);
}
