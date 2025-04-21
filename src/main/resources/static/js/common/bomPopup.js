class BomPopup {
    
    constructor(settings) {
        this._type = settings.type;
        this.api = settings.api ?? $;
        this.isMultiple = settings.isMultiple ?? true;
        this.onConfirm = settings.onConfirm;
    }

    open() {
        this.loadGrid();
        layerOpen(this.popupElement);
    }

    close() {
        this.initSearchForm();
        layerClose(this.popupElement);
    }

    // create popup template
    _initTemplate(template) {

        const self = this;
        
        document.body.insertAdjacentHTML('beforeend', template);

        const popupElement = document.body.getElementsByClassName('popup')[document.body.getElementsByClassName('popup').length - 1];
        this.popupElement = popupElement;

        const confirm = popupElement.querySelector('button[data-button="confirm"]');
        const cancel = popupElement.querySelector('button[data-button="cancel"]');
        const close = popupElement.getElementsByClassName(self._type + 'PopupClose')[0];
        const search = popupElement.querySelector('button[data-button="search"]');

        confirm.onclick = function() {
            self._onPopupConfirm();
        }
        
        const inputs = popupElement.querySelectorAll('.cell__content--search input[type=text]');
        for(let input of inputs) {
            input.addEventListener('keyup', function(e){
                if(e.keyCode === 13) {
                    e.preventDefault();
                    self.loadGrid();
                }
            });
        }
        search.onclick = function() {
            self.loadGrid();
        }

        const onCancel = () => {
            if(!self.flexgrid) return;
            
            for(let row of self.flexgrid.rows) {
                row.isSelected = false;
            }
            self.flexgrid.refresh();
            self.close();
        }
        cancel.onclick = function() { onCancel(); }
        close.onclick = function() { onCancel(); }

    }

    _initGrid(columns) {
        const self = this;

        const flexgrid = skepStdWijmo.flexGrid.init(this.popupElement.getElementsByClassName(self._type + 'Grid')[0], {
            isReadOnly: true,
            columns,
            selectionMode: self.isMultiple ? 'Row' : 'Cell'
        });

        if(this.isMultiple) {
            skepStdWijmo.flexGrid.rowChecker(flexgrid);
        }
        flexgrid.hostElement.addEventListener('dblclick', function(e) {
            e.preventDefault();
            self._onPopupConfirm();
        });
        this.flexgrid = flexgrid;
    }

    _onPopupConfirm() {
        const self = this;

        if(self.onConfirm) {
            self.onConfirm(self.flexgrid.selectedItems);
        }
        self.close();
    }
}

/**
 * 사업장 조회 팝업
 */
class BizPopup extends BomPopup {
    constructor(settings) {

        super({...settings, type: 'biz'});

        const template = `<div class="popup bizPopup">
            <div class="popup__wrap">
                <div class="popup__header">
                    <h2>사업장 조회</h2>
                    <button class="ico__close bizPopupClose"><span class="blind">닫기</span></button>
                </div>
                <div class="popup__content">
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content--search">
                                <div class="grid--cols-2">
                                    <div class="grid__cell--w-80">
                                        <div class="form--cols-1">
                                            <div class="form__group">
                                                <strong>검색</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="searchText" autocomplete="off">
                                                        <button class="clear__button"><i class="ico__close"></i></button>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid__cell">
                                        <div class="form--button">
                                            <div class="button__group">
                                                <button data-button="search" class="btn--primary">조회</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content">
                                <div class="bizGrid"></div>
                                <div class="button__group--center">
                                    <button data-button="confirm" class="btn--lg--primary">확인</button>
                                    <button data-button="cancel" class="btn__close btn--lg--outline--gray-500">취소</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        const columns = [
            { binding: 'bizCd', header: '사업장 코드', width: '*' },
            { binding: 'bizNm', header: '사업장명', width: '2*' },
        ];

        super._initTemplate(template);
        super._initGrid(columns);
        this.loadGrid();
    }

    loadGrid() {
        
        const self = this;
        const searchParam = new URLSearchParams({
            searchText: this.popupElement.querySelector('input[name=searchText]').value
        });

        this.api.ajax({
            url: '/bom/popup/bizs?' + searchParam.toString(),
            type: 'GET',
            progressElement: self.popupElement.querySelector('.' + self._type + 'Grid')
        }).done(function(res) {

            if(res.responseCode === 'SUCCESS') {
                self.flexgrid.itemsSource.sourceCollection = res.result;
                self.flexgrid.select(-1, -1);
            } else {
                skep.ui.msg.alertError('오류가 발생하였습니다.');
            }
        });
    }

    initSearchForm() {

        this.popupElement.querySelector('input[name=searchText]').value = '';
    }
}

/**
 * 처리장 팝업
 */
class DispPopup extends BomPopup {
    constructor(settings) {

        super({...settings, type: 'disp'});

        const template = `<div class="popup dispPopup">
            <div class="popup__wrap" style="width: 60%;">
                <div class="popup__header">
                    <h2>처리장 조회</h2>
                    <button class="ico__close dispPopupClose"><span class="blind">닫기</span></button>
                </div>
                <div class="popup__content">
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content--search">
                                <div class="grid--cols-2">
                                    <div class="grid__cell--w-80">
                                        <div class="form--cols-2">
                                            <div class="form__group">
                                                <strong>사업소</strong>
                                                <div>
                                                    <p>
                                                        <select name="bizSelect">
                                                            <option value="all">전체</option>
                                                        </select>
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="form__group">
                                                <strong>프로젝트</strong>
                                                <div>
                                                    <p>
                                                        <select name="pjtSelect">
                                                            <option value="all">전체</option>
                                                        </select>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid__cell">
                                        <div class="form--button">
                                            <div class="button__group">
                                                <button data-button="search" class="btn--primary">조회</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content">
                                <div class="dispGrid"></div>
                                <div class="button__group--center">
                                    <button data-button="confirm" class="btn--lg--primary">확인</button>
                                    <button data-button="cancel" class="btn__close btn--lg--outline--gray-500">취소</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        const columns = [
            { binding: 'bizCd', header: '사업소 코드', width: 100 },
            { binding: 'bizNm', header: '사업소 명', width: '*' },
            { binding: 'pjtCd', header: '프로젝트 코드', width: 130 },
            { binding: 'pjtNm', header: '프로젝트 명', width: '*' },
            { binding: 'dispCd', header: '처리장 코드', width: 130 },
            { binding: 'dispNm', header: '처리장명', width: '*' },
        ];

        super._initTemplate(template);
        super._initGrid(columns);
        this.loadSelectData();
    }

