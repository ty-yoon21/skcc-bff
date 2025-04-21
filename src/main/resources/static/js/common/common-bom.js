/** 1. setDecimalNum(value, decimal) - decimal point alignment / 소수점 맞춤 */
/** 2. showLoadingBar(id) - Show Loading Bar / 로딩화면 출력 */
/** 3. hideLoadingBar() - Show Loading Bar / 로딩화면 출력 */
/** 4. Date.prototype.yyyymm = function() */
/** 5. Date.prototype.yyyymmdd = function() */
/** 6. getCurrentDateTimeAsString() */
/** 7. setOptions(el, opt) - put data to select box */
/** 8. checkPositiveInteger(event) -  */
/** 9. formatNumberByCommas(inputId) -  */
// 1000 --> 1,000
/** 10. parseNumber(value) -  */
// 1,000 --> 1000
/** 11. Date Picker -  */
/** 12. Get Previous Month -  */
/** 13. Get Current Time yyyyMMddHHmmss -  */



/** 1. setDecimalNum(value, decimal) - decimal point alignment / 소수점 맞춤 */
function setDecimalNum(value, decimal) {
    if (value === undefined || value === null || value === 0 )
        return 0;
    if (decimal === null || decimal === undefined)
        decimal = 0;

    return (Math.round(value * (10 ** decimal)) / (10 ** decimal));
}

/** 2. showLoadingBar(id) - Show Loading Bar / 로딩화면 출력 */
function showLoadingBar(id) {
    try {
        let backWidth = $("#" + id).find(".popup__wrap").width();
        let backHeight = $("#" + id).find(".popup__wrap").height();
        let backTop = $("#" + id).find(".popup__wrap").offset().top;
        let backLeft = $("#" + id).find(".popup__wrap").offset().left;

        let backGroundCover = "<div id='loadingBarBack'></div>";

        // $("#loadingBarBack").click(function(event){
        //     event.stopPropagation();
        // });

        let loadingBarImage = "<div id='loadingBar'>";
        loadingBarImage += "<img src='/images/spinner.gif' width='200' height='200'/>"; // 로딩바 이미지
        loadingBarImage += "</div>";

        $('#excelImportPop').append(backGroundCover).append(loadingBarImage);

        $('#loadingBarBack').css({ 'width': backWidth, 'height': backHeight, 'opacity': '0.1', 'top': backTop, 'left': backLeft });
        $('#loadingBarBack').show();

        $('#loadingBar').css({ 'left': (backLeft + (backWidth / 2)) - 100, 'top': (backTop + (backHeight / 2)) - 100 });
        $('#loadingBar').show();
    } catch (error) {
        console.log(error);
    }
}

/** 3. hideLoadingBar() - Show Loading Bar / 로딩화면 출력 */
function hideLoadingBar() {
    try {
        $('#loadingBarBack, #loadingBar').hide();
        $('#loadingBarBack, #loadingBar').remove();
    } catch (error) {
        console.log(error);
    }
}

/** 4. Date.prototype.yyyymm = function() */
Date.prototype.yyyymm = function() {

    var mm = this.getMonth() + 1;


    return [this.getFullYear(),
        (mm>9 ? '' : '0') + mm
    ].join('-');
};

/** 5. Date.prototype.yyyymmdd = function() */
Date.prototype.yyyymmdd = function() {

    var mm = this.getMonth() + 1;
    var dd = this.getDate();

    return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('-');
};

