let cmRcvPopupFg1, cmRcvPopupFg2, vPjtCd, vVdCd;

// Modify getCmProjectSearchTemplate to insert the template directly into the DOM
function insertCmRcvPoSearchTemplate() {
    const template = getCmRcvPoSearchTemplate();
    document.body.insertAdjacentHTML('beforeend', template);
    //아래 source대로하면 충돌나기 때문에 insertAdjacentHTML사용
    //document.body.innerHTML += template; // Append the template to the body or a specific container
}
function getCmRcvPoSearchTemplate() {
    return `
    <div id="findCmRcvPopupLayer" class="popup">
        <div class="popup__wrap" style="width: 80%;">
            <div class="popup__header">
                <strong>약품 입고 등록 자재 선택</strong>
                <button class="ico__close" onclick="closeCmRcvPopupLayer();"><span class="blind">닫기</span></button>
            </div>
            <div class="popup__content" style="max-height: unset;">
                <div class="grid--full" style="margin-bottom: 0px; padding-bottom: 0px;">
                    <div class="grid__cell">
                        <div class="cell__content--search">
                            <div class="grid--cols-2">
                                <div class="grid__cell--w-80">
                                    <div class="form--cols-2">
                                        <div class="form__group">
                                            <strong>현장</strong>
                                            <div>
                                                <p>
                                                    <input type="text" id="searchbar-input-pjtNm_sb" maxlength="20" readonly/>
                                                </p>
                                            </div>
                                        </div>
                                        <div class="form__group">
                                            <strong>거래처</strong>
                                            <div>
                                                <p>
                                                    <input type="text" id="searchbar-input-vdNm_sb" maxlength="20" readonly/>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="grid__cell">
                                    <div class="form--button">
                                        <div class="button__group">
                                            <button type="button" class="btn--sm--primary" onclick="searchCmRcvPopupFg1();">조회</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid">
                    <div class="grid__cell--row">
                        <div class="grid__row">
                            <div class="cell__header">
                                <div class="title">
                                    <strong>발주 목록</strong>
                                </div>
                            </div>
                            <div class="cell__content">
                                <div id="cmRcvPopupFg1" style="height: 250px;"></div>
                            </div>
                            <div class="cell__header">
                                <div class="title">
                                    <strong>발주 상세</strong>
                                </div>
                                <div class="button__group">
                                    <button class="btn--sm--primary" onclick="confirm();">확인</button>
                                </div>
                            </div>
                            <div class="cell__content">
                                <div id="cmRcvPopupFg2" style="height: 300px;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// Close Find Layer
function closeCmRcvPopupLayer() {
    layerClose('findCmRcvPopupLayer');

}

// Open Find Layer
function openCmRcvPopupLayer(param) {

    cmRcvPopupFg1._cv.sourceCollection = [];
    cmRcvPopupFg2._cv.sourceCollection = [];
    
    layerOpen('findCmRcvPopupLayer');

    vPjtCd = param.pjtCd;
    vVdCd = param.vdCd;

    document.getElementById('searchbar-input-pjtNm_sb').value = param.pjtNm;
    document.getElementById('searchbar-input-vdNm_sb').value = param.vdNm;

    searchCmRcvPopupFg1();
}

function confirm() {
    if ( skepStdWijmo.flexGrid.getCheckedRow(cmRcvPopupFg2).length == 0 ) {
        skep.ui.msg.alertError('데이터를 선택해주세요.');
        return;
    }

    const checkedRows = skepStdWijmo.flexGrid.getCheckedRow(cmRcvPopupFg2);

    for(row of checkedRows) {

        if(row.dataItem.remainPoQty <= 0) {
            skep.ui.msg.alert('발주잔량이 없습니다.');
            return;
        }
    }

    this.cmRcvPopupConfirm();

    closeCmRcvPopupLayer();
}

function searchCmRcvPopupFg1(){

    let param = {
        pjtCd : vPjtCd,
        vdCd : vVdCd
    }

    api.ajax({
        url: contextPath + "/cm/api/cm-rcv-popup/find-fg1",
        type: 'GET',
        data: param,
        progressElement: document.getElementById('cmRcvPopupFg1'),
        success: function (res) {
            if (res.responseCode === 'SUCCESS') {
                cmRcvPopupFg1._cv.sourceCollection = res.result;

                if (res.result.length > 0) {
                    searchCmRcvPopupFg2(res.result[0].pjtCd, res.result[0].poNo);
                }
            }
        },
        error: function (res) {
            skep.ui.msg.alert('오류가 발생하였습니다.');
        }
    });

    //fg1._cv.sourceCollection = fgCmProjectPop1Data;

}

function searchCmRcvPopupFg2(strPjtCd, strPoNo){

    let param = {
        pjtCd : strPjtCd,
        poNo : strPoNo
    }

    api.ajax({
            url: contextPath + "/cm/api/cm-rcv-popup/find-fg2",
            type: 'GET',
            data: param,
            progressElement: document.getElementById('cmRcvPopupFg2'),
            success: function (res) {
                if (res.responseCode === 'SUCCESS') {
                    cmRcvPopupFg2._cv.sourceCollection = res.result.map(r => {
                        const addedQty = fg2.rows
                                        .filter(i => skepStdWijmo.flexGrid.isAddedRow(i) && ((i.dataItem.poNo == r.poNo) && (i.dataItem.poSn) == (r.poSn)))
                                        .reduce((acc, cur) => acc += Number(cur.dataItem.rcvQty), 0);

                        return {
                            ...r,
                            _remainPoQty: r.remainPoQty,
                            remainPoQty: r.remainPoQty - addedQty
                        };
                    });
                }
            },
            error: function (res) {
                skep.ui.msg.alert('오류가 발생하였습니다.');
            }
        });
}

function fgCmProjectPop1Confirm(){

    closeCmFindProjectLayer();
}

function initFg1Grid() {

    //--------------------------------------------E.P.1 fgCmProjectPop1 init - START--------------------------------------------//
    cmRcvPopupFg1 = skepStdWijmo.flexGrid.init('#cmRcvPopupFg1', {

        columns : [
            { binding: "", visible: false },  //empty colums
            { binding: 'pjtCd', header: '프로젝트코드', align: "center",  width: "1*", isReadOnly: true },
            { binding: 'pjtNm', header: '프로젝트명', align: "left",  width: "1.5*", isReadOnly: true },
            { binding: 'poNo', header: '발주번호', align: "center",  width: "1*", isReadOnly: true  },
            { binding: 'wrtYmd', header: '발주일자', align: "center",  width: 100, isReadOnly: true, cellTemplate:(ctx) => formatDateToView(ctx.text) },
            { binding: 'poNm', header: '발주명', align: "left",  width: "2*", isReadOnly: true },
            { binding: 'poAmt', header: '발주공급가', visible: true, align: "right", width: "1*", dataType: 2, isReadOnly: true },
            { binding: 'poVat', header: '발주부가세', visible: true, align: "right", width: "1*", dataType: 2, isReadOnly: true }
        ],
        selectionMode: "Row"

    });
    //--------------------------------------------E.P.1 fg1 init - END--------------------------------------------//

    //--------------------------------------------E.P.2 fg1 settings - END--------------------------------------------//
        cmRcvPopupFg1.addEventListener(cmRcvPopupFg1.hostElement, 'click', function(e){
            let h = cmRcvPopupFg1.hitTest(e);

            if (h.row === -1 || h.col === -1)
                return;

            let pjtCd = cmRcvPopupFg1.rows[h.row].dataItem.pjtCd;
            let poNo = cmRcvPopupFg1.rows[h.row].dataItem.poNo;
            //row change event
            searchCmRcvPopupFg2(pjtCd, poNo);
        });



    //--------------------------------------------E.P.2 fg1 settings - END--------------------------------------------//
}

function initFg2Grid() {

    //--------------------------------------------E.P.1 fg2 init - START--------------------------------------------//
    cmRcvPopupFg2 = skepStdWijmo.flexGrid.init('#cmRcvPopupFg2', {

        columns : [
            { binding: "", visible: false },  //empty colums
            { binding: 'cmCd', header: '약품코드', align: "center", width: 100, isReadOnly: true },
            { binding: 'cmNm', header: '약품명', align: "left", width: 100, isReadOnly: true },
            { binding: 'prodInf', header: '재질', align: "center", width: 130, isReadOnly: true },
            { binding: 'spec', header: '규격', align: "center", width: 70, isReadOnly: true },
            { binding: 'unit', header: '단위', align: "center", width: 70, isReadOnly: true },
            { binding: 'remainPoQty', header: '발주잔량', align: "right", width: 100, dataType: 2, isReadOnly: true },
            { binding: 'poPri', header: '단가', align: "right", width: 100, dataType: 2, isReadOnly: true },
            { binding: 'poAmt', header: '발주공급가', align: "right", width: 100, dataType: 2, isReadOnly: true },
            { binding: 'prNo', header: '청구번호', align: "center", width: 150, isReadOnly: true },
            { binding: 'poNo', header: '발주번호', align: "center", width: 150, isReadOnly: true },
            { binding: 'poSn', header: '발주순번', visible : false },
            { binding: 'poQty', header: '발주수량', align: "right", width: 100, dataType: 2, isReadOnly: true },
            { binding: 'rcvPlanYmd', header: '입고예정일', align: "center", width: 100, dataType: 2, isReadOnly: true, cellTemplate: (ctx) => formatDateToView(ctx.text) },
            { binding: 'rm', header: '비고', align: "left", width: 250, isReadOnly: true },
            { binding: 'usedRcvQty', visible: false }
        ],
        selectionMode: "MultiRange",  // "Row", "MultiRange"

    });
    //--------------------------------------------E.P.1 fg2 init - END--------------------------------------------//

    //--------------------------------------------E.P.2 fg2 settings - END--------------------------------------------//
    skepStdWijmo.flexGrid.rowChecker(cmRcvPopupFg2);

    //--------------------------------------------E.P.2 fg2 settings - END--------------------------------------------//
}


window.addEventListener('load', function() {
    insertCmRcvPoSearchTemplate();
    initFg1Grid();
    initFg2Grid();
});