    loadSelectData() {

        const self = this;
        
        this.api.ajax({
            url: '/bom/popup/bizs',
            type: 'GET'
        }).done(function(res) {

            if(res.responseCode === 'SUCCESS') {
                
                const bizSelect = self.popupElement.querySelector('select[name=bizSelect]');
                for(let biz of res.result) {
                    bizSelect.appendChild(new Option(biz.bizNm, biz.bizCd));
                }
            }
        });

        this.api.ajax({
            url: '/bom/popup/projects',
            type: 'GET'
        }).done(function(res) {

            const pjtSelect = self.popupElement.querySelector('select[name=pjtSelect]');
            
            for(let project of res.result) {
                pjtSelect.appendChild(new Option(project.pjtNm, project.pjtCd));
            }
        })
        
    }

    loadGrid() {

        const self = this;
        
        const bizCd = self.popupElement.querySelector('select[name=bizSelect]').value;
        const pjtCd = self.popupElement.querySelector('select[name=pjtSelect]').value;

        const searchParam = new URLSearchParams({
            bizCd: bizCd === 'all' ? '' : bizCd,
            pjtCd: pjtCd === 'all' ? '' : pjtCd
        });

        this.api.ajax({
            url: '/bom/popup/disps?' + searchParam.toString(),
            type: 'GET',
            progressElement: self.popupElement.querySelector('.' + self._type + 'Grid')
        }).done(function(res) {

            if(res.responseCode === 'SUCCESS') {
                self.flexgrid.itemsSource.sourceCollection = res.result;
                self.flexgrid.select(-1, -1);
            } else {
                skep.ui.msg.alertError('오류가 발생하였습니다.');
            }
        });
    }

    initSearchForm() {

        $('.dispPopup select[name=bizSelect]').val('all').trigger('change');
        $('.dispPopup select[name=pjtSelect]').val('all').trigger('change');
    }
}

/**
 *  담당자 팝업
 */
