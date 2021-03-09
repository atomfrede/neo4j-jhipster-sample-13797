package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Exam;
import com.mycompany.myapp.repository.ExamRepository;
import com.mycompany.myapp.service.dto.ExamDTO;
import com.mycompany.myapp.service.mapper.ExamMapper;
import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Service Implementation for managing {@link Exam}.
 */
@Service
public class ExamService {

    private final Logger log = LoggerFactory.getLogger(ExamService.class);

    private final ExamRepository examRepository;

    private final ExamMapper examMapper;

    public ExamService(ExamRepository examRepository, ExamMapper examMapper) {
        this.examRepository = examRepository;
        this.examMapper = examMapper;
    }

    /**
     * Save a exam.
     *
     * @param examDTO the entity to save.
     * @return the persisted entity.
     */
    public ExamDTO save(ExamDTO examDTO) {
        log.debug("Request to save Exam : {}", examDTO);
        Exam exam = examMapper.toEntity(examDTO);
        exam = examRepository.save(exam);
        return examMapper.toDto(exam);
    }

    /**
     * Partially update a exam.
     *
     * @param examDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<ExamDTO> partialUpdate(ExamDTO examDTO) {
        log.debug("Request to partially update Exam : {}", examDTO);

        return examRepository
            .findById(examDTO.getId())
            .map(
                existingExam -> {
                    if (examDTO.getTitle() != null) {
                        existingExam.setTitle(examDTO.getTitle());
                    }

                    return existingExam;
                }
            )
            .map(examRepository::save)
            .map(examMapper::toDto);
    }

    /**
     * Get all the exams.
     *
     * @return the list of entities.
     */
    public List<ExamDTO> findAll() {
        log.debug("Request to get all Exams");
        return examRepository.findAll().stream().map(examMapper::toDto).collect(Collectors.toCollection(LinkedList::new));
    }

    /**
     * Get one exam by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    public Optional<ExamDTO> findOne(String id) {
        log.debug("Request to get Exam : {}", id);
        return examRepository.findById(id).map(examMapper::toDto);
    }

    /**
     * Delete the exam by id.
     *
     * @param id the id of the entity.
     */
    public void delete(String id) {
        log.debug("Request to delete Exam : {}", id);
        examRepository.deleteById(id);
    }
}
