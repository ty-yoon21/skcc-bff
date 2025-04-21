package com.skcc.ra.bff.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import com.skcc.ra.bff.dto.UserInfoDto;

@Data
//@JsonIgnoreProperties(ignoreUnknown = true)
public class JwtResponse {
    @JsonProperty("token")
    private String accessToken;

    @JsonProperty("type")
    private String tokenType;

    private String refreshToken;

    private UserInfoDto userInfo;

    private String resultCd;
    private String resultMsg;
}
