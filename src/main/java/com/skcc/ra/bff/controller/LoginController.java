package com.skcc.ra.bff.controller;

import com.skcc.ra.bff.dto.JwtResponse;
import com.skcc.ra.bff.dto.LoginDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

@Controller
@Slf4j
public class LoginController {

    private final WebClient webClient;

    public LoginController(@Value("${app.api.gateway-url}") String gatewayUrl) {
        this.webClient = WebClient.builder()
                .baseUrl(gatewayUrl)
                .build();
    }

    @GetMapping("/login")
    public String loginForm(Model model) {
        model.addAttribute("loginDto", new LoginDto());
        return "login";
    }

    @PostMapping("/login")
    public String login(@ModelAttribute LoginDto loginDto, HttpSession session, Model model) {
        try {
            // 👇 실제 응답을 문자열로 먼저 확인
            String rawResponse = webClient.post()
                    .uri("/api/v1/com/account/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(BodyInserters.fromValue(loginDto))
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            log.info("🧾 Raw JWT Response: {}", rawResponse);

            // 👉 JSON 파싱 재시도
            JwtResponse jwt = new ObjectMapper().readValue(rawResponse, JwtResponse.class);

            if (jwt == null || jwt.getAccessToken() == null) {
                throw new RuntimeException("Login failed: JWT is null");
            }

            session.setAttribute("ACCESS_TOKEN", jwt.getAccessToken());
            return "redirect:/dashboard";

        } catch (Exception e) {
            log.error("Login failed: {}", e.getMessage());
            model.addAttribute("error", "Login failed. Please check your credentials.");
            return "login";
        }
    }
}
