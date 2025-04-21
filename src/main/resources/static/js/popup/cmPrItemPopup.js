let fgBomDeptPop1, fgCmPoParentNewItem1, fgCmPoParentNewItem2, index = 1;
let projectPopupInPop, cmVendorPopupInPopup;

// Close Find Project Layer
function closefindPoItemLayer() {
    layerClose('findPoItemLayer');
}

// Open Find Project Layer
function openfindPoItemLayer(fgParent1, fgParent2,i) {

    layerOpen('findPoItemLayer');
    
    //초기화 (Init Search Box Value)
    prYmdSbInit();
    $("#cm-po-cmNm-item").val('');
    $("#cm-po-cmCd-item").val('');
    $("#cm-po-prodInf-item").val('');
    $("#cm-po-spec-item").val('');
    $("#cm-po-pjtCd-item").val('');
    $("#cm-po-vdCd-item").val('');
    $("#cm-po-vdNm-item").val('');
    removeAllChildNodes(document.getElementById('cm-po-pjtCd-item'));
    document.getElementById('cm-po-pjtCd-item').appendChild(new Option('', ''));

    editStatus = true;
    
    searchPopFg1();
}


function searchPopFg1() {

    fgPrItemPop1._cv.sourceCollection = [];
    fgPrItemPop2._cv.sourceCollection = [];

    const options = document.querySelectorAll('#cm-po-pjtCd-item option');
    const pjtCds = Array.prototype.filter.call(options, opt => opt.value).map(opt => opt.value);

    let param = {
        pjtCds,
        cmNm: document.getElementById('cm-po-cmNm-item').value,
        cmCd: document.getElementById('cm-po-cmCd-item').value,
        prodInf: document.getElementById('cm-po-prodInf-item').value,
        specInf: document.getElementById('cm-po-spec-item').value,
        vdCd: document.getElementById('cm-po-vdCd-item').value,
        prYmdSt: $('#cm-po-prYmdRange-item').val() ? formatDateToSave($('#cm-po-prYmdRange-item').val().split(' ~ ')[0]) : null,
        prYmdEd: $('#cm-po-prYmdRange-item').val() ? formatDateToSave($('#cm-po-prYmdRange-item').val().split(' ~ ')[1]) : null,
    }
    api.ajax({
        url: contextPath + "/cm/api/cm-po/find-popup-fg1",
        type: 'GET',
        data: param,
        success: function (res) {
            if (res.responseCode == 'SUCCESS') {
                fgPrItemPop1._cv.sourceCollection = res.result;
                fgPrItemPop1.invalidate();
            } else {
                skep.ui.msg.alert('오류가 발생했습니다.');
            }
        },
        error: function (res) {
            skep.ui.msg.alert('오류가 발생했습니다.');
        }
    });
}

function isSingleValue(checkedItems){
    if(checkedItems.length === 0){
        return true;
    }
    let firstValue = checkedItems[0].dataItem.pjtCd;

    for(let i=1 ; i < checkedItems.length; i++){
        if(checkedItems[i].dataItem.pjtCd !== firstValue){
            return false;
        }
    }
    return true;
}

