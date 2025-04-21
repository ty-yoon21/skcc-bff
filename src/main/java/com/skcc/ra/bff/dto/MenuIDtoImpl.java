package com.skcc.ra.bff.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MenuIDtoImpl implements MenuIDto {
    private String menuId;
    private String chrgTaskGroupCd;
    private String menuTypeCd;
    private String menuNm;
    private String screnExcutClCd;
    private String menuDesc;
    private Integer menuStepVal;
    private Integer sortSeqn;
    private String useYn;
    private String menuExpseYn;
    private String superMenuId;
    private String superMenuNm;
    private String screnId;
    private String screnNm;
    private String screnDesc;
    private String screnUrladdr;
    private String screnClCd;
    private String screnSizeClCd;
    private Integer screnWidthSize;
    private Integer screnVrtlnSize;
    private Integer screnStartTopCodn;
    private Integer screnStartLeftCodn;
    private String linkaSystmTagCntnt;
    private Integer shortcutSortSeqn;
    private String bookmarkYN;
    private String authYn;
    private String chrgTaskGroupNm;
}
