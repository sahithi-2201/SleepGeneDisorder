package com.sleepgenemap.repository;

import com.sleepgenemap.model.GeneDisorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeneDisorderRepository extends JpaRepository<GeneDisorder, Long> {
    List<GeneDisorder> findByGeneId(Long geneId);
    List<GeneDisorder> findByDisorderId(Long disorderId);
}
