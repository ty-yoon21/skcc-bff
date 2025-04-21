/***
 *
 *  SKEP UI Component
 *
 *
 */



/***
 *
 *  Root library
 *
 *
 */



let removeAllChildNodes = function (parent) {

    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

}


document.addEventListener("DOMContentLoaded", (event) => {

    //Theme 초기화
    $('html').attr('data-theme', localStorage.getItem('data-theme')||'light')

    console.log("DOMContentLoaded");

});








/***
 *
 *  Common Library
 *
 *
 */
if (typeof(skep) == "undefined") {

    skep = {

        userAgent: navigator.userAgent,
        userBrowser: ''

    }

}

/***
 *
 *  UI 공통 Library
 *
 *
 */
if (typeof (skep.ui) == "undefined") {

    let posY;

    skep.ui = {
        //이곳이 적절한 위치인가? 추후 개선 필요..
        postMessageToChildFrames : function (msg) {
            $('#contentsArea').find('iframe').each((i, e) => {
                e.contentWindow.postMessage(msg, window.origin);
            });
        },
        layerOpen: function(el) {

            posY = $(window).scrollTop();

            $('body').addClass('not_scroll');
            $('#wrap').css('top',-posY);

            let temp = $('#' + el);
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

            if($('#alert_content').localize != undefined) $('#alert_content').localize();
        },
        layerClose: function(el) {

            var temp;
            temp = $('#' + el);

            $('body').removeClass('not_scroll');
            $('#wrap').css('top','inherit');

            $('.popup__content select:not(.select__multiple)').each(function() {
                $(this).select2('destroy');
            });

            $('.popup__content .select__multiple').each(function() {
                $(this).select2('destroy');
            });

            temp.removeClass('is-show');


            posY = $(window).scrollTop(posY);

        },
        layerRemove: function(el) {

            $('#' + el).remove();
            $('.is-focus').focus().removeClass('is-focus');
            $("html, body").removeClass("not_scroll");
        },
        progressSpinnerOn: function (element) {

            if (element.isOnProgress)
                return;
        
            let prg1, prg2;
        
            prg1 = document.createElement("DIV");
            prg1.className = "flexgrid_progress";
        
            prg2 = document.createElement("DIV");
            prg2.className = "flexgrid_progress_svg";
            prg2.innerHTML = '<svg class="progress_svg" viewBox="25 25 50 50"><circle class="progress_svg_circle" cx="50" cy="50" r="20"/></svg>'
        
        
            element.appendChild(prg1);
            element.appendChild(prg2);
        
            prg1 = prg2 = null;
        
            element.isOnProgress = true;
        },
        progressSpinnerOff: function (element) {

            if (!element.isOnProgress)
                return;

            let el = [];
            for(let c of element.children) {
                if(c.className === 'flexgrid_progress' || c.className === 'flexgrid_progress_svg'){
                    el.push(c);
                }
            }

            el.forEach(e=>e.remove());
            
            element.isOnProgress = false;
        }
    }

}


/***
 *
 *  UI Message Box Library
 *
 *
 */

