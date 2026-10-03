package com.sleepgenemap.repository;

import com.sleepgenemap.model.Gene;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GeneRepository extends JpaRepository<Gene, Long> {

    Optional<Gene> findBySymbolIgnoreCase(String symbol);

    Optional<Gene> findByNcbiId(Long ncbiId);

    Optional<Gene> findByUniprotIdIgnoreCase(String uniprotId);

    @Query("SELECT g FROM Gene g WHERE LOWER(g.symbol) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(g.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(g.uniprotId) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR CAST(g.ncbiId AS string) LIKE CONCAT('%', :query, '%')")
    List<Gene> searchGenes(@Param("query") String query);
}
