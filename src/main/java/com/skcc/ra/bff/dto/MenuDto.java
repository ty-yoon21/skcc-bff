package com.skcc.ra.bff.dto;

import lombok.Data;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuDto {
    private String menuId;
    private String menuNm;
    private String  superMenuId;         // 👈 기존 parentMenuId에서 수정
    private String useYn;
    private Integer sortSeqn;

    private String screnId;
    private String screnNm;
    private String menuTypeCd;
    private String menuDesc;
    private String screnUrladdr;
    private String chrgTaskGroupCd;
    private String chrgTaskGroupNm;

    private Integer screnStartTopCodn;
    private Integer screnStartLeftCodn;
    private Integer screnWidthSize;
    private Integer screnVrtlnSize;
    private String screnClCd;
    private String screnSizeClCd;
    private String screnDesc;
    private String screnExcutClCd;
    private Integer menuStepVal;
    private String menuExpseYn;
    private String superMenuNm;

    private Integer shortcutSortSeqn;
    private String bookmarkYN;
    private String authYn;
    private String linkaSystmTagCntnt;

    private List<MenuDto> children = new ArrayList<>();
}