if (typeof (skep.ui.msg) == "undefined") {

    skep.ui.msg = {

        alert: function(content, content_i18n_key, title, title_i18n_key) {

            return this.createMsgBox(content, content_i18n_key, null, null, title, title_i18n_key);

        },
        alertError: function(content, content_i18n_key, title, title_i18n_key) {

            return this.createMsgBox(content, content_i18n_key, 'ERROR', null, title, title_i18n_key);

        },
        confirm: function(content, content_i18n_key, title, title_i18n_key) {

            return this.createMsgBox(content, content_i18n_key, null, 'OKCANCEL', title, title_i18n_key);
        },
        confirmYesno: function(content, content_i18n_key, title, title_i18n_key) {

            return this.createMsgBox(content, content_i18n_key, null, 'YESNO', title, title_i18n_key);

        },
        createMsgBox: function (content, content_i18n_key, icon_type, button_type, title, title_i18n_key, buttons) {

            return new Promise(function (resolve, reject) {

                let el = [];
                el[0] = document.createElement("div");
                el[0].id = "alert_content";
                el[0].className = "popup--alert";

                el[1] = document.createElement("div");
                el[1].className = "popup__wrap";

                el[2] = document.createElement("div");
                el[2].className = "popup__header";

                el[3] = document.createElement("h2");
                if(typeof title === 'string') el[3].innerHTML = title.replace("\n", "<br/>");
                else {
                    switch (icon_type) {
                        case 'ERROR': el[3].innerHTML = 'ERROR'; break;
                        case 'QUESTION': el[3].innerHTML = 'QUESTION'; break;
                        case 'STOP': el[3].innerHTML = 'STOP'; break;
                        default: el[3].innerHTML = 'INFORMATION'; break;	//INFORMATION
                    }
                }
                if(title_i18n_key) el[3].dataset.i18n = title_i18n_key;

                el[4] = document.createElement("div");
                el[4].className = "popup__content";

                el[5] = document.createElement("div");
                el[5].className = "grid--full";

                el[6] = document.createElement("div");
                el[6].className = "grid__cell";

                el[7] = document.createElement("div");
                el[7].className = "cell__content";

                el[8] = document.createElement("div");
                el[8].className = "message";

                el[9] = document.createElement("i");
                switch (icon_type) {
                    case 'ERROR': el[9].className = "ico__stop--warning"; break;
                    case 'QUESTION': el[9].className = "ico__question--success"; break;
                    case 'STOP': el[9].className = "ico__stop--danger"; break;
                    default: el[9].className = "ico__info--primary"; break;	//INFORMATION
                }

                el[10] = document.createElement("p");
                if(typeof content === 'string') el[10].innerHTML = content.replace("\n", "<br/>");
                el[10].setAttribute('style', 'word-break: break-all');
                if(content_i18n_key) el[10].dataset.i18n = content_i18n_key;

                el[11] = document.createElement("div");
                el[11].className = "button__group--center";

                el[0].appendChild(el[1]);
                el[1].appendChild(el[2]);
                el[2].appendChild(el[3]);
                el[1].appendChild(el[4]);
                el[4].appendChild(el[5]);
                el[5].appendChild(el[6]);
                el[6].appendChild(el[7]);
                el[7].appendChild(el[8]);
                el[8].appendChild(el[9]);
                el[8].appendChild(el[10]);
                el[7].appendChild(el[11]);

                if(!buttons) {
                    switch(button_type) {
                        case 'OKCANCEL':
                            el[12] = document.createElement("button");
                            el[12].className = "btn--primary";
                            el[12].onclick = function() {resolve(true); skep.ui.layerRemove('alert_content');}
                            el[12].innerHTML = "확인";
                            el[12].dataset.i18n = "stdframework.core.button.OK";

                            el[13] = document.createElement("button");
                            el[13].className = "btn__close btn--outline--gray-500";
                            el[13].onclick = function() {resolve(false); skep.ui.layerRemove('alert_content');}
                            el[13].innerHTML = "취소";
                            el[13].dataset.i18n = "stdframework.core.button.cancel";

                            el[11].appendChild(el[12]);
                            el[11].appendChild(el[13]);
                            break;
                        case 'YESNO':
                            el[12] = document.createElement("button");
                            el[12].className = "btn--primary";
                            el[12].onclick = function() {resolve(true); skep.ui.layerRemove('alert_content');}
                            el[12].innerHTML = "예";
                            el[12].dataset.i18n = "stdframework.core.button.yes";

                            el[13] = document.createElement("button");
                            el[13].className = "btn__close btn--outline--gray-500";
                            el[13].onclick = function() {resolve(false); skep.ui.layerRemove('alert_content');}
                            el[13].innerHTML = "아니오";
                            el[13].dataset.i18n = "stdframework.core.button.no";

                            el[11].appendChild(el[12]);
                            el[11].appendChild(el[13]);
                            break;
                        default:
                            el[12] = document.createElement("button");
                            el[12].className = "btn--primary";
                            el[12].onclick = function() {resolve(true); skep.ui.layerRemove('alert_content');}
                            el[12].innerHTML = "확인";
                            el[12].dataset.i18n = "stdframework.core.button.OK";

                            el[11].appendChild(el[12]);
                            break;
                    }

                } else {

                    for(let button of buttons) {
                        el[el.length] = document.createElement("button");
                        for (let entry of Object.entries(button)) {
                            el[el.length - 1][entry[0]] = entry[1];
                            el[11].appendChild(el[el.length-1]);
                        }
                    }

                }

                window.document.body.appendChild(el[0]);

                skep.ui.layerOpen('alert_content');
            });

        }
    }

}


