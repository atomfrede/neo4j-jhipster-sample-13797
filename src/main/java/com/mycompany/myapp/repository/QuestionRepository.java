package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Question;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data Neo4j repository for the Question entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionRepository extends Neo4jRepository<Question, String> {}
