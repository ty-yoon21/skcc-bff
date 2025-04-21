package com.skcc.ra.bff.dto;

import lombok.Data;
import java.util.List;

@Data
public class UserInfoDto {
    private String bsssmanm;         // 사업자명 (비어있음)
    private String userNm;           // 사용자명
    private String vctnNm;           // 직능명
    private List<String> roles;      // 역할 목록 (배열)
    private String reofoNm;          // 직책명
    private String useridStsCd;      // 사용자ID상태코드
    private String reofoCd;          // 직책코드
    private String deptNm;           // 부서명
    private String userid;           // 사용자ID
    private String vctnCd;           // 직능코드
    private String deptcd;           // 부서코드
    private String clofpNm;          // 직위명
    private String bssmacd;          // 사업부코드
    private String innerUserClCd;    // 내부사용자구분코드
    private String userIdentNo;      // 사용자식별번호
    private String clofpCd;          // 직위코드
    private String aplv;             // 승인여부 (추정)
    private String uslv;             // 사용여부 (추정)
}
