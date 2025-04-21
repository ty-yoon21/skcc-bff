let fgSlCodeMngPop1, fgSlCodeMngPop2, clCdSelectedItem;

// Modify insertSlCodeMngTemplate to insert the template directly into the DOM
function insertSlCodeMngTemplate() {
    const template = getSlCodeMngPopup();
    document.body.insertAdjacentHTML('beforeend', template);
    //아래 source대로하면 충돌나기 때문에 insertAdjacentHTML사용
    //document.body.innerHTML += template; // Append the template to the body or a specific container
}
function getSlCodeMngPopup() {
    return `
    <div id="findSlCodeMngLayer" class="popup">
        <div class="popup__wrap">
            <div class="popup__header">
                <strong>슬러지 코드 등록</strong>
                <button class="ico__close" onclick="closeFindSlCodeMngLayer();"><span class="blind">Close</span></button>
            </div>
            <div class="popup__content">
                <div class="grid">
                    <div class="grid__cell">
                        <div class="grid">
                            <div class="grid--row">
                                <div class="cell__header">
                                    <div class="title">
                                    </div>
                                    <div class="button__group">
                                        <button type="button" class="btn--sm--success-ligh" onclick="fgAdd('fgSlCodeMngPop1');">추가</button>
                                        <button type="button" class="btn--sm--danger" onclick="fgDel('fgSlCodeMngPop1');">삭제</button>
                                        <button type="button" class="btn--sm--primary" onclick="fgSave('fgSlCodeMngPop1');">저장</button>
                                    </div>
                                </div>
                                <div class="cell__content">
                                    <div id="fgSlCodeMngPop1" class="wj-user-grid"></div>
                                </div>
                            </div>
                            <div class="grid--row">
                                <div class="cell__header">
                                    <div class="title">
                                    </div>
                                    <div class="button__group">
                                        <button type="button" class="btn--sm--success-ligh" onclick="fgAdd('fgSlCodeMngPop2');">추가</button>
                                        <button type="button" class="btn--sm--danger" onclick="fgDel('fgSlCodeMngPop2');">삭제</button>
                                        <button type="button" class="btn--sm--primary" onclick="fgSave('fgSlCodeMngPop2');">저장</button>
                                    </div>
                                </div>
                                <div class="cell__content">
                                    <div id="fgSlCodeMngPop2" class="wj-user-grid"></div>
                                </div>
                            </div>
                        </div>
                    </div>


                    </div>
                </div>
            </div>
        </div>
    </div>`;
}

// Close Sap Vendor Layer
function closeFindSlCodeMngLayer() {
    layerClose('findSlCodeMngLayer');
}

// Open Sap Vendor Layer
function openFindSlCodeMngLayer() {


    layerOpen('findSlCodeMngLayer');
    loadFgSlCodeMngPop1();
}


function initFgSlCodeMngPop1Grid() {

    //--------------------------------------------E.P.1 fgSapVendorPop1 init - START--------------------------------------------//
    fgSlCodeMngPop1 = skepStdWijmo.flexGrid.init('#fgSlCodeMngPop1', {

        columns: [

            { binding: 'clCd', header: '분류코드', align: "center", width: "1*", maxLength: 10 },
            { binding: 'clNm', header: '분류명', align: "center", width: "1*", maxLength: 100 },
        ],
        selectionMode: "MultiRange",

    });
    skepStdWijmo.flexGrid.rowChecker(fgSlCodeMngPop1);
    // setFgRowHeaderByNo(fgSlCodeMngPop1);
    fgSlCodeMngPop1.allowEditing = function (row, col) {
        let data = fgSlCodeMngPop1.rows[row].dataItem;
        let binding = fgSlCodeMngPop1.getColumn(col).binding;
        const colAllowAdded = ['clCd', 'clNm'];
        if (colAllowAdded.includes(binding) && skepStdWijmo.flexGrid.isAddedRow(fgSlCodeMngPop1.rows[row])) {
            return true;
        } else {
            return false;
        }
    }

    fgSlCodeMngPop1.addEventListener(fgSlCodeMngPop1.hostElement, 'click', function (e) {

        let h = fgSlCodeMngPop1.hitTest(e);
        clCdSelectedItem = fgSlCodeMngPop1.rows[h.row].dataItem.clCd;
        fgSlCodeMngPop2._cv.sourceCollection = [];

        if(!skepStdWijmo.flexGrid.isAddedRow(fgSlCodeMngPop1.rows[h.row])) {
            loadFgSlCodeMngPop2(clCdSelectedItem);
        }
    });

    //--------------------------------------------E.P.2 fgSapVendorPop1 settings - END--------------------------------------------//
}



