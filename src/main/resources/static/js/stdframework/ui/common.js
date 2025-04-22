$(document).ready(function() {

    // toggle
    $('.lnb__button').on('click', function (){
        $('.lnb').toggleClass('is-open');
    });

    $('.profile__button').on('click', function (){
        $('.profile__menu').toggleClass('is-open');
    });

    $('.more__button').on('click', function (){
        $(this).parent().toggleClass('is-open');
    });

    $('.sort__button').each(function() {
        $(this).on('click', function (){
            $(this).parents('.cell__content--search').toggleClass('is-open');
        });
    });

    // & close
    $(document).on('mouseup', function (e){

        if(!$('.lnb__button').is(e.target) && $('.lnb, .profile').has(e.target).length === 0){
            $('.lnb').removeClass('is-open');
            $('.lnb', parent.document).removeClass('is-open');
        }

        if(!$('.profile__button').is(e.target) && $('.lnb, .profile').has(e.target).length === 0){
            $('.profile__menu').removeClass('is-open');
            $('.profile__menu', parent.document).removeClass('is-open');

        }

        if(!$('.header__history .more__button').is(e.target) && $('.header__history').has(e.target).length === 0){
            $('.header__history .more').removeClass('is-open');
        }

        if(!$('.gnb .more__button').is(e.target) && $('.gnb .more').has(e.target).length === 0){
            $('.gnb .more').removeClass('is-open');
        }

        if(!$('.grid-more .grid-more__button').is(e.target)){
			$('.grid-more').removeClass('is-open');
		}
        
        if($('.gnb > ul').has(e.target).length === 0){
            $('.gnb li').removeClass('is-active');
        }

        $('.dropdown').each(function() {
            if($(this).hasClass('is-selected')) {
                if (!$(this).has(e.target).length) {
                    $(this).removeClass('is-selected');
                };
            }
        });
    });

    // button hover
    $('[class^=btn]').each(function() {
        var cl = $(this).attr('class'),
            cl2 = $(this).attr('class').replace(/-light|--sm|--lg/g, '').replace('btn--', 'color-');

        if(cl.indexOf('-light') >= 0) {
            cl = cl.replace('-light', ''),
                $(this).css('color', 'var(--'+ cl2 +')');
            $(this).on('mouseover', function() {
                $(this).attr('class', '')
                    .addClass(cl)
                    .css('color', 'var(--color-white)');
            }).on('mouseleave', function() {
                $(this).removeClass(cl)
                    .addClass(cl + '-light')
                    .css('color', 'var(--'+ cl2 +')');
            });
        } else {
            $(this).on('mouseover', function() {
                $(this).addClass(cl + '-active');
            }).on('mouseleave', function() {
                $(this).removeClass(cl + '-active')
                    .addClass(cl);
            });
        }
    });

    // history more(Tabs)
    if($('.header__history > ul').width() > 1600) {

        // tooltip
        $('.header__history a').each(function() {
            $(this).addClass('check');

            if($(this).width() > 78) {
                var txt = $(this).text();
                $(this).after('<div class="tooltip">'+ txt +'</div>');
                $(this).removeClass('check');
            }

        });

        $('.header__history > ul').addClass('is-flex');
        var leng = $('.header__history > ul').find('li').length;
        var i = 10;

        while(i != leng) {
            i++;
            var txt = $('.header__history > ul li').eq(i).detach();
            $('.header__history .more > ul').prepend(txt);
        }
    }


    // checkbox all
    $('.checkbox__all').each(function() {
        var $this = $(this);
        var name =  $this.attr('name');
        var boxes = $('input[name='+ name+']').not($this);

        $this.change(function () {
            var checked = $this.prop('checked');
            $('input[name='+ name +']').prop('checked', checked);
        });

        boxes.change(function () {
            var boxLength = boxes.length;
            var checkedLength = $('input[name='+ name +']:checked').not($this).length;
            var selectAll = (boxLength == checkedLength);

            $this.prop('checked', selectAll);
        });
    });

    // clear button
    $('input[type=text]:not(.datepicker), input[type=search]').each(function() {
        $(this).on('focusin keyup', function(e) {
            e.preventDefault();
            if($(this).val().length) {
                $(this).addClass('is-valid');
            } else {
                $(this).removeClass('is-valid');
            }
        })
        $(this).on('blur', function(e){
            e.preventDefault();
            $(this).removeClass('is-valid');
        });
    });

    $('.clear__button').each(function() {
        $(this).on('click', function(e) {
            e.preventDefault();
            $(this).prev('input').val('').removeClass('is-valid');
            return false;
        });
    });

    // dropdown
    $('.dropdown > .dropdown__caption').on('click', function() {
        $(this).parent().toggleClass('is-selected');
    });

    $('.dropdown > ul > li').on('click', function() {
        $('.dropdown > ul > li').removeClass('is-selected');
        $(this).addClass('is-selected').parent().parent().removeClass('is-selected').children('.dropdown__caption').text( $(this).text() );
    });

    // select2
    $('select:not(.select__multiple)').each(function() {
        if($(this).parents('.popup__content').length == 0) {
            $(this).select2({
                width: '100%;',
                dropdownCssClass : $(this).data('searchyn') == 'N' ? 'no-search' : ''
            });
        }
    });
    $('.select__multiple').each(function() {
        if($(this).parents('.popup__content').length == 0) {
            $(this).select2({
                width: '100%;',
                //	multiple: true,
                allowClear: true,
                placeholder: {
                    id: -1,
                    text: $(this).data('placeholder'),
                    dropdownCssClass : $(this).data('searchyn') == 'N' ? 'no-search' : ''
                }
            });
        }
    });

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

    $('.datepicker').each(function() {
        $(this).daterangepicker(options);
        $(this).on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD'));
        });
        $(this).on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });
    });


    $('.datepicker--month').each(function() {
        $(this).daterangepicker(options);
        $(this).on('apply.daterangepicker', function(ev, picker) {
            picker.setStartDate(picker.leftCalendar.month);
            $(this).val(picker.leftCalendar.month.format('YYYY-MM'));
        });
        $(this).on('showCalendar.daterangepicker', function(ev, picker) {
            $('.table-condensed tbody, .table-condensed thead tr:last-child').hide();
        });
        $(this).on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });
    });

    $('.datepicker__range').each(function() {
        $(this).daterangepicker($.extend(options, {
            singleDatePicker: false,
        }));
        $(this).on('apply.daterangepicker', function(ev, picker) {
            $(this).val(picker.startDate.format('YYYY-MM-DD') + ' ~ ' + picker.endDate.format('YYYY-MM-DD'));
        });
        $(this).on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });
    });

    $('.datepicker__range--month').each(function() {
        $(this).daterangepicker($.extend(options, {
            singleDatePicker: false,
        }));
        $(this).on('apply.daterangepicker', function(ev, picker) {
            picker.startDate = picker.leftCalendar.calendar[1][1];
            picker.endDate = picker.rightCalendar.calendar[1][1];
            $(picker.container).find('.drp-selected').html(picker.leftCalendar.month.format('YYYY-MM')+ ' ~ ' + picker.rightCalendar.month.format('YYYY-MM'));
            $(this).val(picker.leftCalendar.month.format('YYYY-MM') + ' ~ ' + picker.rightCalendar.month.format('YYYY-MM'));

        });
        $(this).on('showCalendar.daterangepicker', function(ev, picker) {
            $(picker.container).find('.drp-selected').html(picker.leftCalendar.month.format('YYYY-MM')+ ' ~ ' + picker.rightCalendar.month.format('YYYY-MM'));
            $(this).val(picker.leftCalendar.month.format('YYYY-MM') + ' ~ ' + picker.rightCalendar.month.format('YYYY-MM'));
            $('.table-condensed tbody, .table-condensed thead tr:last-child').hide();
        });
        $(this).on('cancel.daterangepicker', function(ev, picker) {
            $(this).val('');
        });
    });

	$('.timepicker').each(function() {
		$(this).timepicker({
			timeFormat: 'h:mm p',
			interval: 10,
			minTime: '09',
			maxTime: '6:00pm',
			defaultTime: '09',
			startTime: '09:00',
			dynamic: false,
			dropdown: true,
			scrollbar: true
		});
	});

    initHorizontalScroll();
    initResizable();
});

