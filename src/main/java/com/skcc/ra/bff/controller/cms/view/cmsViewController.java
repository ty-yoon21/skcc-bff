package com.skcc.ra.bff.controller.cms.view;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(path = "cms/view")
public class cmsViewController {

    @GetMapping("/boardManagement")
    public String viewBoardmanagement(HttpServletRequest request, Model model) {
        return "cms/boardManagement";
    }

    @GetMapping("/communityManagement")
    public String viewCommunitymanagement(HttpServletRequest request, Model model) {
        return "cms/communityManagement";
    }

    @GetMapping("/codeManagement")
    public String viewCodemanagement(HttpServletRequest request, Model model) {
        return "cms/codeManagement";
    }

    @GetMapping("/popupManagement")
    public String viewPopupmanagement(HttpServletRequest request, Model model) {
        return "cms/popupManagement";
    }

    @GetMapping("/permissionManagement")
    public String viewPermissionmanagement(HttpServletRequest request, Model model) {
        return "cms/permissionManagement";
    }

    @GetMapping("/menuManagement")
    public String viewMenumanagement(HttpServletRequest request, Model model) {
        return "cms/menuManagement";
    }

    @GetMapping("/smsManagement")
    public String viewSmsmanagement(HttpServletRequest request, Model model) {
        return "cms/smsManagement";
    }

    @GetMapping("/termsManagement")
    public String viewTermsmanagement(HttpServletRequest request, Model model) {
        return "cms/termsManagement";
    }

    @GetMapping("/courseCompletionStats")
    public String viewCoursecompletionstats(HttpServletRequest request, Model model) {
        return "cms/courseCompletionStats";
    }

    @GetMapping("/websiteVisitStats")
    public String viewWebsitevisitstats(HttpServletRequest request, Model model) {
        return "cms/websiteVisitStats";
    }

    @GetMapping("/learningActivityStats")
    public String viewLearningactivitystats(HttpServletRequest request, Model model) {
        return "cms/learningActivityStats";
    }

    @GetMapping("/dashboardStats")
    public String viewDashboardstats(HttpServletRequest request, Model model) {
        return "cms/dashboardStats";
    }

    @GetMapping("/educationStatusByPeriod")
    public String viewEducationstatusbyperiod(HttpServletRequest request, Model model) {
        return "cms/educationStatusByPeriod";
    }

    @GetMapping("/courseStats")
    public String viewCoursestats(HttpServletRequest request, Model model) {
        return "cms/courseStats";
    }

    @GetMapping("/instructorStats")
    public String viewInstructorstats(HttpServletRequest request, Model model) {
        return "cms/instructorStats";
    }

    @GetMapping("/courseApplicationStats")
    public String viewCourseapplicationstats(HttpServletRequest request, Model model) {
        return "cms/courseApplicationStats";
    }
} 