function fgPrItemPopupConfirm() {

    const checkedItems = skepStdWijmo.flexGrid.getCheckedRow(fgPrItemPop2);

    if (checkedItems.length == 0) {
        skep.ui.msg.alert('항목을 선택해주세요.', "msg.allUnchecked");
        return;
    }
    
    let priInfoChecked = skepStdWijmo.flexGrid.getCurrentItemJson(fgPrItemPop1);

    if (!priInfoChecked) {
        skep.ui.msg.alert('항목을 선택해주세요.', "msg.allUnchecked");
        return
    }
    if (!priInfoChecked.vdCd || priInfoChecked.vdCd === undefined || priInfoChecked.vdCd == '') {
        skep.ui.msg.alert("업체를 선택 바랍니다.");
        return;
    }

    let fg1DefaultValue, fg2DefaultValue;

    let valueInteIndiSe, valueInteIndiSeNm
    if(isSingleValue(checkedItems)){
        valueInteIndiSe = 'N';
        valueInteIndiSeNm = '개별';
    }else{
        valueInteIndiSe = 'Y';
        valueInteIndiSeNm = '통합';
    }

    fg1DefaultValue = {
        poYmd: '',
        wrtDept: asgDept,
        wrtDeptNm: asgDeptNm,
        wrtId,
        wrtSts: '01',
        wrtStsNm: '작성중',
        poSts: 'N',
        poStsNm:'진행중',
        // inteIndiSe: 'N',
        // inteIndiSeNm:'개별',
        inteIndiSe: valueInteIndiSe,
        inteIndiSeNm: valueInteIndiSeNm,
        wrtYmd: new moment().format('YYYYMMDD'),
        poNm: checkedItems[0].dataItem.prNm,
        pjtCd: checkedItems[0].dataItem.pjtCd,
        pjtNm: checkedItems[0].dataItem.pjtNm,
        vdCd: priInfoChecked.vdCd,
        vdNm: priInfoChecked.vdNm,
        deliYmd: checkedItems[0].dataItem.rcvPlanYmd,
        rcvPlanYmd: checkedItems[0].dataItem.rcvPlanYmd,
        vatInclYn: true,
    }
    skepStdWijmo.flexGrid.addRowWithParam(fg1, fg1DefaultValue);

    let fg2List = [];
    fg2._cv.sourceCollection = [];
    //fg2._cv.groupDescriptions.clear();
    for (let i = 0; i < checkedItems.length; i++) {
        fg2DefaultValue = {
            sn: index,
            pjtCd: checkedItems[i].dataItem.pjtCd,
            pjtNm: checkedItems[i].dataItem.pjtNm,
            vdCd: priInfoChecked.vdCd,
            vdNm: priInfoChecked.vdNm,
            cmCd: checkedItems[i].dataItem.cmCd,
            cmNm: checkedItems[i].dataItem.cmNm,
            inYn: 'N',
            prodInf: checkedItems[i].dataItem.prodInf,
            spec: checkedItems[i].dataItem.spec,
            unit: checkedItems[i].dataItem.unit,
            poQty: checkedItems[i].dataItem.prQty,
            deliYmd: checkedItems[i].dataItem.rcvPlanYmd,
            rcvPlanYmd: checkedItems[i].dataItem.rcvPlanYmd,
            poPri: checkedItems[i].dataItem.poPri,
            poAmt: checkedItems[i].dataItem.poAmt,
            poVat: checkedItems[i].dataItem.poVat,
            _poVat: checkedItems[i].dataItem.poVat,
            prQty: checkedItems[i].dataItem.prQty,
            prNo: checkedItems[i].dataItem.prNo,
            rm: checkedItems[i].dataItem.rm,
            prSn: checkedItems[i].dataItem.prSn,
            cmVdSeq: checkedItems[i].dataItem.cmVdSeq,
        }
        skepStdWijmo.flexGrid.addRowWithParam(fg2, fg2DefaultValue);
        index++;
        //fg2List.push();
    }





    let saveItemFg1 = skepStdWijmo.flexGrid.getChangedItems(fg1);
    let saveItemFg2 = skepStdWijmo.flexGrid.getChangedItems(fg2);
    
    let url = contextPath + "/cm/api/cm-po/save-fg1";   

    //if (!fg2validation()) return;


            saveItemFg1.itemsAdded.forEach(r => {
                r.vatInclYn = r.vatInclYn == true ? 'Y' : 'N';
            });
            saveItemFg1.itemsEdited.forEach(r => {
                r.vatInclYn = r.vatInclYn == true ? 'Y' : 'N';
            })

            jsonObject = {
                itemsAddedHeader: JSON.stringify(saveItemFg1.itemsAdded),
                itemsEditedHeader: JSON.stringify(saveItemFg1.itemsEdited),
                itemsRemovedHeader: JSON.stringify(saveItemFg1.itemsRemoved),
                itemsAddedDetail: JSON.stringify(saveItemFg2.itemsAdded),
                itemsEditedDetail: JSON.stringify(saveItemFg2.itemsEdited),
            }

            api.post(url, jsonObject, function (res) {
                if (res.responseCode === "SUCCESS") {
                    skep.ui.msg.alert('저장되었습니다.', "msg.saved");
                    searchCmPoHeader();
                } else {
                    i18nErrorMsg = 'msg.error.' + res.responseDetailedCode;
                    skep.ui.msg.alertError('오류가 발생하였습니다.');
                }
            });


    closefindPoItemLayer();
    fgPrItemPop1.refresh();
    fgPrItemPop2.refresh();
}