function initFgSlCodeMngPop2Grid() {

    //--------------------------------------------E.P.1 fgSapVendorPop1 init - START--------------------------------------------//
    fgSlCodeMngPop2 = skepStdWijmo.flexGrid.init('#fgSlCodeMngPop2', {

        columns: [

            { binding: 'slCd', header: '슬러지코드 *', align: "center", width: "1*", maxLength: 10 },
            { binding: 'slNm', header: '슬러지명 *', align: "center", width: "2*", maxLength: 100 },
            { binding: 'spec', header: '규격', align: "center", width: "1.5*", maxLength: 100 },
            { binding: 'unit', header: '단위', align: "center", width: "1.5*", maxLength: 100 },
            { binding: 'clCd', header: '분류코드', align: "center", width: "1*", isReadOnly: true },
        ],
        selectionMode: "MultiRange"
    });
    // skepStdWijmo.flexGrid.rowChecker(fgSlCodeMngPop2);
    fgSlCodeMngPop2.allowEditing = function (row, col) {
        let data = fgSlCodeMngPop2.rows[row].dataItem;
        let binding = fgSlCodeMngPop2.getColumn(col).binding;
        const colAllowAdded = ['slCd', 'slNm', 'spec', 'unit'];
        if (colAllowAdded.includes(binding) && skepStdWijmo.flexGrid.isAddedRow(fgSlCodeMngPop2.rows[row])) {
            return true;
        } else {
            return false;
        }
    }
    skepStdWijmo.flexGrid.rowChecker(fgSlCodeMngPop2);
    // Set [Row Header] By No.
    // setFgRowHeaderByNo(fgSlCodeMngPop2);
    
}


// function setFgRowHeaderByNo(fg) {
//     //1. Header Visibility - https://developer.mescius.com/wijmo/api/enums/wijmo_grid.headersvisibility.html
//     fg.headersVisibility = 3;
//     //2. Row Header column size
//     fg.rowHeaders.columns.defaultSize = 60;

//     fg.formatItem.addHandler(function (fg, e) {
//         if (e.panel.cellType == 4) {
//             e.cell.innerText = "순번"
//         } else if (e.panel.cellType == 3) {
//             e.cell.innerText = (e.row + 1)
//         }
//     });
// }

async function loadFgSlCodeMngPop1() {
    return new Promise(function (resolve, reject) {
        api.ajax({
            url: contextPath + "/sl/api/sl-info-reg/find-pop-fg1",
            type: 'GET',
            success: function (res) {
                if (res.responseCode == 'SUCCESS') {
                    fgSlCodeMngPop1._cv.sourceCollection = res.result;
                    fgSlCodeMngPop1.invalidate();
                    resolve('success');
                    clCdSelectedItem = skepStdWijmo.flexGrid.getCurrentItemJson(fgSlCodeMngPop1).clCd;
                    loadFgSlCodeMngPop2(clCdSelectedItem);
                } else {
                    skep.ui.msg.alert('오류가 발생하였습니다.');
                    reject('error');
                }
            },
            error: function (res) {
                skep.ui.msg.alert('오류가 발생하였습니다.');
                reject('error');
            }
        });
    });
}

function loadFgSlCodeMngPop2(selectedItem) {
    
    if (selectedItem === null || selectedItem === undefined) {
        resetSlCodeMngPop2();
        return;
    }

    let param = {
        clCd: selectedItem
    }

    api.ajax({
        url: contextPath + "/sl/api/sl-info-reg/find-pop-fg2",
        type: 'GET',
        data: param,
        success: function (res) {
            if (res.responseCode == 'SUCCESS') {
                fgSlCodeMngPop2._cv.sourceCollection = res.result;
                fgSlCodeMngPop2.invalidate();
            } else {
                skep.ui.msg.alert('오류가 발생하였습니다.');
            }
        },
        error: function (res) {
            skep.ui.msg.alert('오류가 발생하였습니다.');
        }
    });
}

function resetSlCodeMngPop2() {
    fgSlCodeMngPop2.itemsSource = new wijmo.collections.CollectionView([]);
}



function editingNewRow(fg) {

    fg.allowEditing = function (row, col) {
        let data = fg.rows[row].dataItem;
        let binding = fg.getColumn(col).binding;
        switch (binding) {
            case 'clCd':
            case 'clNm':
                if (skepStdWijmo.flexGrid.isAddedRow(fg.rows[row]) || skepStdWijmo.flexGrid.isEditedRow(fg.rows[row])) {  //Columns can only be modified for added rows
                    return true;
                } else {
                    return false;
                }
        }
    }
}


// Init Function
window.addEventListener('load', function () {
    insertSlCodeMngTemplate();
    initFgSlCodeMngPop1Grid();
    initFgSlCodeMngPop2Grid();
});