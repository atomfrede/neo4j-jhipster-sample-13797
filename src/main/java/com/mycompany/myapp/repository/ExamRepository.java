package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Exam;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data Neo4j repository for the Exam entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ExamRepository extends Neo4jRepository<Exam, String> {}
