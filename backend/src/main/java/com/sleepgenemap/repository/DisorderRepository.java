package com.sleepgenemap.repository;

import com.sleepgenemap.model.Disorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DisorderRepository extends JpaRepository<Disorder, Long> {

    Optional<Disorder> findByNameIgnoreCase(String name);

    List<Disorder> findByCategoryIgnoreCase(String category);

    @Query("SELECT d FROM Disorder d WHERE LOWER(d.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(d.synonyms) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(d.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Disorder> searchDisorders(@Param("query") String query);
}
