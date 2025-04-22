package com.skcc.ra.bff.controller.notice.view;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import jakarta.servlet.http.HttpServletRequest;

@Controller
@RequestMapping(path = "notice/view")
public class noticeViewController {

    @GetMapping("/noticeList")
    public String viewNoticelist(HttpServletRequest request, Model model) {
        return "notice/noticeList";
    }

    @GetMapping("/noticeNews")
    public String viewNoticenews(HttpServletRequest request, Model model) {
        return "notice/noticeNews";
    }

    @GetMapping("/noticeResources")
    public String viewNoticeresources(HttpServletRequest request, Model model) {
        return "notice/noticeResources";
    }
} 