package com.medicamentar.medicamentar_api.application.services;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.medicamentar.medicamentar_api.application.dtos.examDto.ExamRequest;
import com.medicamentar.medicamentar_api.application.dtos.examDto.ExamResponse;
import com.medicamentar.medicamentar_api.application.dtos.responsesDto.ServiceResponse;
import com.medicamentar.medicamentar_api.domain.entities.Exam;
import com.medicamentar.medicamentar_api.domain.repositories.ExamRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExamService {
    private final ExamRepository repository;

    public List<Exam> getAllexams() {
        return this.repository.findAll();
    }

    public ServiceResponse<ExamResponse> updateExam(UUID examId, ExamRequest examRequest) {
        ServiceResponse<ExamResponse> response = new ServiceResponse<>();
        Optional<Exam> optionalExam = this.repository.findById(examId);
        
        if (optionalExam.isPresent()) {
            Exam exam = optionalExam.get();
            exam.setDate(examRequest.date());
            exam.setName(examRequest.name());
            exam.setLocal(examRequest.local());
            exam.setDescription(examRequest.description());
            this.repository.save(exam);

            var examResponse = new ExamResponse(
                exam.getId(),
                exam.getDate(),
                exam.getName(),
                exam.getLocal(),
                exam.getDescription()
            );

            response.setData(examResponse);
            response.setMessage("Exam successfully updated");
            response.setStatus(HttpStatus.ACCEPTED);

            return response;
        } 
            response.setMessage("Unable to update the exam");
            response.setStatus(HttpStatus.BAD_REQUEST);
            
            return response;
    }

    public ServiceResponse<ExamResponse> registerExam(ExamRequest data) {
        ServiceResponse<ExamResponse> response = new ServiceResponse<>();
    
        if (data.date() == null || data.name() == null || data.local() == null) {
            response.setMessage("All fields must be provided");
            response.setStatus(HttpStatus.BAD_REQUEST);
            return response;
        }
    
        Optional<Exam> existingExam = this.repository.findByNameAndDate(data.name(), data.date());
        if (existingExam.isPresent()) {
            response.setMessage("An exam with the same name and date already exists");
            response.setStatus(HttpStatus.BAD_REQUEST);
            return response;
        }
    
        Exam newExam = new Exam();
        newExam.setDate(data.date());
        newExam.setName(data.name());
        newExam.setLocal(data.local());
        newExam.setDescription(data.description());
    
        Exam savedExam = this.repository.save(newExam);
        if (savedExam != null) {
            var examResponse = new ExamResponse(
                savedExam.getId(),
                savedExam.getDate(),
                savedExam.getName(),
                savedExam.getLocal(),
                savedExam.getDescription()
            );
    
            response.setData(examResponse);
            response.setMessage("Exam registered successfully");
            response.setStatus(HttpStatus.CREATED);

            return response;
        } 

            response.setMessage("Unable to register the exam");
            response.setStatus(HttpStatus.BAD_REQUEST);
    
        return response;
    }
    

    public ServiceResponse<String> deleteExam(UUID id) {
        ServiceResponse<String> response = new ServiceResponse<>();

        if (this.repository.existsById(id)) {
            this.repository.deleteById(id);
            response.setMessage("Exam deleted successfully");
            response.setStatus(HttpStatus.ACCEPTED);

            return response;
        } 
            response.setMessage("Exam not found");
            response.setStatus(HttpStatus.BAD_REQUEST);

            return response;
    }
}