class ManagerPopup extends BomPopup {
    constructor(settings) {

        super({...settings, type: 'manager'});
        
        const template = `<div class="popup managerPopup">
            <div class="popup__wrap">
                <div class="popup__header">
                    <h2>담당자 조회</h2>
                    <button class="ico__close managerPopupClose"><span class="blind">닫기</span></button>
                </div>
                <div class="popup__content">
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content--search">
                                <div class="grid--cols-2">
                                    <div class="grid__cell--w-80">
                                        <div class="form--cols-3">
                                        <div class="form__group">
                                            <strong>재직구분</strong>
                                            <div>
                                                <p>
                                                    <input id="managerPopup_wkseY" type="radio" name="wkSe" value="Y">
                                                    <label for="managerPopup_wkseY">재직</label>
                                                    <input id="managerPopup_wkseAll" type="radio" name="wkSe" value="all" checked>
                                                    <label for="managerPopup_wkseAll">전체</label>
                                                </p>
                                            </div>
                                        </div>
                                            <div class="form__group--x2">
                                                <strong>검색</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="searchText" autocomplete="off">
                                                        <button class="clear__button"><i class="ico__close"></i></button>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid__cell">
                                        <div class="form--button">
                                            <div class="button__group">
                                                <button data-button="search" class="btn--primary">조회</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content">
                                <div class="managerGrid"></div>
                                <div class="button__group--center">
                                    <button data-button="confirm" class="btn--lg--primary">확인</button>
                                    <button data-button="cancel" class="btn__close btn--lg--outline--gray-500">취소</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        const columns = [
            { binding: 'asgDeptNm', header: '부서명', width: '*' },
            { binding: 'empNo', header: '사원번호', width: '*' },
            { binding: 'empNm', header: '성명', width: '*' },
        ];

        super._initTemplate(template);
        super._initGrid(columns);
    }
    
    loadGrid() {

        const self = this;

        const wkSe = this.popupElement.querySelector('input[name=wkSe]:checked').value === 'all' ? '' : this.popupElement.querySelector('input[name=wkSe]:checked').value;
        const searchParam = new URLSearchParams({
            wkSe,
            searchText: this.popupElement.querySelector('input[name=searchText]').value
        });

        this.api.ajax({
            url: '/bom/popup/managers?' + searchParam.toString(),
            type: 'GET',
            progressElement: self.popupElement.querySelector('.' + self._type + 'Grid')
        }).done(function(res) {

            if(res.responseCode === 'SUCCESS') {
                self.flexgrid.itemsSource.sourceCollection = res.result;
                self.flexgrid.select(-1, -1);
            } else {
                skep.ui.msg.alertError('오류가 발생하였습니다.');
            }
        });
    }

    initSearchForm() {

        document.getElementById('managerPopup_wkseY').checked = false;
        document.getElementById('managerPopup_wkseAll').checked = true;
        this.popupElement.querySelector('input[name=searchText]').value = '';
    }
}

/**
 *  프로젝트 팝업
 */
class ProjectPopup extends BomPopup {
    constructor(settings) {
        
        super({...settings, type: 'project'});
        
        const template = `<div class="popup projectPopup">
            <div class="popup__wrap">
                <div class="popup__header">
                    <h2>프로젝트 조회</h2>
                    <button class="ico__close projectPopupClose"><span class="blind">닫기</span></button>
                </div>
                <div class="popup__content">
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content--search">
                                <div class="grid--cols-2">
                                    <div class="grid__cell--w-80">
                                        <div class="form--cols-2">
                                            <div class="form__group">
                                                <strong>상태</strong>
                                                <div>
                                                    <p>
                                                        <select name="statusSelect">
                                                            <option value=''>전체</option>
                                                        </select>
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="form__group">
                                                <strong>검색</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="searchText" autocomplete="off">
                                                        <button class="clear__button"><i class="ico__close"></i></button>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid__cell">
                                        <div class="form--button">
                                            <div class="button__group">
                                                <button data-button="search" class="btn--primary">조회</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content">
                                <div class="projectGrid"></div>
                                <div class="button__group--center">
                                    <button data-button="confirm" class="btn--lg--primary">확인</button>
                                    <button data-button="cancel" class="btn__close btn--lg--outline--gray-500">취소</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        const columns = [
            { binding: 'prgsStsNm', header: '진행상태', width: '*' },
            { binding: 'pjtCd', header: '프로젝트코드', width: '*' },
            { binding: 'pjtNm', header: '프로젝트명', width: '*' },
            { binding: 'ordfNm', header: '발주처', width: '*' },
            // { binding: '', header: '영업부서', width: '*' },
            // { binding: '', header: 'PM부서', width: '*' },
            // { binding: '', header: 'PM', width: '*' },
        ];

        super._initTemplate(template);
        super._initGrid(columns);
        const self = this;
        self.loadSelectData().then(()=> {
            self.initSearchForm();
        }, () => {
            skep.ui.msg.alertError('오류가 발생 하였습니다.');
        });
    }

    loadGrid() {

        const self = this;

        const searchParam = new URLSearchParams({
            status: self.popupElement.querySelector('select[name=statusSelect]').value,
            searchText: self.popupElement.querySelector('input[name=searchText]').value
        });

        this.api.ajax({
            url: '/bom/popup/projects?' + searchParam.toString(),
            type: 'GET',
            progressElement: self.popupElement.querySelector('.' + self._type + 'Grid')
        }).done(function(res) {

            if(res.responseCode === 'SUCCESS') {
                self.flexgrid.itemsSource.sourceCollection = res.result;
                self.flexgrid.select(-1, -1);
            } else {
                skep.ui.msg.alertError('오류가 발생하였습니다.');
            }
        });
    }

    initSearchForm() {
        $('.projectPopup select[name=statusSelect]').val('01')?.trigger('change');
        this.popupElement.querySelector('input[name=searchText]').value = '';
    }

    loadSelectData() {

        const self = this;
        const data = {
            cdCl: 'PRGS_STS'
        }
        return new Promise((resolve, reject) => {
            self.api.ajax({
                url: "/scm/api/findsystemcodelistbycdcl",
                type: 'GET',
                data,
            }).done(function(res) {
                if (res.responseCode == 'SUCCESS') {
                    const statusSelect = self.popupElement.querySelector('select[name=statusSelect]');

                    for(let status of res.result) {
                        statusSelect.appendChild(new Option(status.cdNm, status.cd));
                    }
                    resolve();
                } else {
                    reject();
                }
            })
        })
    }
}

/**
 *  슬러지 거래처 팝업
 */
