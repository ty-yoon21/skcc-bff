// Excel Import (Upload) Common Function
/*
### HTML - Start
1) Import JS & css
    <!-- 엑셀 업로드 -->
    <link rel="stylesheet" th:href="@{/css/stdframework/exm/skep-std-excel.css}">
    <script th:src="@{/js/stdframework/exm/skep-std-excel.js}"></script>
    <script th:src="@{/libs/stdframework/ui/jszip.min.js}"></script>
    <script th:src="@{/libs/stdframework/ui/wijmo-5.20231.904/Dist/controls/wijmo.grid.xlsx.min.js}"></script>
    <script th:src="@{/libs/stdframework/ui/wijmo-5.20231.904/Dist/controls/wijmo.xlsx.min.js}"></script>
    <script th:src="@{/js/common/common-bom-excel-import.js}"></script>
	...
2) Make excelUpload Button
    <button type="button" class="btn--sm--dark" onclick="layerOpen('excelImportPop');" gp_btn_rw="w">템플릿 업로드</button>
    ...	
3) Make HTML DIV (Excel Import Popup)	
    <!-- Excel Import Start-->
		...
		excelUpload();
		showLoadingBar		
		...
	<!-- Excel Import End-->	
    ...
4) Add Grit Init Function    
    $(document).ready(function () {
        initExcelImportGrid();
		...
	}
    ...	
5) Add after upload Listener & Function    
	// Excel Import Setting - Start
		...
		function dropzoneExcelUpload(){
			bomappExcelImportByDropZone(.. function(res){
				hideLoadingBar();
				searchExcelImportSummary();
			));
		}
	// Excel Import Setting - End
### HTML - End	
	

### JS
// 1. Excel Import Drag&Drop Event (Dropzone Event)
1.1) excelFileDropDown("excel_file_box", selectExcelFile2); 	--> skep-std-excel.js
	--> selectExcelFile2
		--> bomappSelectExcelFile
			--> showLoadingBar	
	

// 2. Event Listner
element.addEventListener('DOMSubtreeModified', dropzoneExcelUpload);
dropzoneExcelUpload() {
	2.1) bomappExcelImportByDropZone --> if success hideLoadingBar();
	2.2) bomappUploadExcelData	
		--> api.post(/api/common/commonData/save/uploadExcel) --> ExcelImportController --> ExcelImportService --> ExcelImportTempCellRepository
}
	--> if success
		--> searchExcelImportSummary
			--> searchExcelImportErrorInfo
	
	


*/

let fgExcelPop1 = null;
let fgExcelPop2 = null;

function initExcelImportGrid(){


        // 엑셀 업로드 팝업 summary 그리드
        fgExcelPop1 = skepStdWijmo.flexGrid.init('#fgExcelPop1', {
            columns: [
                {
                    binding : "totalCnt",
                    header: "전체 행 수",
                    width: "*",
                    align: "center",
                },
                {
                    binding : "importCnt",
                    header: "업로드 행 수",
                    width: "*",
                    align: "center",
                },
                {
                    binding : "insertCnt",
                    header: "등록 행 수",
                    width: "*",
                    align: "center",
                },
                {
                    binding : "updateCnt",
                    header: "수정 행 수",
                    width: "*",
                    align: "center",
                },
                {
                    binding : "deleteCnt",
                    header: "삭제 행 수",
                    width: "*",
                    align: "center",
                },
                {
                    binding : "sucLineCnt",
                    header: "성공 행 수",
                    width: "*",
                    align: "center",
                },
                {
                    binding : "errLineCnt",
                    header: "오류 행 수",
                    width: "*",
                    align: "center",
                },
                {
                    binding : "errCnt",
                    header: "오류 수",
                    width: "*",
                    align: "center",
                },
                {
                    binding : "warCnt",
                    header: "경고 수",
                    width: "*",
                    align: "center",
                },
            ],
            selectionMode: "Row",
        });
        fgExcelPop1.isReadOnly = true;  // readOnly, Grid 내 a 태그 때문에 밖으로 뺌

        // 엑셀 업로드 팝업 error 그리드
        fgExcelPop2 = skepStdWijmo.flexGrid.init('#fgExcelPop2', {
            columns: [
                {
                    binding : "errRow",
                    header: "오류 행 번호",
                    width: 150,
                    align: "center",
                },
                {
                    binding : "errCn",
                    header: "오류 설명",
                    width: "*",
                    align: "center",
                },
                {
                    binding : "errType",
                    header: "오류 종류",
                    width: 200,
                    align: "center",
                },
            ],
            selectionMode: "Row",
        });
        fgExcelPop2.isReadOnly = true;

        // 엑셀 업로드 드래그앤 드랍 이벤트
        // Excel Import Drag&Drop Event
        excelFileDropDown("excel_file_box", selectExcelFile2);    
}


