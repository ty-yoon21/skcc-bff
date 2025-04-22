package com.skcc.ra.bff.controller.apply.view;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(path = "apply/view")
public class applyViewController {

    @GetMapping("/applyCourseInfo")
    public String viewApplycourseinfo(HttpServletRequest request, Model model) {
        return "apply/applyCourseInfo";
    }

    @GetMapping("/applyLeaderCourse")
    public String viewApplyleadercourse(HttpServletRequest request, Model model) {
        return "apply/applyLeaderCourse";
    }

    @GetMapping("/applyRefereeCourse")
    public String viewApplyrefereecourse(HttpServletRequest request, Model model) {
        return "apply/applyRefereeCourse";
    }

    @GetMapping("/applyAdminCourse")
    public String viewApplyadmincourse(HttpServletRequest request, Model model) {
        return "apply/applyAdminCourse";
    }

    @GetMapping("/applyGeneralCourse")
    public String viewApplygeneralcourse(HttpServletRequest request, Model model) {
        return "apply/applyGeneralCourse";
    }

    @GetMapping("/applyAthleteCourse")
    public String viewApplyathletecourse(HttpServletRequest request, Model model) {
        return "apply/applyAthleteCourse";
    }
} 