class SlVendorPopup extends BomPopup {
    constructor(settings) {
        
        super({...settings, type: 'slVendor'});

        const template = `<div class="popup slVendorPopup">
            <div class="popup__wrap">
                <div class="popup__header">
                    <h2>슬러지 거래처 조회</h2>
                    <button class="ico__close slVendorPopupClose"><span class="blind">닫기</span></button>
                </div>
                <div class="popup__content">
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content--search">
                                <div class="grid--cols-2">
                                    <div class="grid__cell--w-80">
                                        <div class="form--cols-1">
                                            <div class="form__group">
                                                <strong>검색</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="searchText" autocomplete="off">
                                                        <button class="clear__button"><i class="ico__close"></i></button>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid__cell">
                                        <div class="form--button">
                                            <div class="button__group">
                                                <button data-button="search" class="btn--primary">조회</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content">
                                <div class="slVendorGrid"></div>
                                <div class="button__group--center">
                                    <button data-button="confirm" class="btn--lg--primary">확인</button>
                                    <button data-button="cancel" class="btn__close btn--lg--outline--gray-500">취소</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;

        const columns = [
            { binding: 'vdCd', header: '협력업체', width: '*' },
            { binding: 'vdNm', header: '협력업체명', width: '*' },
            { binding: 'vdEngNm', header: 'Company Name', width: '*', visible: false },
            { binding: 'reprsNm', header: '대표자', width: '*' },
            { binding: 'compSeNm', header: '기업구분', width: 80, align: 'center' },
            { binding: 'bizRegNo', header: '사업자등록번호', width: '*', align:'center', cellTemplate: (ctx) => ctx.text && formatBizRegNo(ctx.text) },
        ];

        super._initTemplate(template);
        super._initGrid(columns);
    }

    loadGrid() {

        const self = this;

        const searchParam = new URLSearchParams({
            searchText: this.popupElement.querySelector('input[name=searchText]').value
        });

        this.api.ajax({
            url: '/bom/popup/slVendors?' + searchParam.toString(),
            type: 'GET',
            progressElement: self.popupElement.querySelector('.' + self._type + 'Grid')
        }).done(function(res) {

            if(res.responseCode === 'SUCCESS') {
                self.flexgrid.itemsSource.sourceCollection = res.result;
                self.flexgrid.select(-1, -1);
            } else {
                skep.ui.msg.alertError('오류가 발생하였습니다.');
            }
        });
    }

    initSearchForm() {

        this.popupElement.querySelector('input[name=searchText]').value = '';
    }
}

/**
 *  약품 거래처 팝업
 */
class CmVendorPopup extends BomPopup {
    constructor(settings) {

        super({...settings, type: 'cmVendor'});

        const template = `<div class="popup cmVendorPopup">
            <div class="popup__wrap">
                <div class="popup__header">
                    <h2>약품 거래처 조회</h2>
                    <button class="ico__close cmVendorPopupClose"><span class="blind">닫기</span></button>
                </div>
                <div class="popup__content">
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content--search">
                                <div class="grid--cols-2">
                                    <div class="grid__cell--w-80">
                                        <div class="form--cols-1">
                                            <div class="form__group">
                                                <strong>검색</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="searchText" autocomplete="off">
                                                        <button class="clear__button"><i class="ico__close"></i></button>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid__cell">
                                        <div class="form--button">
                                            <div class="button__group">
                                                <button data-button="search" class="btn--primary">조회</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content">
                                <div class="cmVendorGrid"></div>
                                <div class="button__group--center">
                                    <button data-button="confirm" class="btn--lg--primary">확인</button>
                                    <button data-button="cancel" class="btn__close btn--lg--outline--gray-500">취소</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        const columns = [
            { binding: 'vdCd', header: '협력업체', width: 100 },
            { binding: 'vdNm', header: '협력업체명', width: '*' },
            { binding: 'vdEngNm', header: 'Company Name', visible: false },
            { binding: 'reprsNm', header: '대표자', width: 100 },
            { binding: 'compSeNm', header: '기업구분', width: 80, align: 'center' },
            { binding: 'bizRegNo', header: '사업자등록번호', width: 130, align:'center', cellTemplate: (ctx) => ctx.text && formatBizRegNo(ctx.text) },
        ];

        super._initTemplate(template);
        super._initGrid(columns);
    }

    loadGrid() {

        const self = this;

        const searchParam = new URLSearchParams({
            searchText: this.popupElement.querySelector('input[name=searchText]').value
        });

        this.api.ajax({
            url: '/bom/popup/cmVendors?' + searchParam.toString(),
            type: 'GET',
            progressElement: self.popupElement.querySelector('.' + self._type + 'Grid')
        }).done(function(res) {

            if(res.responseCode === 'SUCCESS') {
                self.flexgrid.itemsSource.sourceCollection = res.result;
                self.flexgrid.select(-1, -1);
            } else {
                skep.ui.msg.alertError('오류가 발생하였습니다.');
            }
        });
    }

    initSearchForm() {

        this.popupElement.querySelector('input[name=searchText]').value = '';
    }
}

/**
 *  약품 자재 팝업
 */
