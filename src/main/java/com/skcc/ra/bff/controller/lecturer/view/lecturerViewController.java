package com.skcc.ra.bff.controller.lecturer.view;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(path = "lecturer/view")
public class lecturerViewController {

    @GetMapping("/lecturerRegistration")
    public String viewLecturerregistration(HttpServletRequest request, Model model) {
        return "lecturer/lecturerRegistration";
    }

    @GetMapping("/lecturerRegistrationResult")
    public String viewLecturerregistrationresult(HttpServletRequest request, Model model) {
        return "lecturer/lecturerRegistrationResult";
    }
} 