/***
 * @name
 * skep.ui.menuList
 *
 * @description
 *  LNB - Menu Tree Component
 *
 * @parameter
 *    menuList: 메뉴 JSON List
 *       {
 *           "id": "메뉴ID",
 *           "text": "메뉴명",
 *           "url": "about:blank;
 *           "sub" : [{
 *               "id": "1",
 *               "text": "서브메뉴명",
 *               "url": "메뉴URL"
 *               "sub" : [{...}]
 *           }]
 *       }
 *    menuTab: Menu Tab Component
 *
 * @author
 *
 *
 */
if (typeof (skep.ui.menuList) == "undefined") {

    skep.ui.menuList = function(menuList=[], menuTab, language) {

        /** lnb element check */
        if (document.getElementById("lnb") == null) return;
        if (!menuTab instanceof skep.ui.menuTab) return;

        this.language = language;
        this.config = {

            searchArea: "gnb__search",
            menuListArea: "lnb__allmenu",
            menuListAreaList: "lnb__allmenu_ul"

        }

        this._menuList = [];

        let t = this;



        this.createMenu = function(menuList=[]) {

            let createSubMenu = function(menuList=[], rootElement) {

                if (menuList.length > 0) {

                    let ul = document.createElement("ul");

                    menuList.forEach(function(menu) {

                        const engText = menu.engText ? menu.engText : 'No Menu Name';
                        const text = t.language == 'en' ? engText : menu.text;

                        let li = document.createElement("li");
                        li.id = menu.id;
                        if ((menu.sub||[]).length > 0) li.className = "has-sub";

                        let a = document.createElement("a");

                        a.href = "javascript:;";
                        a.textContent = text;

                        if (menu.url) {

                            a.setAttribute("data-url", menu.url);

                            a.addEventListener("click", function (event) {

                                menuTab.addTab(menu.id, menu.text, menu.url, t.language, menu.engText)
                                event.preventDefault();
                                event.stopPropagation();

                                return false;

                            });

                        }

                        li.appendChild(a);
                        ul.appendChild(li);

                        createSubMenu(menu.sub, li);

                    });

                    rootElement.appendChild(ul);
                }

            }
            menuList.forEach((menu) => {

                const engText = menu.engText ? menu.engText : 'No Menu Name';
                const text = t.language == 'en' ? engText : menu.text;

                let li = document.createElement("li");
                li.id = menu.id;
                if ((menu.sub||[]).length > 0) li.className = "has-sub";

                let a = document.createElement("a");

                a.href = "javascript:;";
                a.textContent = text;

                if (menu.url) {

                    a.setAttribute("data-url", menu.url);

                    a.addEventListener("click", function (event) {

                        menuTab.addTab(menu.id, text, menu.url)
                        event.preventDefault();
                        event.stopPropagation();

                        return false;

                    });

                }

                li.appendChild(a);

                createSubMenu(menu.sub, li);

                document.getElementById(this.config.menuListAreaList).appendChild(li);

            })

            // sub menu
            $('.has-sub > a').each(function() {
                $(this).on('click', function() {
                    $(this).parent().siblings().removeClass('is-active');
                    $(this).parent().find('li').removeClass('is-active');
                    $(this).parent().toggleClass('is-active');
                });
            });


        }

        this.changeLanguage = function(lang) {
            t.language = lang;
            if(menuList.length <= 0) return;

            const flattenStructure = entries => (
                entries
                .flatMap(entry => [entry, ...flattenStructure(entry.sub || [])])
                .flat()
            )
            const flattenMenuDatas = flattenStructure(menuList);

            $('#lnb__allmenu_ul a').each(function(idx) {
                if(lang == 'ko') {
                    $(this).text(flattenMenuDatas[idx].text);
                } else {
                    $(this).text(flattenMenuDatas[idx].engText ? flattenMenuDatas[idx].engText : 'No Menu Name');
                }
            });
        }


        if (menuList.length > 0) {

            this.createMenu(menuList)

        }

    }




}




