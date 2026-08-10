package com.civicpulse.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.civicpulse.backend.entity.Department;
import com.civicpulse.backend.repository.DepartmentRepository;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Optional<Department> getDepartmentById(Long id) {
        return departmentRepository.findById(id);
    }

    public Optional<Department> getDepartmentByUserId(Long userId) {
        return departmentRepository.findByUserId(userId);
    }

    public Department updateDepartment(Long id, Department updatedDepartment) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));

        department.setDepartmentName(updatedDepartment.getDepartmentName());
        department.setPhone(updatedDepartment.getPhone());
        department.setLocation(updatedDepartment.getLocation());
        if (updatedDepartment.getUserId() != null) {
            department.setUserId(updatedDepartment.getUserId());
        }

        return departmentRepository.save(department);
    }

    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }
}