class CmPopup extends BomPopup {
    constructor(settings) {

        super({...settings, type: 'cm'});
        
        const template = `<div class="popup cmPopup">
            <div class="popup__wrap">
                <div class="popup__header">
                    <h2>약품 자재 조회</h2>
                    <button class="ico__close cmPopupClose"><span class="blind">닫기</span></button>
                </div>
                <div class="popup__content" style="max-height: 80vh;">
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content--search">
                                <div class="grid--cols-2">
                                    <div class="grid__cell--w-80">
                                        <div class="form--cols-3">
                                            <div class="form__group">
                                                <strong>자재코드</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="cmCd" autocomplete="off">
                                                        <button class="clear__button"><i class="ico__close"></i></button>
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="form__group">
                                                <strong>자재명</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="cmNm" autocomplete="off">
                                                        <button class="clear__button"><i class="ico__close"></i></button>
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="form__group">
                                                <strong>자재분류</strong>
                                                <div>
                                                    <p>
                                                        <select name="clCd">
                                                            <option value="all">전체</option>
                                                        </select>
                                                        <button class="clear__button"><i class="ico__close"></i></button>
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="form__group">
                                                <strong>재질</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="prodInf" autocomplete="off">
                                                        <button class="clear__button"><i class="ico__close"></i></button>
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="form__group">
                                                <strong>규격</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="spec" autocomplete="off">
                                                        <button class="clear__button"><i class="ico__close"></i></button>
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="form__group">
                                                <strong>단위</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="unit" autocomplete="off">
                                                        <button class="clear__button"><i class="ico__close"></i></button>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid__cell">
                                        <div class="form--button">
                                            <div class="button__group">
                                                <button data-button="search" class="btn--primary">조회</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content">
                                <div class="cmGrid"></div>
                                <div class="button__group--center">
                                    <button data-button="confirm" class="btn--lg--primary">확인</button>
                                    <button data-button="cancel" class="btn__close btn--lg--outline--gray-500">취소</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        const columns = [
            { binding: 'clNm', header: '약품분류', width: '*' },
            { binding: 'cmCd', header: '자재코드', width: 100 },
            { binding: 'cmNm', header: '자재명', width: 220 },
            { binding: 'prodInf', header: '재질', width: '*' },
            { binding: 'spec', header: '규격', width: 100 },
            { binding: 'unit', header: '단위', width: 100, align: 'center'},
            // { binding: 'cntrtNo', header: '계약번호', width: '*' },
            // { binding: 'applStYmd', header: '계약기간(From)', width: 120, align: 'center', cellTemplate: (ctx) => ctx.text && ctx.text.length === 8 ? ctx.text.slice(0, 4) + '-' + ctx.text.slice(4, 6) + '-' + ctx.text.slice(6, 8) : '' },
            // { binding: 'applEdYmd', header: '계약기간(To)', width: 120, align: 'center', cellTemplate: (ctx) => ctx.text && ctx.text.length === 8 ? ctx.text.slice(0, 4) + '-' + ctx.text.slice(4, 6) + '-' + ctx.text.slice(6, 8) : '' },
        ];

        super._initTemplate(template);
        super._initGrid(columns);
        this.loadSelectData();
    }


    loadSelectData() {

        const self = this;
        
        this.api.ajax({
            url: '/bom/popup/find-cmcl-types',
            type: 'GET'
        }).done(function(res) {

            if(res.responseCode === 'SUCCESS') {
                
                const bizSelect = self.popupElement.querySelector('select[name=clCd]');
                for(let cmCl of res.result) {
                    bizSelect.appendChild(new Option(cmCl.clNm, cmCl.clCd));
                }
            }
        });
    }

    loadGrid() {

        const self = this;
        const clCd = self.popupElement.querySelector('select[name=clCd]').value;

        const searchParam = new URLSearchParams({
            cmCd: self.popupElement.querySelector('input[name=cmCd]').value,
            cmNm: self.popupElement.querySelector('input[name=cmNm]').value,
            clCd: clCd === 'all' ? '' : clCd,
            prodInf: self.popupElement.querySelector('input[name=prodInf]').value,
            spec: self.popupElement.querySelector('input[name=spec]').value,
            unit: self.popupElement.querySelector('input[name=unit]').value,
        });

        this.api.ajax({
            url: '/bom/popup/chemicals?' + searchParam.toString(),
            type: 'GET',
            progressElement: self.popupElement.querySelector('.' + self._type + 'Grid')
        }).done(function(res) {

            if(res.responseCode === 'SUCCESS') {
                self.flexgrid.itemsSource.sourceCollection = res.result;
                self.flexgrid.select(-1, -1);
            } else {
                skep.ui.msg.alertError('오류가 발생하였습니다.');
            }
        });
    }

    initSearchForm() {

        this.popupElement.querySelector('input[name=cmCd]').value = '';
        this.popupElement.querySelector('input[name=cmNm]').value = '';
        $('.cmPopup select[name=clCd]').val('all').trigger('change');
        this.popupElement.querySelector('input[name=prodInf]').value = '';
        this.popupElement.querySelector('input[name=spec]').value = '';
        this.popupElement.querySelector('input[name=unit]').value = '';
    }
}

/**
 * SAP 연계 거래처 조회 팝업
 */
class SapVendorPopup extends BomPopup {
    constructor(settings) {
        
        super({...settings, type: 'sapBiz'});
        
        const template = `<div class="popup sapBizPopup">
            <div class="popup__wrap" style="width: 100%;">
                <div class="popup__header">
                    <h2>SAP 연계 거래처 조회</h2>
                    <button class="ico__close sapBizPopupClose"><span class="blind">닫기</span></button>
                </div>
                <div class="popup__content">
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content--search">
                                <div class="grid--cols-2">
                                    <div class="grid__cell--w-80">
                                        <div class="form--cols-4">
                                            <div class="form__group">
                                                <strong>회계업체 코드</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="fiVdCd" autocomplete="off">
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="form__group">
                                                <strong>회계업체명</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="fiVdNm" autocomplete="off">
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="form__group">
                                                <strong>대표자</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="reprsNm" autocomplete="off">
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid__cell">
                                        <div class="form--button">
                                            <div class="button__group">
                                                <button data-button="search" class="btn--primary">조회</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content">
                                <div class="sapBizGrid"></div>
                                <div class="button__group--center">
                                    <button data-button="confirm" class="btn--lg--primary">확인</button>
                                    <button data-button="cancel" class="btn__close btn--lg--outline--gray-500">취소</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        const columns = [
            { binding: 'fiVdCd', header: '회계업체 코드', width: 150 },
            { binding: 'fiVdNm', header: '회계업체명', width: 180 },
            { binding: 'fiCustCd', header: '회계거래처 코드', width: 110, visible: false },
            { binding: 'bizRegNo', header: '사업자번호', width: 160, align: 'center', cellTemplate: (ctx) => ctx.text && formatBizRegNo(ctx.text) },
            { binding: 'reprsNm', header: '대표자명', width: 120 },
            { binding: 'bizCond', header: '업태', width: 130 },
            { binding: 'bizKind', header: '업종', width: 130 },
            { binding: 'zipCd', header: '우편번호', width: 100 },
            { binding: 'addr', header: '주소1', width: '*' },
            { binding: 'addrDt', header: '주소2', width: '*' },
            { binding: 'telNo', header: '전화번호', width: 110 },
            { binding: 'faxNo', header: '팩스번호', width: 110 },
        ];

        super._initTemplate(template);
        super._initGrid(columns);
    }

