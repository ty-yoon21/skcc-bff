package com.skcc.ra.bff.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.skcc.ra.bff.dto.MenuDto;
import com.skcc.ra.bff.dto.MenuIDto;
import com.skcc.ra.bff.dto.MenuIDtoImpl;

import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class MenuService {

    private final WebClient webClient;

    public MenuService(WebClient webClient) {
        this.webClient = webClient;
    }

    public List<MenuDto> fetchMenuTree(String accessToken) {
        try {
            List<Map<String, Object>> response = webClient.get()
                    .uri("/api/v1/com/common/menu/use")
                    .headers(h -> h.setBearerAuth(accessToken))
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<List<Map<String, Object>>>() {})
                    .block();

            if (response == null) return new ArrayList<>();

            // 수동 매핑
            List<MenuDto> flatList = response.stream()
                .map(this::convertMapToDto)
                .collect(Collectors.toList());

            return buildMenuTree(flatList);

        } catch (WebClientResponseException e) {
            log.error("WebClient error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("API 호출 실패: " + e.getMessage(), e);
        }
    }
    

    private MenuDto convertMapToDto(Map<String, Object> map) {
        MenuDto dto = new MenuDto();
        dto.setMenuId((String) map.get("menuId"));
        dto.setMenuNm((String) map.get("menuNm"));
        dto.setSuperMenuId((String) map.get("superMenuId"));
        dto.setUseYn((String) map.get("useYn"));
        dto.setSortSeqn(map.get("sortSeqn") != null ? Integer.parseInt(map.get("sortSeqn").toString()) : null);
        dto.setScrenId((String) map.get("screnId"));
        dto.setScrenNm((String) map.get("screnNm"));
        dto.setMenuTypeCd((String) map.get("menuTypeCd"));
        dto.setMenuDesc((String) map.get("menuDesc"));
        dto.setScrenUrladdr((String) map.get("screnUrladdr"));
        dto.setChrgTaskGroupCd((String) map.get("chrgTaskGroupCd"));
        dto.setChrgTaskGroupNm((String) map.get("chrgTaskGroupNm"));
        return dto;
    }    


    private Mono<? extends Throwable> handleWebClientError(ClientResponse response) {
        return response.bodyToMono(String.class)
                .flatMap(body -> {
                    log.error("WebClient error body: {}", body);
                    return Mono.error(new RuntimeException("API Error: " + body));
                });
    }    

    private MenuDto convertToDto(MenuIDto source) {
        MenuDto dto = new MenuDto();
        dto.setMenuId(source.getMenuId());
        dto.setMenuNm(source.getMenuNm());
        dto.setSuperMenuId(source.getSuperMenuId());
        dto.setUseYn(source.getUseYn());
        dto.setSortSeqn(source.getSortSeqn());
    
        dto.setScrenId(source.getScrenId());
        dto.setScrenNm(source.getScrenNm());
        dto.setMenuTypeCd(source.getMenuTypeCd());
        dto.setMenuDesc(source.getMenuDesc());
        dto.setScrenUrladdr(source.getScrenUrladdr());
        dto.setChrgTaskGroupCd(source.getChrgTaskGroupCd());
        dto.setChrgTaskGroupNm(source.getChrgTaskGroupNm());
    
        return dto;
    }

    private List<MenuDto> buildMenuTree(List<MenuDto> flatList) {
        Map<String, MenuDto> idToMenuMap = flatList.stream()
                .collect(Collectors.toMap(MenuDto::getMenuId, m -> m));

        List<MenuDto> rootList = new ArrayList<>();

        for (MenuDto menu : flatList) {
            String parentMenuId = Optional.ofNullable(menu.getSuperMenuId())
                    .map(String::trim)
                    .orElse(null);
            MenuDto parent = parentMenuId != null ? idToMenuMap.get(parentMenuId) : null;

            if (parent != null) {
                parent.getChildren().add(menu);
            } else {
                log.debug("🟡 Root or Unknown Parent: menuId={}, superMenuId={}", menu.getMenuId(), parentMenuId);
                rootList.add(menu);
            }
        }

        rootList.sort(Comparator.comparing(MenuDto::getSortSeqn, Comparator.nullsLast(Integer::compareTo)));
        return rootList;
    }

    // private List<MenuDto> buildMenuTree(List<MenuDto> flatList) {
    //     Map<String, MenuDto> idToMenuMap = flatList.stream()
    //             .collect(Collectors.toMap(MenuDto::getMenuId, m -> m));

    //     List<MenuDto> rootList = new ArrayList<>();

    //     for (MenuDto menu : flatList) {
    //         if (menu.getUpperMenuId() == null || menu.getUpperMenuId().isEmpty()) {
    //             rootList.add(menu);
    //         } else {
    //             MenuDto parent = idToMenuMap.get(menu.getUpperMenuId());
    //             if (parent != null) {
    //                 parent.getChildren().add(menu);
    //             }
    //         }
    //     }
    //     return rootList;
    // }
}
