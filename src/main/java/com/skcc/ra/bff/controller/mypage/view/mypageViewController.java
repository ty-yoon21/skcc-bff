package com.skcc.ra.bff.controller.mypage.view;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(path = "mypage/view")
public class mypageViewController {

    @GetMapping("/myLectureRoom")
    public String viewMylectureroom(HttpServletRequest request, Model model) {
        return "mypage/myLectureRoom";
    }

    @GetMapping("/myCourseInfoChange")
    public String viewMycourseinfochange(HttpServletRequest request, Model model) {
        return "mypage/myCourseInfoChange";
    }

    @GetMapping("/myFavoriteCourse")
    public String viewMyfavoritecourse(HttpServletRequest request, Model model) {
        return "mypage/myFavoriteCourse";
    }

    @GetMapping("/myCourseRecommendation")
    public String viewMycourserecommendation(HttpServletRequest request, Model model) {
        return "mypage/myCourseRecommendation";
    }

    @GetMapping("/myCertificateIssue")
    public String viewMycertificateissue(HttpServletRequest request, Model model) {
        return "mypage/myCertificateIssue";
    }

    @GetMapping("/myProfileEdit")
    public String viewMyprofileedit(HttpServletRequest request, Model model) {
        return "mypage/myProfileEdit";
    }
} 