function selectExcelFile2(excelFileObject) {
    excelFileList = new Array();
    excelFileIndex = 0;
    totalFileSize = 0;
    $('#excelFileUpload').val("");
    $("#excelFileList > ul").empty();

    bomappSelectExcelFile(excelFileObject, "excelImportPop");
}

function bomappSelectExcelFile(excelFileObject, popId) {
    var excelFiles = null;

    if (excelFileObject != null) {
        excelFiles = excelFileObject;
    }

    // 다중파일 등록
    if (excelFiles != null) {
        let isShowLoadingBar = false;

        if (Object.keys(excelFileList).length >= excelFilesNum || excelFiles.length > excelFilesNum) {
            skep.ui.msg.alert("파일 업로드 갯수는 최대 "+excelFilesNum+"개 입니다.");
            return;
        }

        if (excelFiles != null && excelFiles.length > 0) {
            $("#excelFileList").show();
        } else {
            $("#excelFileList").hide();
        }

        for (var i = 0; i < excelFiles.length; i++) {
            var excelFileName = excelFiles[i].name;
            var excelFileNameArr = excelFileName.split("\.");
            var ext = excelFileNameArr[excelFileNameArr.length - 1];

            var excelFileSize = excelFiles[i].size;
            console.log("excelFileSize="+excelFileSize);
            if (excelFileSize <= 0) {
                console.log("0kb excelFile return");
                return;
            }

            var excelFileSizeKb = excelFileSize / 1024;
            var excelFileSizeMb = excelFileSizeKb / 1024;

            var excelFileSizeStr = "";
            if ((1024*1024) <= excelFileSize) {
                console.log("excelFileSizeMb="+excelFileSizeMb.toFixed(2));
                excelFileSizeStr = excelFileSizeMb.toFixed(2) + " Mb";
            } else if ((1024) <= excelFileSize) {
                console.log("excelFileSizeKb="+parseInt(excelFileSizeKb));
                excelFileSizeStr = parseInt(excelFileSizeKb) + " kb";
            } else {
                console.log("excelFileSize="+parseInt(excelFileSize));
                excelFileSizeStr = parseInt(excelFileSize) + " byte";
            }

            if ($.inArray(ext, excelFileExtList) == -1) {
                skep.ui.msg.alert("등록이 불가능한 파일 입니다.");
            } else if (excelFileSizeMb > uploadSize) {
                skep.ui.msg.alert("용량 초과\n업로드 가능 용량 : " + uploadSize + " MB");
                break;
            } else {
                totalFileSize += excelFileSizeMb;
                excelFileList[excelFileIndex] = excelFiles[i];
                excelFileSizeList[excelFileIndex] = excelFileSizeMb;

                addExcelFileLIst(excelFileIndex, excelFileName, excelFileSizeStr);

                excelFileIndex++;

                isShowLoadingBar = true;
            }
        }

        if (isShowLoadingBar)
            showLoadingBar(popId);
    } else {
        alert("ERROR");
    }
}



function bomappExcelImportByDropZone(fileControl, menuId, sheetsNum, headerRows, params, cb){
    let d = new Date();
    let importSeq = d.getFullYear() + _pad((1 + d.getMonth()), "2") + _pad(d.getDate(), "2") + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds();
    let file = fileControl;

    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let workbook = new wijmo.xlsx.Workbook();

            for(let s=0 ; s<sheetsNum ; s++){
                workbook.loadAsync(reader.result, function (workbook) {
                        let rowsHeaders         = workbook.sheets[s].rows.splice(0, headerRows);   //헤더
                        let headerColumnNum     = rowsHeaders[0]._cells.length;                     // Column 갯수
                        let rowsWithoutHeader   = workbook.sheets[s].rows;                          //헤더 미포함 RAW Data

                        const excelDatas = rowsWithoutHeader.map(row => {
                            let col = {};
                            for(let j=0; j<headerColumnNum ; j++){
                                col[`c_${ j }`] = ( row.cells[j] == undefined || row.cells[j] == null) ? "": (row.cells[j].isDate) ? row.cells[j].value.yyyymmdd() :row.cells[j].value;
                            }
                            return col;
                        });

                        uploadJsonData = {
                            "itemsUpload": excelDatas
                        }

                    bomappUploadExcelData(uploadJsonData, importSeq, menuId, params, cb);

                    }, function (reason) {
                        hideLoadingBar();
                        alert('Read Excel files failed.  Check Files');
                    }
                );
            }
        };
        reader.readAsDataURL(file);
    }
}