    loadGrid() {

        const self = this;
        
        const searchParam = new URLSearchParams({
            fiVdCd: self.popupElement.querySelector('input[name=fiVdCd]').value,
            fiVdNm: self.popupElement.querySelector('input[name=fiVdNm]').value,
            reprsNm: self.popupElement.querySelector('input[name=reprsNm]').value,
        });

        this.api.ajax({
            url: '/bom/popup/sapVendors?' + searchParam.toString(),
            type: 'GET',
            progressElement: self.popupElement.querySelector('.' + self._type + 'Grid')
        }).done(function(res) {

            if(res.responseCode === 'SUCCESS') {
                self.flexgrid.itemsSource.sourceCollection = res.result;
                self.flexgrid.select(-1, -1);
            } else {
                skep.ui.msg.alertError('오류가 발생하였습니다.');
            }
        });
    }

    initSearchForm() {

        this.popupElement.querySelector('input[name=fiVdCd]').value = '';
        this.popupElement.querySelector('input[name=fiVdNm]').value = '';
        this.popupElement.querySelector('input[name=reprsNm]').value = '';
    }
}

/**
 * 비용부담금 거래처 조회 팝업
 */
class CbVendorPopup extends BomPopup {
    constructor(settings) {
        
        super({...settings, type: 'cbVendor'});

        const template = `<div class="popup cbVendorPopup">
            <div class="popup__wrap" style="width: 100%;">
                <div class="popup__header">
                    <h2>비용부담금 거래처 조회</h2>
                    <button class="ico__close cbVendorPopupClose"><span class="blind">닫기</span></button>
                </div>
                <div class="popup__content" style="max-height: unset;">
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content--search">
                                <div class="grid--cols-2">
                                    <div class="grid__cell--w-80">
                                        <div class="form--cols-4">
                                            <div class="form__group">
                                                <strong>관리번호</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="vwMangNo" autocomplete="off">
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="form__group">
                                                <strong>프로젝트 코드</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="pjtCd" autocomplete="off">
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="form__group">
                                                <strong>프로젝트명</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="pjtNm" autocomplete="off">
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="form__group"></div>
                                            <div class="form__group">
                                                <strong>회계업체 코드</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="fiVdCd" autocomplete="off">
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="form__group">
                                                <strong>회계업체명</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="fiVdNm" autocomplete="off">
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="form__group">
                                                <strong>업체명</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="vdNm" autocomplete="off">
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="form__group">
                                                <strong>대표자명</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="reprsNm" autocomplete="off">
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid__cell">
                                        <div class="form--button">
                                            <div class="button__group">
                                                <button data-button="search" class="btn--primary">조회</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content">
                                <div class="cbVendorGrid"></div>
                                <div class="button__group--center">
                                    <button data-button="confirm" class="btn--lg--primary">확인</button>
                                    <button data-button="cancel" class="btn__close btn--lg--outline--gray-500">취소</button>
                                </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        const columns = [
            { binding: 'mangNo', header: '관리번호', width: 80, align: 'center', visible: false },
            { binding: 'vwMangNo', header: '관리번호', width: 80, align: 'center' },
            { binding: 'pjtCd', header: '프로젝트 코드', width: 110, align: 'center' },
            { binding: 'pjtNm', header: '프로젝트명', width: 150 },
            { binding: 'fiVdCd', header: '회계업체코드', width: 130 },
            { binding: 'fiVdNm', header: '회계업체명', width: 150 },
            { binding: 'vdNm', header: '업체명', width: 150 },
            { binding: 'reprsNm', header: '대표자명', width: 110 },
            { binding: 'bizRegNo', header: '사업자번호', width: 120, align: 'center', cellTemplate: (ctx) => ctx.text && formatBizRegNo(ctx.text) },
            { binding: 'bizCond', header: '업태', width: 110 },
            { binding: 'bizKind', header: '업종', width: 110 },
            { binding: 'bizZipNo', header: '사업자주소 우편번호', width: 130 },
            { binding: 'bizAddr', header: '사업자 주소', width: '*' },
            { binding: 'reprsTelNo', header: '전화번호', width: 110 },
        ];

        super._initTemplate(template);
        super._initGrid(columns);
    }

    loadGrid() {

        const self = this;
        
        const searchParam = new URLSearchParams({
            vwMangNo: self.popupElement.querySelector('input[name=vwMangNo]').value,
            fiVdCd: self.popupElement.querySelector('input[name=fiVdCd]').value,
            fiVdNm: self.popupElement.querySelector('input[name=fiVdNm]').value,
            pjtCd: self.popupElement.querySelector('input[name=pjtCd]').value,
            pjtNm: self.popupElement.querySelector('input[name=pjtNm]').value,
            vdNm: self.popupElement.querySelector('input[name=vdNm]').value,
            reprsNm: self.popupElement.querySelector('input[name=reprsNm]').value,
        });

        this.api.ajax({
            url: '/bom/popup/cbVendors?' + searchParam.toString(),
            type: 'GET',
            progressElement: self.popupElement.querySelector('.' + self._type + 'Grid')
        }).done(function(res) {

            if(res.responseCode === 'SUCCESS') {
                self.flexgrid.itemsSource.sourceCollection = res.result;
                self.flexgrid.select(-1, -1);
            } else {
                skep.ui.msg.alertError('오류가 발생하였습니다.');
            }
        });
    }

    initSearchForm() {

        this.popupElement.querySelector('input[name=vwMangNo]').value = '';
        this.popupElement.querySelector('input[name=fiVdCd]').value = '';
        this.popupElement.querySelector('input[name=fiVdNm]').value = '';
        this.popupElement.querySelector('input[name=pjtCd]').value = '';
        this.popupElement.querySelector('input[name=pjtNm]').value = '';
        this.popupElement.querySelector('input[name=vdNm]').value = '';
        this.popupElement.querySelector('input[name=reprsNm]').value = '';
    }
}

/* 세금계산서 조회 팝업 */
class TaxPopup extends BomPopup {
    constructor(settings) {

        super({...settings, type: 'tax'});

        this.taxNo = settings?.taxNo;

        const template = `<div class="popup taxPopup">
                <div class="popup__wrap" style="width: 90%;">
                    <div class="popup__header">
                        <h2>전자세금계산서 조회</h2>
                        <button class="ico__close taxPopupClose"><span class="blind">닫기</span></button>
                    </div>
                    <div class="popup__content">
                        <div class="grid--full">
                            <div class="grid__cell">
                                <div class="cell__content--search">
                                    <div class="grid--cols-2">
                                        <div class="grid__cell--w-80">
                                            <div class="form--cols-4">
                                                <div class="form__group">
                                                    <strong>검색</strong>
                                                    <div>
                                                        <p>
                                                            <input type="text" name="date" class="datepicker__range">
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="grid__cell">
                                            <div class="form--button">
                                                <div class="button__group">
                                                    <button data-button="search" class="btn--primary">조회</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="grid--full">
                            <div class="grid__cell">
                                <div class="cell__content">
                                    <div class="taxGrid"></div>
                                    <div class="button__group--center">
                                        <button data-button="confirm" class="btn--lg--primary">확인</button>
                                        <button data-button="cancel" class="btn__close btn--lg--outline--gray-500">취소</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

        const columns = [
            { binding: 'bilnum', header: '계산서 번호', width: 150, align: 'center' },
            { binding: 'biltit', header: '제목', width: '2*', align: 'left' },
            { binding: 'ownchacod', header: '소속부서', width: '*', align: 'center' },
            { binding: 'ownempidn', header: '담당자 사번', width: '*', align: 'center' },
            { binding: 'vennam', header: '거래처명', width: '*', align: 'left' },
            { binding: 'wridat', header: '발급일자', width: '*', align: 'center', cellTemplate: (ctx) => formatDateToView(ctx.text) },
            { binding: 'supamo', header: '공급가액', width: '*', align: 'right' },
            { binding: 'vatamo', header: '세액', width: '*', align: 'right' },
            { binding: 'tot', header: '합계금액', width: '*', align: 'right' },
            { binding: 'chacod', header: '귀속부서', width: '*', align: 'center' },
            { binding: 'vencod', header: '사업자번호', width: '*', align: 'center', cellTemplate: (ctx) => ctx.text && formatBizRegNo(ctx.text) },
            { binding: 'presidnam', header: '거래처대표자', width: '*', align: 'center' },
            { binding: 'venadr', header: '주소', visible: false },
            { binding: 'ventyp', header: '업태', visible: false },
            { binding: 'venite', header: '업종', visible: false },
            { binding: 'bilrem', header: '비고', visible: false },
        ];

        super._initTemplate(template);
        super._initGrid(columns);

        const $dateInput = $(this.popupElement).find('input[name=date]');
        $dateInput.daterangepicker($.extend(options, {
            singleDatePicker: false,
        }));
        $dateInput.on('apply.daterangepicker', function(ev, picker) {
            $dateInput.val(picker.startDate.format('YYYY-MM-DD')+' ~ '+picker.endDate.format('YYYY-MM-DD'));
        });
        $dateInput.on('cancel.daterangepicker', function(ev, picker) {
            $dateInput.val('');
        });

        this.initSearchForm();
        // this.loadGrid();
    }

