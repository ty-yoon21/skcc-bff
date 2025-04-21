let fgSlCodeMngPop2, clCdSelectedItem;

// Modify insertSlCodeMngTemplate to insert the template directly into the DOM
function insertDispPhotoUploadTemplate() {
    const template = getDispPhotoUploadPopup();
    document.body.insertAdjacentHTML('beforeend', template);
    //아래 source대로하면 충돌나기 때문에 insertAdjacentHTML사용
    //document.body.innerHTML += template; // Append the template to the body or a specific container
}
function getDispPhotoUploadPopup() {
    return `
    <div id="findSlCodeMngLayer" class="popup">
        <div class="popup__wrap">
            <div class="popup__header">
                <strong>처리장 사진정보 Upload</strong>
                <button class="ico__close" onclick="closeFindDispPhotoUploadLayer();"><span
                        class="blind">Close</span></button>
            </div>
            <div class="popup__content">
                <div class="grid--full">
                    <div class="grid__cell">
                        <div class="cell__content--search">
                            <div class="grid--cols-2">
                                <div class="grid__cell--w-80">
                                    <div class="form--cols">
                                        <div class="form__group">
                                            <div style="display: flex;">
                                                <!-- File input component를 위한 영역 생성-->
                                                <div id="fileInput1"></div>
                                                <div style="padding: 10px;">
                                                    <!-- File upload를 위한 버튼 추가-->
                                                    <button id="btnUpload1" class="btn--primary">upload</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="grid__cell">
                                    <div class="form--button">
                                        <div class="button__group">
                                            <button type="button" class="btn--primary" onclick="searchProduct();">조회</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="grid__cell">
                        <div class="cell__header">
                            <div class="title">
                            </div>
                            <div class="button__group">
                                <button type="button" class="btn--sm--success-ligh" onclick="fgAdd('fgpopup');"
                                   >추가</button>
                                <button type="button" class="btn--sm--danger" onclick="fgDel(fgpopup);"
                                   >삭제</button>
                                <button type="button" class="btn--sm--primary" onclick="fgSave('fgpopup');"
                                   >저장</button>
                            </div>
                        </div>
                        <div class="cell__content">
                            <div id="fgpopup" class="wj-user-grid"></div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>`;
}

// Close Sap Vendor Layer
function closeFindDispPhotoUploadLayer() {
    layerClose('findSlCodeMngLayer');
}

// Open Sap Vendor Layer
function openFindDispPhotoUploadLayer() {

    layerOpen('findSlCodeMngLayer');
    //searchProduct();
}
// function searchProduct() {
//     return new Promise(function (resolve, reject) {
//         let param = {
//             key: document.getElementById('search-product').value
//         }

//         api.ajax({
//             url: contextPath + "/cm/api/cm-info-reg/find-cmcl",
//             type: 'GET',
//             data: param,
//             success: function (res) {
//                 fgpopup._cv.sourceCollection = res.result;
//                 fg1._cv.sourceCollection = res.result;
//                 // $('#search-product').val(null);
//                 resolve('success')
//             },
//             error: function (res) {
//                 skep.ui.msg.alert('오류가 발생하였습니다.');
//             }
//         });
//     });

// };


// function initFgSlCodeMngPop1Grid() {
//     let fgpopupList = [];

//     //--------------------------------------------E.P.1 fgSapVendorPop1 init - START--------------------------------------------//
//     fgpopup = skepStdWijmo.flexGrid.init('#fgpopup', {

//         columns: [
//             { binding: 'clCd', header: '분류코드', align: "center", width: "1*" },
//             { binding: 'clNm', header: '분류명', align: "left", width: "1*" },
//             { binding: 'cmCdRegYn', header: '자재등록여부', align: "center", width: "1*" },
//             { binding: 'regId', align: "center", width: "1*", visible: false },
//             { binding: 'regDt', align: "center", width: "1*", visible: false },
//             { binding: 'modId', align: "center", width: "1*", visible: false },
//             { binding: 'modDt', align: "center", width: "1*", visible: false },

//         ],
//         selectionMode: "MultiRange",
//         cellEditEnded: function (s, e) {
//             if (skepStdWijmo.flexGrid.getColumnDuplCheck(fgpopup, s, e, 'clCd')) {
//                 skep.ui.msg.alert('중복된 분류코드입니다.');
//             }
//         }
//     });

//     skepStdWijmo.flexGrid.rowChecker(fgpopup);
//     fgpopup.itemsSource.sourceCollection = fgpopupList;

//     fgpopup.allowEditing = function (row, col) {
//         let data = fgpopup.rows[row].dataItem;
//         let binding = fgpopup.getColumn(col).binding;
//         const colAllowAdded = ['clCd', 'clNm', 'clCdRegYmd'];
//         if (colAllowAdded.includes(binding) && skepStdWijmo.flexGrid.isAddedRow(fgpopup.rows[row])) {
//             return true;
//         } else {
//             return false;
//         }
//     }

// }

// Init Function
window.addEventListener('load', function () {
    insertDispPhotoUploadTemplate();    
});



        //normal Component를 생성합니다.
        const file1 = new FileInput({
            targetElement: document.getElementById('fileInput1'),
            type: 'normal',
            name: 'files',
            settings: {
                //isMultiple: true,
                isMultiple: false,
                accept: ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG', 'gif', 'GIF']
            }
        });

        //버튼을 클릭하면 파일 업로드를 수행합니다.
        $('#btnUpload1').click((e) => {
            const inputFile = file1.getInputElement();
            callUpload(inputFile.files);
        })
        
        function callUpload(files) {
            
            var formData = new FormData();
            for (var i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }

            api.ajax({
                url: '/api/upload/resources',
                processData: false,
                contentType: false,
                data: formData,
                type: 'POST',
                success: function (result) {
                    if (result.responseCode == "SUCCESS") {
                        alert(result.result.length + " items uploaded");
                    } else {
                        alert("Failed.")
                    }
                }
            });
        }