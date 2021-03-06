package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.service.ExamService;
import com.mycompany.myapp.service.dto.ExamDTO;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Exam}.
 */
@RestController
@RequestMapping("/api")
public class ExamResource {

    private final Logger log = LoggerFactory.getLogger(ExamResource.class);

    private static final String ENTITY_NAME = "exam";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ExamService examService;

    public ExamResource(ExamService examService) {
        this.examService = examService;
    }

    /**
     * {@code POST  /exams} : Create a new exam.
     *
     * @param examDTO the examDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new examDTO, or with status {@code 400 (Bad Request)} if the exam has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/exams")
    public ResponseEntity<ExamDTO> createExam(@RequestBody ExamDTO examDTO) throws URISyntaxException {
        log.debug("REST request to save Exam : {}", examDTO);
        if (examDTO.getId() != null) {
            throw new BadRequestAlertException("A new exam cannot already have an ID", ENTITY_NAME, "idexists");
        }
        ExamDTO result = examService.save(examDTO);
        return ResponseEntity
            .created(new URI("/api/exams/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /exams} : Updates an existing exam.
     *
     * @param examDTO the examDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated examDTO,
     * or with status {@code 400 (Bad Request)} if the examDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the examDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/exams")
    public ResponseEntity<ExamDTO> updateExam(@RequestBody ExamDTO examDTO) throws URISyntaxException {
        log.debug("REST request to update Exam : {}", examDTO);
        if (examDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        ExamDTO result = examService.save(examDTO);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, examDTO.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /exams} : Updates given fields of an existing exam.
     *
     * @param examDTO the examDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated examDTO,
     * or with status {@code 400 (Bad Request)} if the examDTO is not valid,
     * or with status {@code 404 (Not Found)} if the examDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the examDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/exams", consumes = "application/merge-patch+json")
    public ResponseEntity<ExamDTO> partialUpdateExam(@RequestBody ExamDTO examDTO) throws URISyntaxException {
        log.debug("REST request to update Exam partially : {}", examDTO);
        if (examDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }

        Optional<ExamDTO> result = examService.partialUpdate(examDTO);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, examDTO.getId()));
    }

    /**
     * {@code GET  /exams} : get all the exams.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of exams in body.
     */
    @GetMapping("/exams")
    public List<ExamDTO> getAllExams() {
        log.debug("REST request to get all Exams");
        return examService.findAll();
    }

    /**
     * {@code GET  /exams/:id} : get the "id" exam.
     *
     * @param id the id of the examDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the examDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/exams/{id}")
    public ResponseEntity<ExamDTO> getExam(@PathVariable String id) {
        log.debug("REST request to get Exam : {}", id);
        Optional<ExamDTO> examDTO = examService.findOne(id);
        return ResponseUtil.wrapOrNotFound(examDTO);
    }

    /**
     * {@code DELETE  /exams/:id} : delete the "id" exam.
     *
     * @param id the id of the examDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/exams/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable String id) {
        log.debug("REST request to delete Exam : {}", id);
        examService.delete(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