//popup
var posY;
function layerOpen(el){
    posY = $(window).scrollTop();

    $('body').addClass('not_scroll');
    $('#wrap').css('top',-posY);


    var temp = typeof el == 'string' ? $('#' + el) : $(el);
    temp.addClass('is-show');


    $('.popup__content select:not(.select__multiple)').each(function() {
        $(this).select2({
            width: '100%;',
        });
    });
    $('.popup__content .select__multiple').each(function() {
        $(this).select2({
            width: '100%;',
            allowClear: true,
            placeholder: {
                id: -1,
                text: $(this).data('placeholder'),
            }
        });
    });
}

function layerClose(el) {
    var temp = typeof el == 'string' ? $('#' + el) : $(el);
    temp.removeClass('is-show');

    $('body').removeClass('not_scroll');
    $('#wrap').css('top','inherit');
    posY = $(window).scrollTop(posY);


    $('.popup__content select:not(.select__multiple)').each(function() {
        $(this).select2('destroy');
    });
    $('.popup__content .select__multiple').each(function() {
        $(this).select2('destroy');
    });
}

function windowOpen(url_yn, url, title, w, h) {
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    if (url_yn == 'y') {
        var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
        if (window.focus) {
            newWindow.focus();
        }
    } else {
        var divId = $('#' + url).find('.popup__wrap').html();
        $.ajax({
            url: '/html/popup.html',
            data: {}
        }).done(function(result){
            var popupHtml = result + divId;
            var newWindow = window.open('', title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
            var doc = newWindow.document;
            doc.open();
            doc.write(popupHtml);
            doc.close();
        });
    }
}

function initHorizontalScroll() {
    const el = document.querySelector(".header__history ul");
    if(!el) return;

    el.addEventListener("wheel", e => {
        // 스크롤이 왼쪽 또는 오른쪽 끝에 도달했는지 확인
        const atLeftEnd = (el.scrollLeft === 0);
        const atRightEnd = (el.scrollLeft + el.offsetWidth >= el.scrollWidth);

        // 휠 이벤트가 위로 가는 것인지 아래로 가는 것인지 확인
        const scrollingUp = (e.deltaY < 0);
        const scrollingDown = (e.deltaY > 0);

        if ((atLeftEnd && scrollingUp) || (atRightEnd && scrollingDown)) {
            // 스크롤이 양 끝에 있고 사용자가 해당 방향으로 계속 스크롤하려고 하면,
            // 이벤트의 기본 동작을 수행하여 수직 스크론을 허용합니다.
            return;
        }

        // 그렇지 않으면, 가로 스크롤을 진행합니다.
        e.preventDefault();
        // noinspection JSSuspiciousNameCombination
        el.scrollLeft += e.deltaY;
    });
}

function initResizable() {
    const resizer = document.getElementsByClassName('resizer');

    if(resizer.length) {
        for(let el of resizer) {
            let gap = 4;
            const direction = el.getAttribute('data-direction') || 'horizontal';
            const dots = document.createElement('i');
            dots.className = 'mdi';

            if(direction === 'vertical') {
                dots.classList.add('mdi-dots-horizontal');
                gap = (window.getComputedStyle(el.parentNode).gap.split('px')[0] - window.getComputedStyle(el).height.split('px')[0]) / 2;
            } else {
                dots.classList.add('mdi-dots-vertical');
                gap = (window.getComputedStyle(el.parentNode).gap.split('px')[0] - window.getComputedStyle(el).width.split('px')[0]) / 2;
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

// tempParam Object를 URL String으로 변경해주는 함수
function objectToUrlString(tempParam){

    let param = new URLSearchParams();
    for(const key in tempParam){
        if(tempParam.hasOwnProperty(key)) {
            if(Array.isArray(tempParam[key])){
                for(const value of tempParam[key]) {
                        param.append(key+'[]',value);
        }
        } else {
            param.append(key,tempParam[key]);
        }
    }
    }
    return param.toString();
}
