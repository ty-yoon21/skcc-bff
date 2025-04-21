package com.skcc.ra.bff.dto;

// com.skcc.ra.bff.mapper.MenuMapper
public class MenuMapper {
    public static MenuDto toDto(MenuIDto source) {
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
}