    loadGrid() {
        const self = this;
        const $dateInput = $(this.popupElement).find('input[name=date]');

        const data = {
            "vencod": this.taxNo,
            "f_wridat": $dateInput.val() ? $dateInput.val().split(' ~ ')[0] : '',
            "t_wridat": $dateInput.val() ? $dateInput.val().split(' ~ ')[1] : ''
        }

        this.api.ajax({
            url: '/bom/popup/taxs?',
            type: 'GET',
            data,
            progressElement: self.popupElement.querySelector('.' + self._type + 'Grid')
        }).done(function(res) {
            if(res.responseCode === 'SUCCESS') {
                self.flexgrid.itemsSource.sourceCollection = res.result;
                self.flexgrid.select(-1, -1);
            } else {
                skep.ui.msg.alertError('오류가 발생하였습니다.');
            }
        });
    }

    initSearchForm() {

        const startDate = new Date().firstdayyyyymmdd();
        const endDate = new Date().yyyymmdd();

        const $dateInput = $(this.popupElement).find('input[name=date]');
        $dateInput.data('daterangepicker').setStartDate(startDate);
        $dateInput.data('daterangepicker').setEndDate(endDate);
        $dateInput.val(`${startDate} ~ ${endDate}`);
    }
}

/**
 *  은행 계좌 조회팝업
 */
