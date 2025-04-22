package com.skcc.ra.bff.controller.support.view;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(path = "support/view")
public class supportViewController {

    @GetMapping("/supportFAQ")
    public String viewSupportfaq(HttpServletRequest request, Model model) {
        return "support/supportFAQ";
    }

    @GetMapping("/supportWishContent")
    public String viewSupportwishcontent(HttpServletRequest request, Model model) {
        return "support/supportWishContent";
    }

    @GetMapping("/supportCommunity")
    public String viewSupportcommunity(HttpServletRequest request, Model model) {
        return "support/supportCommunity";
    }

    @GetMapping("/supportHelp")
    public String viewSupporthelp(HttpServletRequest request, Model model) {
        return "support/supportHelp";
    }
} 