/***
 * @name
 * skep.ui.menuTab
 *
 * @description
 *  GNB - Menu Tabbar Component
 *
 * @parameter
 *  el : Tabbar Div Tag Element ID
 *
 * @author
 *
 *
 */
if (typeof (skep.ui.menuTab) == "undefined") {

    skep.ui.menuTab = function(el) {

        /** Parameter Check */
        if (typeof el != "string" || document.getElementById(el) == null) return;

        /** Contents Area Check */
        if (document.getElementById("contentsArea") == null) {

            console.error("contentsArea is not found!!");
            return;

        }
        this.config = {

            selectClassName : "is-current",
            closeClassName : "ico__close",
            headerHeight : document.getElementById("header").offsetHeight

        }

        this.el = el;
        this.tabs = [];

        let ul = document.createElement("ul");
        ul.classList.add("is-flex");

        const scrollLength = 300;
        const leftArrowArea = document.createElement('div');
        leftArrowArea.className = 'move-btn';
        leftArrowArea.style.display = 'none';
        const leftArrow = document.createElement('i');
        leftArrow.className = 'mdi mdi-chevron-left';
        leftArrowArea.appendChild(leftArrow);

        leftArrowArea.onclick = function () {
            ul.scrollLeft -= scrollLength;
        }

        const rightArrowArea = document.createElement('div');
        rightArrowArea.className = 'move-btn';
        rightArrowArea.style.display = 'none';
        const rightArrow = document.createElement('i');
        rightArrow.className = 'mdi mdi-chevron-right';
        rightArrowArea.appendChild(rightArrow);

        rightArrowArea.onclick = function () {
            ul.scrollLeft += scrollLength;
        }

        document.getElementById(this.el).appendChild(leftArrowArea);
        this.tabsArea = document.getElementById(this.el).appendChild(ul);
        document.getElementById(this.el).appendChild(rightArrowArea);

        this.contentsArea = document.getElementById("contentsArea");

        let t = this;

        window.addEventListener("resize", (event) => {

            t.reSize();
            event.preventDefault();

        });


        this.findTab = function (id) {

            return t.tabs.find(t => t.id == id)||null;

        }

        this.addTab = function (id, text, url="about:blank;", language, engText) {

            /** Check Menu Tab ID */
            if (t.findTab(id) != null) {

                t.selectTab(id);
                return;

            }

            /** Create Tab Area */
            let ta1, ta2, ta3, ta4;

            ta1 = document.createElement("li");
            ta2 = document.createElement("a");

            ta2.innerText = language == 'en' ? engText : text;
            ta2.addEventListener("click", function () {

                t.selectTab(id);

            });

            ta3 = document.createElement("button");

            ta3.className = t.config.closeClassName;
            ta3.addEventListener("click", function () {

                t.closeTab(id)

            });

            ta4 = document.createElement("span");

            ta4.className = "blind";
            ta4.innerText = "삭제";

            ta3.appendChild(ta4);
            ta1.appendChild(ta2);
            ta1.appendChild(ta3);

            t.tabsArea.appendChild(ta1);


            /** Create Contents Area */
            let ca1, ca2;

            ca1 = document.createElement("div");
            ca1.classList.add("menuTabCell")
            ca1.style.position = "absolute";
            ca1.style.visibility = "visible";

            ca1.style.top = "0px";
            ca1.style.zIndex = 1;
            ca1.style.left = "0px";

            
            ca2 = document.createElement("iframe");
            skep.ui.progressSpinnerOn(ca1);
            ca2.onload = function() {
                t.setSize(ca1);
                skep.ui.progressSpinnerOff(ca1);
            };

            ca2.style.border = 0;
            ca2.width = "100%";
            ca2.height = "100%";
            ca2.position = "relative";
            ca2.src = encodeURI(url); //TODO &,? replace


            ca1.appendChild(ca2);


            t.contentsArea.appendChild(ca1);
            t.tabs.push({id: id , ta: ta1, ca: ca1, text, engText});

            t.selectTab(id);
            
            if(ta2.offsetWidth >= 150){
                ta2.parentNode.insertBefore(t.tooltip(language == 'en' ? engText : text), ta2.nextSibling)
            }

            document.querySelector('.header__history ul').style.flex = 1;
            // 탭이 1개 이상 있으면 버튼 보임
            const moveBtn = document.getElementsByClassName('move-btn');
            for(let btn of moveBtn) {
                btn.style.display = 'flex';
            }

            t.tabs[t.tabs.length - 1].ta.scrollIntoView();
        };

        this.selectTab = function (id) {

            /** Tab Area */
            t.tabsArea.childNodes.forEach(el => el.classList.remove(t.config.selectClassName));
            t.findTab(id).ta.classList.add(t.config.selectClassName);

            /** Contents Area */
            //t.contentsArea.childNodes.forEach(el => el.style.visibility = "hidden");
            t.tabs.forEach(tab => tab.ca.style.visibility = "hidden");
            t.findTab(id).ca.style.visibility = "visible";


            /** Menu Layer hide */
            $('.lnb').removeClass('is-open');

            /** Event */
            t.onSelect(id);

            // session 저장
            sessionStorage.removeItem("currentMenuId");
            sessionStorage.setItem("currentMenuId", id);

        }

        this.closeTab = function (id) {

            /** Tab Index */
            let i = t.tabs.indexOf(t.findTab(id));

            t.tabsArea.removeChild(t.findTab(id).ta);
            t.contentsArea.removeChild(t.findTab(id).ca);
            t.tabs.splice(i, 1);

            /** Event */
            t.onClose(id)


            if (t.tabs.length == 0) return;

            /** Select previous tab when last tab closing **/
            if (t.tabs.length == i) i--;

            t.selectTab(t.tabs[i].id);

        }

        this.closeAllTab = function () {

            t.tabs.forEach(el => t.tabsArea.removeChild(t.ta))
            t.tabs.forEach(el => t.contentsArea.removeChild(t.ca))
            t.tabs = [];

        }


        this.setSize = function (el) {

            el.style.width = parseInt(window.innerWidth) +"px";
            el.style.height = parseInt(window.innerHeight - t.config.headerHeight) +"px";

            for(let node of el.childNodes) {
                if(node.nodeName === 'IFRAME') {
                    let container =  node?.contentDocument?.getElementById("container");
                    if(container){
                        container.style.height = el.style.height;
                        container.style.width = el.style.width;
                    }
                }
            }
        }


        this.reSize = function () {

            //t.contentsArea.childNodes.forEach(el => this.setSize(el));
            t.tabs.forEach(el => this.setSize(el.ca));

        }

        this.tooltip = function (text) {
            let tt;

            tt = document.createElement('div');
            tt.className = 'tooltip';
            tt.innerHTML = text;

            return tt;
        }
        
        this.changeLanguage = function (language) {
            if(menuTab.tabsArea.children.length <= 0) return;

            t.tabs.forEach(tab => {
                if(language == 'en') {
                    $(tab.ta).find('a').text(tab.engText);
                    if($(tab.ta).find('.tooltip').length > 0) {
                        $(tab.ta).find('.tooltip').text(tab.engText);
                    }
                } else {
                    $(tab.ta).find('a').text(tab.text);
                    if($(tab.ta).find('.tooltip').length > 0) {
                        $(tab.ta).find('.tooltip').text(tab.text);
                    }
                }
            });
        }
    }


    skep.ui.menuTab.prototype.onClose = function(tabId) {
        if(this.tabs.length <= 0) {
            const moveBtn = document.getElementsByClassName('move-btn');
            for(let btn of moveBtn) {
                btn.style.display = 'none';
            }
        }
    }

    skep.ui.menuTab.prototype.onSelect = function(tabId) {

    }


}