package com.skcc.ra.bff.controller.guide.view;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(path = "guide/view")
public class guideViewController {

    @GetMapping("/guideStudentProcedure")
    public String viewGuidestudentprocedure(HttpServletRequest request, Model model) {
        return "guide/guideStudentProcedure";
    }

    @GetMapping("/guideCompletionCriteria")
    public String viewGuidecompletioncriteria(HttpServletRequest request, Model model) {
        return "guide/guideCompletionCriteria";
    }

    @GetMapping("/guideGuidelines")
    public String viewGuideguidelines(HttpServletRequest request, Model model) {
        return "guide/guideGuidelines";
    }

    @GetMapping("/guideAnnualPlan")
    public String viewGuideannualplan(HttpServletRequest request, Model model) {
        return "guide/guideAnnualPlan";
    }

    @GetMapping("/guideTrainingBasis")
    public String viewGuidetrainingbasis(HttpServletRequest request, Model model) {
        return "guide/guideTrainingBasis";
    }
} 