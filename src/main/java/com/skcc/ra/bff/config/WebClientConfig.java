package com.skcc.ra.bff.config;

import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ExchangeFilterFunction;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.ClientRequest;


@Configuration
public class WebClientConfig {

    @Value("${app.api.gateway-url}")
    private String gatewayUrl;

    @Bean
    public WebClient webClient(HttpSession session) {
        return WebClient.builder()
                .baseUrl(gatewayUrl)
                .filter(authorizationFilter(session))
                .build();
    }

    private ExchangeFilterFunction authorizationFilter(HttpSession session) {
        return (request, next) -> {
            String token = (String) session.getAttribute("ACCESS_TOKEN");
            if (token != null) {
                return next.exchange(
                        ClientRequest.from(request)
                                .headers(headers -> headers.setBearerAuth(token))
                                .build()
                );
            }
            return next.exchange(request);
        };
    }
}
