package com.skcc.ra.bff.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skcc.ra.bff.dto.MenuDto;
import com.skcc.ra.bff.service.MenuService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final MenuService menuService;

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
//        String accessToken = (String) session.getAttribute("ACCESS_TOKEN");
//        List<MenuDto> menuTree = menuService.fetchMenuTree(accessToken);
//
//        model.addAttribute("menuList", menuTree);
//        return "dashboard";
        String accessToken = (String) session.getAttribute("ACCESS_TOKEN");
        List<MenuDto> menuTree = menuService.fetchMenuTree(accessToken);

        try {
            ObjectMapper objectMapper = new ObjectMapper();
            String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(menuTree);
            log.info("🧾 Menu Tree JSON:\n{}", json);
        } catch (Exception e) {
            log.error("🔴 JSON 변환 오류", e);
        }

        model.addAttribute("menuList", menuTree);
        return "dashboard";
    }
}