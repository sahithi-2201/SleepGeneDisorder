package com.sleepgenemap.service;

import com.sleepgenemap.model.Biomarker;
import com.sleepgenemap.repository.BiomarkerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BiomarkerService {

    private final BiomarkerRepository biomarkerRepository;

    @Transactional(readOnly = true)
    public List<Biomarker> getAllBiomarkers() {
        return biomarkerRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Biomarker> getBiomarkerById(Long id) {
        return biomarkerRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Biomarker> getBiomarkersByType(String type) {
        return biomarkerRepository.findByTypeIgnoreCase(type);
    }

    @Transactional(readOnly = true)
    public List<Biomarker> searchBiomarkers(String query) {
        return biomarkerRepository.searchBiomarkers(query);
    }
}