function initFgPoItemPop1Grid() {
    //Popup (Custom)
    customPopup();

    prYmdSbInit();
    //--------------------------------------------E.P.1 fgBomDeptPop1 init - START--------------------------------------------//
    fgPrItemPop1 = skepStdWijmo.flexGrid.init('#fgPrItemPop1', {

        columns: [
            { binding: "", visible: false },  //empty colums
            { binding: 'pjtCd', visible: false, },
            { binding: 'prNo', visible: false, },
            { binding: 'vdCd', header: '업체명', align: "center", width: "2*", isReadOnly: true, visible: false },
            { binding: 'vdNm', header: '거래처명', align: "left", width: "2*", isReadOnly: true },
            { binding: 'bizRegNo', header: '사업자번호', align: "center", width: "1*", isReadOnly: true, cellTemplate: (ctx) => ctx.text && formatBizRegNo(ctx.text) },
        ],
        selectionMode: "Row",
        selectionChanged: function(s, e) {
            searchPopFg2(s);
        }
    });
    skepStdWijmo.flexGrid.rowChecker(fgPrItemPop1);

    fgPrItemPop2 = skepStdWijmo.flexGrid.init('#fgPrItemPop2', {
        columns: [
            { binding: 'pjtCd', header: '프로젝트코드', visible: true, align: "left", width: 100, isReadOnly: true },
            { binding: 'pjtNm', header: '프로젝트명', visible: true, align: "left", width: 150, isReadOnly: true },
            { binding: 'prNo', header: '청구번호', align: "center", width: 120, isReadOnly: true },
            { binding: 'prNm', header: '청구명', align: "left", width: 350, isReadOnly: true },
            { binding: 'adjSe', visible: false, isReadOnly: true },
            { binding: 'adjSeNm', header: '요청구분', align: "center", width: 80, visible: true, isReadOnly: true },
            { binding: 'prYmd', header: '결제(의뢰)일', align: "left", width: 100, isReadOnly: true, cellTemplate: (ctx) => formatDateToView(ctx.text) },
            { binding: 'prSn', header: '청구순번', visible: true, align: "center", width: 80, isReadOnly: true },
            { binding: 'rcvPlanYmd', header: '예정일', visible: true, align: "center", width: 100, isReadOnly: true, cellTemplate: (ctx) => formatDateToView(ctx.text) },
            { binding: 'cmCd', header: '약품코드', visible: true, align: "center", width: 100, isReadOnly: true, visible: true },
            { binding: 'cmNm', header: '약품명', visible: true, align: "center", width: 120, isReadOnly: true },
            { binding: 'spec', header: '규격', visible: true, align: "left", width: 60, isReadOnly: true },
            { binding: 'unit', header: '단위', visible: true, align: "left", width: 60, isReadOnly: true },
            { binding: 'proInf', header: '재질', visible: true, align: "center", width: 100, isReadOnly: true, visible: false },
            { binding: 'prQty', header: '청구수량', visible: true, align: "left", width: 100, isReadOnly: true },
            { binding: 'bidQty', header: '견적수량', visible: true, align: "left", width: 100, isReadOnly: true },
            { binding: 'poPri', header: '단가', visible: true, align: "left", width: 100, isReadOnly: true },
            { binding: 'poAmt', header: '발주공급가', visible: true, align: "left", width: 100, isReadOnly: true },
            { binding: 'poVat', header: '부가세', visible: true, align: "center", width: 100, isReadOnly: true },
            { binding: 'rm', header: '비고', visible: true, align: "left", width: 100, isReadOnly: true },
            { binding: 'cmVdSeq', header: '약품거래처 일련번호', visible: false },
        ]
    });

    skepStdWijmo.flexGrid.rowChecker(fgPrItemPop2);
}