function bomappUploadExcelData(uploadJsonData, importSeq, menuId, params, cb) {

    let excelDataJson = JSON.stringify(uploadJsonData);
    let paramsJsonString = JSON.stringify(params)
    ajaxData = {
        "importSeq": importSeq,
        "menuId": menuId,
        "excelDataJson": excelDataJson,
        "paramsJsonString": paramsJsonString
    }

    $.ajax({
        cache: false,
        type: 'POST',
        async: false, //로딩바 보여주기 위해 주석처리
        url : "/api/common/commonData/save/uploadExcel",
        data: ajaxData,
        dataType: "json",
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        beforeSend : function(xhr){
            if(csrfHeader && csrfToken)
                xhr.setRequestHeader(csrfHeader, csrfToken);
        },
        success: function(res) {
            $('html').css("cursor","auto");
            if (res.responseCode == "SUCCESS") {
                //skep.ui.msg.alert("Excel Upload Success");
                res.importSeq = importSeq;
                res.menuId = menuId;
                if(cb) cb(res);
            } else {
                skep.ui.msg.alertError("Excel Upload Error");
                if(cb) cb(res);
            }
        },
        error: function(request, status, error) {
            //$('html').css("cursor","auto");   //TODO
            skep.ui.msg.alertError("Excel Upload Error");
            if(cb) cb(res);

        },
        complete: function() {
            //commonUI.layer_close('pop_loading');  //TODO
        }
    });

}


function searchExcelImportSummary(menuId, importSeq) {
    let param = {
        menuId: menuId,
        importSeq: importSeq
    };

    api.get("/exm/api/findExcelImportSummary", param, function(res) {
        if (res.responseCode == 'ERROR') {
            skep.ui.msg.alertError("오류가 발생 하였습니다.", "common:bomapp.common.msg.error");
        } else if (res.result) {
            fgExcelPop1._cv.sourceCollection = res.result;

            if (res.result.length > 0 && res.result[0].importCnt && res.result[0].importCnt > 0) {                
                skep.ui.msg.alert('저장 되었습니다.', 'common:bomapp.common.message.saved');
            }
        }
        searchExcelImportErrorInfo(menuId, importSeq)
    });
}


function searchExcelImportErrorInfo(menuId, importSeq) {
    let param = {
        menuId: menuId,
        importSeq: importSeq
    };

    api.get("/exm/api/findExcelImportErrorInfo", param, function(res) {
        if(res.responseCode == 'ERROR') {
            skep.ui.msg.alertError("오류가 발생 했습니다.", "common:bomapp.common.msg.error");
        } else if (res.result) {
            fgExcelPop2._cv.sourceCollection = res.result;
        }
    });
}






function _pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}


function excelUpload() {
    excelFileList = new Array();
    excelFileIndex = 0;
    totalFileSize = 0;
    $('#excelFileUpload').val("");
    $("#excelFileList > ul").empty();

    $('#excelFileUpload').click();
}


function showLoadingBar(id) {
    try {
        let backWidth;
        let backHeight;
        let backTop;
        let backLeft;

        if ($("#" + id).find(".popup__wrap").length > 0) {
            backWidth = $("#" + id).find(".popup__wrap").width();
            backHeight = $("#" + id).find(".popup__wrap").height();
            backTop =  $("#" + id).find(".popup__wrap").offset().top;
            backLeft = $("#" + id).find(".popup__wrap").offset().left;
        } else {
            backWidth = $("#" + id).width();
            backHeight = $("#" + id).height();
            backTop =  $("#" + id).offset().top;
            backLeft = $("#" + id).offset().left;
        }

        let backGroundCover = "<div id='loadingBarBack'></div>";

        let loadingBarImage = "<div id='loadingBar'>";
        loadingBarImage += "<img src='/images/spinner.gif' width='200' height='200'/>"; // 로딩바 이미지
        loadingBarImage += "</div>";

        $('#' + id).append(backGroundCover).append(loadingBarImage);

        $('#loadingBarBack').css({'width':backWidth, 'height':backHeight, 'opacity':'0.1', 'top':backTop, 'left':backLeft});
        $('#loadingBarBack').show();

        $('#loadingBar').css({'left':(backLeft + (backWidth / 2)) - 100, 'top':(backTop + (backHeight / 2)) - 100});
        $('#loadingBar').show();
    } catch (error) {
        console.log(error);
    }
}


function hideLoadingBar() {
    try {
        $('#loadingBarBack, #loadingBar').hide();
        $('#loadingBarBack, #loadingBar').remove();
    } catch (error) {
        console.log(error);
    }
}


function closeExcelImportPop() {
    excelFileList = new Array();
    excelFileIndex = 0;
    totalFileSize = 0;
    $('#excelFileUpload').val("");
    $("#excelFileList > ul").empty();

    fgExcelPop1._cv.sourceCollection = [];
    fgExcelPop2._cv.sourceCollection = [];

    hideLoadingBar();
    layerClose('excelImportPop');
}