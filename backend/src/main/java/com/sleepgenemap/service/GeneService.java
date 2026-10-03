package com.sleepgenemap.service;

import com.sleepgenemap.model.Gene;
import com.sleepgenemap.repository.GeneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GeneService {

    private final GeneRepository geneRepository;

    @Transactional(readOnly = true)
    public List<Gene> getAllGenes() {
        return geneRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Gene> getGeneById(Long id) {
        return geneRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Gene> getGeneBySymbol(String symbol) {
        return geneRepository.findBySymbolIgnoreCase(symbol);
    }

    @Transactional(readOnly = true)
    public List<Gene> searchGenes(String query) {
        return geneRepository.searchGenes(query);
    }
}
