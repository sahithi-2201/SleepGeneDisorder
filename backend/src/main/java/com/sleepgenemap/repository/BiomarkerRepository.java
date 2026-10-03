package com.sleepgenemap.repository;

import com.sleepgenemap.model.Biomarker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BiomarkerRepository extends JpaRepository<Biomarker, Long> {

    Optional<Biomarker> findByNameIgnoreCase(String name);

    List<Biomarker> findByTypeIgnoreCase(String type);

    @Query("SELECT b FROM Biomarker b WHERE LOWER(b.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(b.type) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(b.sampleType) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(b.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Biomarker> searchBiomarkers(@Param("query") String query);
}