/** 6. getCurrentDateTimeAsString() */
function getCurrentDateTimeAsString(){
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const date = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${date}-${hours}-${minutes}-${seconds}`

}

/** 7. setOptions(el, opt) - put data to select box */
// Ex) setOptions('payment-detail-costCode', LIST_COST_CODE);
function setOptions(el, opt) {
    if (getElement(el)) {
        if ($.isArray(opt)) {
            getElement(el).empty();
            opt.forEach(function (item) {
                getElement(el).append("<option value='" + item.value + "'>" + item.name + "</option>");
            })
        }
    }
}
function getElement(el) {
    if ($("#" + el).length == 1) {
        return $("#" + el);
    } else {
        return null;
    }
}

/** 8. checkPositiveInteger(event) -  */
function checkPositiveInteger(event){
    if(event.key >= 0 && event.key <= 9){
        return true;
    } else {
        false;
    }
}

/** 9. formatNumberByCommas(inputId) -  */
// 1000 --> 1,000
function formatNumberByCommas(inputId) {
    let inputElement = document.getElementById(inputId);
    let inputValue = inputElement.value;
    let formattedValue = numberWithCommas(inputValue);
    inputElement.value = formattedValue;
}
function numberWithCommas(value) {
    let valueWithoutCommas = value.toString().replace(/,/g, '');
    return valueWithoutCommas.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** 10. parseNumber(value) -  */
// 1,000 --> 1000
function parseNumber(value) {
    return parseInt(value.replace(/,/g, ''), 10);
}

/** 11. Date Picker -  */
$(function () {
    // datepicker 설정
    $(".datepicker").datepicker({
        dateFormat: "yy-mm-dd",
        onSelect: function (dateText, inst) {
            // 입력된 날짜가 'YYYY-MM-DD' 형식으로 출력되도록 변환
            $(this).val(dateText);
        },
        beforeShow: function (input, inst) {
            // 입력되는 날짜가 'YYYY-MM-DD' 형식이 아니면 자동으로 변환
            var currentValue = $(input).val();
            var dateRegex = /^(\d{4})(\d{2})(\d{2})$/;

            if (dateRegex.test(currentValue)) {
                var match = dateRegex.exec(currentValue);
                var year = match[1];
                var month = match[2];
                var day = match[3];
                $(input).val(year + '-' + month + day);
            }
            //       var currentValue = $(input).val();
            //       if (currentValue.length === 4 && !currentValue.includes("-")) {
            //         $(input).val(currentValue + "-");
            //       } else if (currentValue.length === 7 && !currentValue.endsWith("-")) {
            //         $(input).val(currentValue + "-");
            //       }
        }
    });
});


// 날짜 형식 체크 함수
function isValidDate(dateString) {
    // 'YYYYMMDD' 형식의 정규식
    if (dateString == "") {
        return true;
    } else {
        var regex = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/;
        return regex.test(dateString);
    }

}

 function validateDateYear(e) {
    var input = e.value;
    var startDate = new Date(input.trim());
    var start = input.trim().replaceAll("-", "");
    if (startDate.getFullYear() === +start.slice(0, 4)) {
        e.oldValue = e.value;
    } else {
        e.value = e.oldValue;
    }
}

function validateDateInCell(e) {
    if (e == "") {
        return true;
    }
    var input = e;
    var startDate = new Date(input.trim());
    var start = input.trim().replaceAll("-", "");
    if (startDate.getFullYear() === +start.slice(0, 4)
        && startDate.getMonth() + 1 === +start.slice(4, 6)
        && startDate.getDate() === +start.slice(6, 8)) {
        return true;
    } else {
        return false;
    }
}

function validateDate(e) {
    var input = e.value;
    //TO-DO dai가 변경 (7/2) 확인 필요)
    //var startDate = new Date(input[0].trim());
    var startDate = new Date(input.trim());
    var start = input.trim().replaceAll("-", "");
    if (startDate.getFullYear() === +start.slice(0, 4)
        && startDate.getMonth() + 1 === +start.slice(4, 6)
        && startDate.getDate() === +start.slice(6, 8)) {
        e.oldValue = e.value;
    } else {
        e.value = e.oldValue;
    }
}


function validateDateMonth(e) {
    var input = e.value;
    //TO-DO dai가 변경 (7/2) 확인 필요)
    //var startDate = new Date(input[0].trim());
    var startDate = new Date(input.trim());
    var start = input.trim().replaceAll("-", "");
    if (startDate.getFullYear() === +start.slice(0, 4)
        && startDate.getMonth() + 1 === +start.slice(4, 6)) {
        e.oldValue = e.value;
    } else {
        e.value = e.oldValue;
    }
}


function validateDateRange(e) {
    var input = e.value;
    input = input.split('~');
    var startDate = new Date(input[0].trim());
    var endDate = new Date(input[1].trim());
    var start = input[0].trim().replaceAll("-", "");
    var end = input[1].trim().replaceAll("-", "");
    if (startDate.getFullYear() === +start.slice(0, 4) && endDate.getFullYear() === +end.slice(0, 4)
        && startDate.getMonth() + 1 === +start.slice(4, 6) && endDate.getMonth() + 1 === +end.slice(4, 6)
        && startDate.getDate() === +start.slice(6, 8) && endDate.getDate() === +end.slice(6, 8)) {
        e.oldValue = e.value;
    } else {
        e.value = e.oldValue;
    }
}

function validateDateRangeMonth(e) {
    var input = e.value;
    input = input.split('~');
    var startDate = new Date(input[0].trim());
    var endDate = new Date(input[1].trim());
    var start = input[0].trim().replaceAll("-", "");
    var end = input[1].trim().replaceAll("-", "");
    if (startDate.getFullYear() === +start.slice(0, 4) && endDate.getFullYear() === +end.slice(0, 4)
        && startDate.getMonth() + 1 === +start.slice(4, 6) && endDate.getMonth() + 1 === +end.slice(4, 6)
    ) {
        e.oldValue = e.value;
    } else {
        e.value = e.oldValue;
    }
}



function isNumber(input) {
    return /^-?\d+$/.test(input);
}

function checkMaxDecimalNumber(input) {
    if (input == "") {
        return true;
    } else {
        var regex = /^\d{1,16}(\.\d{1,4})?$/;
        return regex.test(input);
    }
}

/** 5. Date.prototype.yyyymmdd = function() */
Date.prototype.firstdayyyyymmdd = function () {

    var mm = this.getMonth() + 1;
    var dd = 1;

    return [this.getFullYear(),
    (mm > 9 ? '' : '0') + mm,
    (dd > 9 ? '' : '0') + dd
    ].join('-');
};




//Manh Start

// 날짜 형식 체크 함수
function isValidDateMonth(dateString) {
    // 'YYYYMMDD' 형식의 정규식
    if (dateString == "") {
        return true;
    } else {
        var regex = /^\d{4}(0[1-9]|1[0-2])(0[1-9]|)$/;
        return regex.test(dateString);
    }

}

function isNumber(input) {
    if (input == "") {
        return true;
    } else {
        var regex = /^\d[0-9]*$/;
        return regex.test(input);
    }
}

function formatDateToView(input) {
    if (!input) {
        return "";
    }
    if (input.toString().length == 6) {
        return input.slice(0, 4) + "-" + input.slice(4, 6);
    } else {
        return input.slice(0, 4) + "-" + input.slice(4, 6) + "-" + input.slice(6, 8);
    }
}


function formatDateToSave(input) {
    if (!input) {
        return "";
    }
    if (input.toString().length > 10) {
        input = new Date(input);

        var mm = input.getMonth() + 1;
        var dd = input.getDate();

        return [input.getFullYear(),
        (mm > 9 ? '' : '0') + mm,
        (dd > 9 ? '' : '0') + dd
        ].join('');
    } else {
        return input.replaceAll(" ", "").replaceAll("-", "");
    }
}

function setFgRowHeaderByNo(fg) {
    fg.headersVisibility = 3;
    fg.rowHeaders.columns.defaultSize = 60;
    fg.formatItem.addHandler(function (fg, e) {
        if (e.panel.cellType == 4) {
            e.cell.innerText = "순번"
        } else if (e.panel.cellType == 3) {
            e.cell.innerText = (e.row + 1)
        }
    });
}

//(Custom) Function - Print * in required item column header
function setGridHeaderIsRequired(fg, map) {
    //(Cumtom)
    for (let column of map) {
        fg.getColumn(column).header += ' *';
    }
}

function convertBoleanToView(row, map) {
    //(Cumtom)
    for (let column of map) {
        if (row[column] === "Y") {
            row[column] = true;
        }
        if (row[column] === "N") {
            row[column] = false;
        }
    }
}

function setParentSelectOptions(selectId, options) {
    const selectElement = document.getElementById(selectId);
    selectElement.innerHTML = ''; // Clear existing options
    options.forEach(option => {
        const opt = new Option(option.name, option.value);
        selectElement.appendChild(opt);
    });
}

function getSelectBoxSystemCodeByCdCl(cdClValue, MAP, selectName, fg, useYn) {
    return new Promise(function (resolve, reject) {
        MAP.push({ name: "", value: "" });
        let param = {
            cdCl: cdClValue,
            useYn: useYn == 'N' ? 'N' : "Y"
        }
        api.ajax({
            url: contextPath + "/scm/api/findsystemcodelistbycdcl",
            type: 'GET',
            data: param,
            success: function (res) {
                if (res.responseCode == 'SUCCESS') {
                    for (let i = 0; i < res.result.length; i++) {
                        let objCombo = new Object();
                        objCombo.value = res.result[i].cd;
                        objCombo.name = res.result[i].cdNm;
                        MAP.push(objCombo);
                    }
                    if(selectName) {
                        if(fg) {
                            MAP = new wijmo.grid.DataMap(MAP, "value", "name");
                            fg.getColumn(selectName).dataMap = MAP;
                        } else {
                            setParentSelectOptions(selectName, MAP);
                        }
                    }
                    resolve({result: 'success', data: res.result});
                } else {
                    skep.ui.msg.alert('오류가 발생하였습니다.');
                    reject('error');
                }
            },
            error: function () {
                skep.ui.msg.alert('오류가 발생하였습니다.');
                reject('error');
            }
        });
    })
};


// BirRegNo (-) Hypen
function formatBizRegNo(str) {
    if(!str) return '';
    
    str = str.replace(/[^0-9]/g, '');
    let tmp = '';
    if (str.length < 4) {
        return str;
    } else if (str.length < 6) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3);
        return tmp;
    } else if (str.length < 11) {
        tmp += str.substr(0, 3);
        tmp += '-';
        tmp += str.substr(3, 2);
        tmp += '-';
        tmp += str.substr(5);
        return tmp;
    }

    return str;
}

function isValidInputNumberMaxLength(maxLength) {
    if (this.value.length > maxLength) {
        return;
    }
}

//Manh End


function getUserProject(parentElementId, emptyOpt=true) {
    //const self = this;

    let LIST_USER_PJT = [];
    if(emptyOpt) LIST_USER_PJT.push({ name: "", value: "" });

    const searchParam = new URLSearchParams({
        searchText: ''
    });

    api.ajax({
        url: '/bom/popup/projects?' + searchParam.toString(),
        type: 'GET'
    }).done(function (res) {

        if (res.responseCode === 'SUCCESS') {
            for (let i = 0; i < res.result.length; i++) {

                let objCombo = new Object();
                objCombo.value = res.result[i].pjtCd;
                objCombo.name = res.result[i].pjtNm;
                LIST_USER_PJT.push(objCombo);
            }
            //TO-DO -- setParentOptions --> setOptions
            setOptions(parentElementId, LIST_USER_PJT);

        } else {
            skep.ui.msg.alertError('오류가 발생하였습니다.');
        }
    });
}

function initResizable() {
    const resizer = document.getElementsByClassName('resizer');

    if (resizer.length) {
        for (let el of resizer) {
            let gap = 2;
            const direction = el.getAttribute('data-direction') || 'horizontal';
            const dots = document.createElement('i');
            dots.className = 'mdi';

            if (direction === 'vertical') {
                dots.classList.add('mdi-dots-horizontal');
                // gap = (window.getComputedStyle(el.parentNode).gap.split('px')[0] - window.getComputedStyle(el).height.split('px')[0]) / 2;
            } else {
                dots.classList.add('mdi-dots-vertical');
                // gap = (window.getComputedStyle(el.parentNode).gap.split('px')[0] - window.getComputedStyle(el).width.split('px')[0]) / 2;

            }

            el.parentNode.style.gap = gap + 'px';
            el.appendChild(dots);
        }
    }

    const resizable = function (resizer) {
        const direction = resizer.getAttribute('data-direction') || 'horizontal';
        const prevSibling = resizer.previousElementSibling;
        const nextSibling = resizer.nextElementSibling;

        // The current position of mouse
        let x = 0;
        let y = 0;
        let prevSiblingHeight = 0;
        let prevSiblingWidth = 0;

        // Handle the mousedown event
        // that's triggered when user drags the resizer
        const mouseDownHandler = function (e) {
            // Get the current mouse position
            x = e.clientX;
            y = e.clientY;
            const rect = prevSibling.getBoundingClientRect();
            prevSiblingHeight = rect.height;
            prevSiblingWidth = rect.width;

            // Attach the listeners to document
            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler);
        };

        const mouseMoveHandler = function (e) {
            // How far the mouse has been moved
            const dx = e.clientX - x;
            const dy = e.clientY - y;

            switch (direction) {
                case 'vertical': {
                    const h =
                        ((prevSiblingHeight + dy) * 100) /
                        resizer.parentNode.getBoundingClientRect().height;
                    prevSibling.style.height = h + '%';
                    nextSibling.style.height = (100 - h) + '%';
                    break;
                }
                case 'horizontal':
                default: {
                    const w =
                        ((prevSiblingWidth + dx) * 100) / resizer.parentNode.getBoundingClientRect().width;
                    prevSibling.style.width = w + '%';
                    nextSibling.style.width = (100 - w) + '%';
                    break;
                }
            }

            const cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
            resizer.style.cursor = cursor;
            document.body.style.cursor = cursor;

            prevSibling.style.userSelect = 'none';
            prevSibling.style.pointerEvents = 'none';

            nextSibling.style.userSelect = 'none';
            nextSibling.style.pointerEvents = 'none';
        };

        const mouseUpHandler = function () {
            resizer.style.removeProperty('cursor');
            document.body.style.removeProperty('cursor');

            prevSibling.style.removeProperty('user-select');
            prevSibling.style.removeProperty('pointer-events');

            nextSibling.style.removeProperty('user-select');
            nextSibling.style.removeProperty('pointer-events');

            // Remove the handlers of mousemove and mouseup
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
        };

        // Attach the handler
        resizer.addEventListener('mousedown', mouseDownHandler);
    };

    // Query all resizers
    document.querySelectorAll('.resizer').forEach(function (ele) {
        resizable(ele);
    });
}


function pjtCdInit() {
    let LIST_PJT = [];
    LIST_PJT.push({ value: "", name: "" });
    setParentSelectOptions("searchbar-select-pjt", LIST_PJT);
};

function dateFormat(date) {
    // date format to 'yyyy-MM-dd' '2024-07-11'
    return date.getFullYear() +
	'-' + ( (date.getMonth()+1) <= 9 ? "0" + (date.getMonth()+1) : (date.getMonth()+1) )+
	'-' + ( (date.getDate()) <= 9 ? "0" + (date.getDate()) : (date.getDate()) );
}




// SB (Search Box) Reset Function - Start

// Reset <select class="searchbar-pjtCd_sb" id="searchbar-select-pjt"></select> Type 1
function resetSbPjtSbType1(){
    removeAllChildNodes(document.getElementById('searchbar-select-pjt'));
    document.getElementById('searchbar-select-pjt').appendChild(new Option("", ""))
}
function resetSbPjtSbType2() {
    removeAllChildNodes(document.getElementById('searchbar-select-pjt'));
    getUserProject('searchbar-select-pjt');
}

function resetSbDatePicker(elementId) {
    const startDate = new Date().yyyymmdd();
    const element = $('#' + elementId);
    element.data('daterangepicker').setStartDate(startDate);
    element.val(`${startDate}`);
}

function resetSbDatePickerRange(elementId) {
    const startDate = new Date().firstdayyyyymmdd();
    const endDate = new Date().yyyymmdd();
    const element = $('#' + elementId);
    element.data('daterangepicker').setStartDate(startDate);
    element.data('daterangepicker').setEndDate(endDate);
    element.val(`${startDate} ~ ${endDate}`);
}

function resetSbDatePickerRangeEmpty(ElementId) {
    document.getElementById(ElementId).value = '';
}

function resetSbDatePickerMonth(elementId) {
    const startDate = new Date().yyyymm();
    const element = $('#' + elementId);
    element.data('daterangepicker').setStartDate(startDate);
    element.val(`${startDate}`);
}

// Reset <input type="text" id="searchbar-input-vdCd_sb" />
function resetSbInput(ElementId) {
    document.getElementById(ElementId).value = '';
}

function resetSb(elementId, value) {
    let element = document.getElementById(elementId);
    let tagName = element.tagName;
    if (tagName === "SELECT") {
        if (value) {
            $("#" + elementId).val(value).change();
        } else {
            $("#" + elementId).val('').change();
        }
    }
    if (tagName === "INPUT") {
        element.value = '';
    }
}

//function resetSb(elementId, value) {
//    let element = document.getElementById(elementId);
//    let tagName = element.tagName;
//    if (tagName === "SELECT") {
//        removeAllChildNodes(element);
//        // element.appendChild(new Option("", ""))
//        for (option of value) {
//            element.appendChild(new Option(option.name, option.value))
//        }
//    }
//    if (tagName === "INPUT") {
//        element.value = value;
//    }
//}

function resetSbWithDefaultValue(elementId, value, defaultVal) {
    resetSb(elementId, value);
    if (defaultVal !== undefined) {
        document.getElementById(elementId).value = defaultVal;
    }
}

// Reset radio button
function resetSbInputRadio(radioName, numOfElement) {
    let allElement = document.querySelectorAll('input[name="' + radioName +'"]');
    if (numOfElement < 0 || allElement.length <= 0 || allElement.length < numOfElement) {
        return;
    }
    allElement.forEach(function(element, index) {
        if (index === numOfElement) {
            element.checked = true;
        } else {
            element.checked = false;
        }
    });
}

function resetSbCheckBox(ids) {
    if (ids.length === 0) {
        return;
    }
    ids.forEach(element => {
        let checkbox = document.getElementById(element);
        if (checkbox) {
            checkbox.checked = false;
        }
    });
}

// date-range
function initDefaultDatePickerRange(elementId) {
    let startDate = new Date().firstdayyyyymmdd();
    let endDate = new Date().yyyymmdd();
    $('#' + elementId).data('daterangepicker').setStartDate(startDate);
    $('#' + elementId).data('daterangepicker').setEndDate(endDate);
    $('#' + elementId).val(`${startDate} ~ ${endDate}`);
}
// date-month
function initDefaultDatePickerMonth(elementId) {
    let startDate = new Date().yyyymm();
    $('#' + elementId).data('daterangepicker').setStartDate(startDate);
    $('#' + elementId).val(startDate);
}

function initDateRangePicker() {
    
    const elemDate1 = $('.cell__content--search .datepicker__range--month');
    const elemDate2 = $('.cell__content--search .datepicker__range');

    for(elem of elemDate2) {
        const startDate = new Date().firstdayyyyymmdd();
        const endDate = new Date().yyyymmdd();
        $(elem).val(startDate + ' ~ ' + endDate);
        $(elem).data('daterangepicker').setStartDate(startDate);
        $(elem).data('daterangepicker').setEndDate(endDate);
    }
    for(elem of elemDate1) {
        $(elem).val(new Date().yyyymm() + ' ~ ' + new Date().yyyymm());
    }
}

// SB (Search Box) Reset Function - End




/** 12. Get Previous Month -  */
function getPreviousMonth(yearMonth) {
    let year = parseInt(yearMonth.slice(0,4));
    let month = parseInt(yearMonth.slice(4,6));

    month--;
    if(month === 0){
        month = 12;
        year--;
    }

    return `${year}${month.toString().padStart(2, '0')}`;

}

/** 13. Get Current Time yyyyMMddHHmmss -  */
function getCurrentTime(){
    let d = new Date();
    let currentTime = d.getFullYear() + _pad((1 + d.getMonth()), "2") + _pad(d.getDate(), "2") + d.getHours() + d.getMinutes() + d.getSeconds() + d.getMilliseconds();

    return currentTime;
}

function _pad(n, width) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}

function layerClose(el) {

    var temp = typeof el == 'string' ? $('#' + el) : $(el);
    temp.removeClass('is-show');

    $('body').removeClass('not_scroll');
    $('#wrap').css('top','inherit');
    posY = $(window).scrollTop(posY);

    // 버그 수정
    $(el).find('select:not(.select__multiple)').each(function() {
        $(this).select2('destroy');
    });
    $(el).find('.select__multiple').each(function() {
        $(this).select2('destroy');
    });

}

function isValidEmail(emailAddress){
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(emailAddress);
}