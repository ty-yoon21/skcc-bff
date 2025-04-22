package com.skcc.ra.bff.controller.intro.view;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(path = "intro/view")
public class introViewController {

    @GetMapping("/intGreetings")
    public String viewIntgreetings(HttpServletRequest request, Model model) {
        return "intro/intGreetings";
    }

    @GetMapping("/intHistory")
    public String viewInthistory(HttpServletRequest request, Model model) {
        return "intro/intHistory";
    }

    @GetMapping("/intDirections")
    public String viewIntdirections(HttpServletRequest request, Model model) {
        return "intro/intDirections";
    }

    @GetMapping("/intSchedule")
    public String viewIntschedule(HttpServletRequest request, Model model) {
        return "intro/intSchedule";
    }

    @GetMapping("/intCampusView")
    public String viewIntcampusview(HttpServletRequest request, Model model) {
        return "intro/intCampusView";
    }

    @GetMapping("/intDepartments")
    public String viewIntdepartments(HttpServletRequest request, Model model) {
        return "intro/intDepartments";
    }

    @GetMapping("/intVision")
    public String viewIntvision(HttpServletRequest request, Model model) {
        return "intro/intVision";
    }
} 