class FiVdBactPopup extends BomPopup {
    constructor(settings) {

        super({...settings, type: 'fiVdBact'});

        this.fiVdCd = settings?.fiVdCd;

        const template = `<div class="popup fiVdBactPopup">
            <div class="popup__wrap">
                <div class="popup__header">
                    <h2>은행 계좌 조회</h2>
                    <button class="ico__close fiVdBactPopupClose"><span class="blind">닫기</span></button>
                </div>
                <div class="popup__content">
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content--search">
                                <div class="grid--cols-2">
                                    <div class="grid__cell--w-80">
                                        <div class="form--cols-1">
                                        <div class="form__group">
                                                <strong>검색</strong>
                                                <div>
                                                    <p>
                                                        <input type="text" name="searchText">
                                                        <button class="clear__button"><i class="ico__close"></i></button>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="grid__cell">
                                        <div class="form--button">
                                            <div class="button__group">
                                                <button data-button="search" class="btn--primary">조회</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid--full">
                        <div class="grid__cell">
                            <div class="cell__content">
                                <div class="fiVdBactGrid"></div>
                                <div class="button__group--center">
                                    <button data-button="confirm" class="btn--lg--primary">확인</button>
                                    <button data-button="cancel" class="btn__close btn--lg--outline--gray-500">취소</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
        const columns = [
            { binding: 'bankNm', header: '은행명', width: '*' },
            { binding: 'bactNo', header: '계좌번호', width: '*' },
            { binding: 'sapBactCd', header: '은행계좌ID', width: '*' },
            { binding: 'bactHldr', header: '예금주', width: '*' },
            { binding: 'majTrnsYn', header: '주계좌여부', width: '*', align: 'center' }
        ];

        super._initTemplate(template);
        super._initGrid(columns);
    }

    loadGrid() {

        const self = this;

        const searchParam = new URLSearchParams({
            fiVdCd: this.fiVdCd,
            searchText: this.popupElement.querySelector('input[name=searchText]').value
        });

        this.api.ajax({
            url: '/bom/popup/fiVdBact?' + searchParam.toString(),
            type: 'GET',
            progressElement: self.popupElement.querySelector('.' + self._type + 'Grid')
        }).done(function(res) {

            if(res.responseCode === 'SUCCESS') {
                self.flexgrid.itemsSource.sourceCollection = res.result;
                self.flexgrid.select(-1, -1);
            } else {
                skep.ui.msg.alertError('오류가 발생하였습니다.');
            }
        });
    }

    initSearchForm() {

        this.popupElement.querySelector('input[name=searchText]').value = '';
    }
}

// 사업자등록번호 하이픈 처리
function formatBizRegNo(str) {
    str = str.replace(/[^0-9]/g, '');
    let tmp = '';
    if ( str.length < 4){
        return str;
    } else if(str.length < 6){
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3);
        return tmp;
    } else if(str.length < 11){
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 2);
        tmp += '-';
        tmp += str.substr(5);
        return tmp;
    }

    return str;
}

// daterangepicker
var options = {
    locale: {
        separator: ' ~ ',
        applyLabel: '확인',
        cancelLabel: '취소',
        format: 'YYYY-MM-DD',
        monthNames: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
        daysOfWeek: ['일', '월', '화', '수', '목', '금', '토'],
    },
    //	autoApply: true,
    autoUpdateInput: false,
    singleDatePicker: true,
    showDropdowns: true,
    linkedCalendars: false,
}