function searchPopFg2(fg) {

    const vdCd = fg.selectedItems[0]?.vdCd;
    if(!vdCd) return;

    const options = document.querySelectorAll('#cm-po-pjtCd-item option');
    const pjtCds = Array.prototype.filter.call(options, opt => opt.value).map(opt => opt.value);

    let param = {
        pjtCds,
        cmNm: document.getElementById('cm-po-cmNm-item').value,
        fg1VdCd: vdCd,
        cmCd: document.getElementById('cm-po-cmCd-item').value,
        prodInf: document.getElementById('cm-po-prodInf-item').value,
        specInf: document.getElementById('cm-po-spec-item').value,
        vdCd: document.getElementById('cm-po-vdCd-item').value,
        // prYmdSt: formatDateToSave(document.getElementById('cm-po-prYmdSt-item').value),
        // prYmdEd: formatDateToSave(document.getElementById('cm-po-prYmdEd-item').value),
        prYmdSt: $('#cm-po-prYmdRange-item').val() ? formatDateToSave($('#cm-po-prYmdRange-item').val().split(' ~ ')[0]) : null,
        prYmdEd: $('#cm-po-prYmdRange-item').val() ? formatDateToSave($('#cm-po-prYmdRange-item').val().split(' ~ ')[1]) : null,
    }
    api.ajax({
        url: contextPath + "/cm/api/cm-po/find-popup-fg2",
        type: 'GET',
        data: param,
        success: function (res) {
            if (res.responseCode == 'SUCCESS') {
                fgPrItemPop2._cv.sourceCollection = res.result;
                fgPrItemPop2.invalidate();
            } else {
                skep.ui.msg.alert('오류가 발생했습니다.');
            }
        },
        error: function (res) {
            skep.ui.msg.alert('오류가 발생했습니다.');
        }
    });
}

function prYmdSbInit() {

    const startDate = new Date().firstdayyyyymmdd();
    const endDate = new Date().yyyymmdd();

    $('#cm-po-prYmdRange-item').data('daterangepicker').setStartDate(startDate);
    $('#cm-po-prYmdRange-item').data('daterangepicker').setEndDate(endDate);
    $('#cm-po-prYmdRange-item').val(`${startDate} ~ ${endDate}`);

}

function customPopup() {
    projectPopupInPop = new ProjectPopup({
        onConfirm: function(result) {
            if(result.length > 0) {
                removeAllChildNodes(document.getElementById('cm-po-pjtCd-item'));
                document.getElementById('cm-po-pjtCd-item').appendChild(new Option('', ''));
                for(project of result) {
                    document.getElementById('cm-po-pjtCd-item').appendChild(new Option(project.pjtNm, project.pjtCd));
                }
            }
        }
    });
    cmVendorPopupInPopup = new CmVendorPopup({
        onConfirm: function(result) {
            document.getElementById('cm-po-vdCd-item').value = result[0].vdCd;
            document.getElementById('cm-po-vdNm-item').value = result[0].vdNm;

        },
        //Important!!!!!!!!!!!!!
        isMultiple: false
    });
}

function bulkOrderCheck() {
    const checkedRows = skepStdWijmo.flexGrid.getCheckedRow(fgPrItemPop1);

    if(checkedRows.length <= 0) {
        skep.ui.alert('항목을 선택하세요.');
        return;
    }

    const data = {
        cmNm: document.getElementById('cm-po-cmNm-item').value,
        cmCd: document.getElementById('cm-po-cmCd-item').value,
        prodInf: document.getElementById('cm-po-prodInf-item').value,
        specInf: document.getElementById('cm-po-spec-item').value,
        prYmdSt: $('#cm-po-prYmdRange-item').val() ? formatDateToSave($('#cm-po-prYmdRange-item').val().split(' ~ ')[0]) : null,
        prYmdEd: $('#cm-po-prYmdRange-item').val() ? formatDateToSave($('#cm-po-prYmdRange-item').val().split(' ~ ')[1]) : null,
        pjtCds: Array.prototype.filter.call(options, opt => opt.value).map(opt => opt.value),
        vdCd: document.getElementById('cm-po-vdCd-item').value,

        itemsAdded: JSON.stringify(checkedRows.map(r => r.dataItem))
    }

    api.ajax({
        url: contextPath + '/cm/api/cm-po/check-bulk-order',
        type: 'GET',
        data,
        success: function(res) {
            if(res.responseCode == 'SUCCESS') {
                bulkOrder(data);
            } else if (res.responseCode == 'FAIL') {
                skep.ui.msg.confirmYesno('단가가 등록되지 않은 항목이 있습니다. 진행하시겠습니까?').then(res => {
                    if(res) {
                        bulkOrder(data);
                    }
                });
            }
        }
    })
}

function bulkOrder(data) {

    api.ajax({
        url: contextPath + '/cm/api/cm-po/bulk-order',
        type: 'POST',
        data,
        success: function (res) {
            if(res.responseCode == 'SUCCESS') {
                skep.ui.msg.alert('저장이 완료되었습니다.');
                closefindPoItemLayer();
                searchCmPoHeader();
            } else {
                skep.ui.msg.alertError('오류가 발생했습니다.');
            }
        }, error: function() {
            skep.ui.msg.alertError('오류가 발생했습니다.');
        }
    });
}