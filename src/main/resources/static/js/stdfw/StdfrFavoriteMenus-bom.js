
class StdfrFavoriteMenus{

    constructor({targetElement, initLang, onOpenfavoriteListener, menuSyncPlugin} = {}){

        this._STDFR_ADD_FAVORITE_MENU = "STDFR_ADD_FAVORITE_MENU";
        this._STDFR_REMOVE_FAVORITE_MENU = "STDFR_REMOVE_FAVORITE_MENU";
        this._STDFR_FAVORITE_LOCAL_STORAGE = "STDFR_FAVORITE_LOCAL_STORAGE";
        this._STDFR_MENUS_SESSION_STORAGE = "STDFR_MENUS";
        this._STDFR_OPEN_FAVORITE_MENU = "STDFR_OPEN_FAVORITE_MENU";
        this._STDFR_CHANGE_FAVORITE_MENU = "STDFR_CHANGE_FAVORITE_MENU";

        this._target = targetElement;

        this._favoritesUl = null;

        this.lang = initLang ?? 'ko';

        this._onOpenFavoriteListener = onOpenfavoriteListener;
        this._menuSyncPlugin = menuSyncPlugin;

        this.popupConfig = {
            favoriteGridId: 'favoriteGrid',
            isExist: false,
        };
        this.favoriteGrid = null;

        window.addEventListener("message", (e) => {
            if(e.origin != window.origin)
                return;
            this._eventDispatcher(e.data);
        });

        this._init();
    }

    _init(){

        const self = this;

        let lnb__shortcut = document.createElement('div');
        lnb__shortcut.className = "lnb__shortcut";
        lnb__shortcut.id = "lnb__shortcut";

        self._target.appendChild(lnb__shortcut);

        let ul = document.createElement('ul');
        lnb__shortcut.appendChild(ul);

        let li = document.createElement('li');
        li.classList.add('has-sub', 'is-active');
        ul.appendChild(li);

        let a = document.createElement('a');
        a.href = "javascript:";
        a.appendChild(document.createTextNode('즐겨찾기'));

        li.appendChild(a);

        let i_edit_favorite = document.createElement('i');
        i_edit_favorite.classList.add('edit-favorite');
        i_edit_favorite.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                self.openPopup();
        });

        a.appendChild(i_edit_favorite);

        let lnb__shortcut_ul = document.createElement('ul');
        lnb__shortcut_ul.id = 'lnb__shortcut_ul';
        li.appendChild(lnb__shortcut_ul);

        self._favoritesUl = lnb__shortcut_ul;

        if(self._menuSyncPlugin)
            self._menuSyncPlugin.load(() => {self.refreshFavoritesList();});
        else
            self.refreshFavoritesList();

    }

    refreshFavoritesList(){
        const self = this;

        //clear
        let parent  = this._favoritesUl;
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }

        const favorites = this.getFavorites();

        favorites.forEach((element) => {

            let li = document.createElement("li");
            let a = document.createElement("a");
            a.href = "javascript:;";

            const text = self._isKorean(self.lang) ? element.title : element.engTitle;
            a.textContent = element.favoriteName ?? text;

            a.addEventListener("click", function (event) {
                /** smis 용 추가 (즐겨찾기 등록된 메뉴 클릭 )*/
                let isOpenTab = document.querySelector('#menuTabsArea > ul > li > button') == null ? false:true;
                if(isOpenTab) {
                    document.querySelector('#menuTabsArea > ul > li > button').click();
                }

                self._onOpenFavoriteListener(element);
            });

            let btn = document.createElement("button");
            btn.className = "ico__close";
            btn.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();
                self.removeFavoriteMenus(element.id);
            });

            let span = document.createElement("span");
            span.className = "blind";
            span.textContent = "삭제";

            btn.appendChild(span);
            a.appendChild(btn);
            li.appendChild(a);

            self._favoritesUl.appendChild(li);
        })
    }

    /**
     * 즐겨 찾기 목록을 반환합니다.
     * @returns
     */
    getFavorites(){
        return JSON.parse(localStorage.getItem(this._STDFR_FAVORITE_LOCAL_STORAGE))||[];
    }

    /**
     * 기존 즐겨찾기 목록을 입력받은 즐겨 찾기 목록으로 변경 합니다.
     * @param {Array} favorites
     */
    updateFavorites(favorites){
        localStorage.setItem(this._STDFR_FAVORITE_LOCAL_STORAGE, JSON.stringify(favorites));
        this.refreshFavoritesList();

        if(this._menuSyncPlugin)
            this._menuSyncPlugin.sync();

        skep.ui.postMessageToChildFrames({
            event: this._STDFR_CHANGE_FAVORITE_MENU,
        });
    }


    _isKorean(lang){
        const lowerCase = lang.toLowerCase();
        return lowerCase == 'ko' || lowerCase =="ko-kr" || lowerCase == "kr";
    }


    _eventDispatcher(data){

        const self = this;

        if(data.event == self._STDFR_ADD_FAVORITE_MENU){
            //즐겨찾기 추가 메시지를 처리 합니다.
            this.addFavoriteMenu(data.msg);

        }else if (data.event == self._STDFR_REMOVE_FAVORITE_MENU){
            //즐겨찾기 삭제 메시지를 처리 합니다.
            this.removeFavoriteMenus(data.msg.id);
        } else if (data.event == self._STDFR_OPEN_FAVORITE_MENU){
            //즐겨찾기 오픈 메시지를 처리 합니다.

            const favorites = this.getFavorites();

            const openedItem = favorites.filter(x => x.id == data.msg.id)[0];
            self._onOpenFavoriteListener(openedItem);
        }
    }

    /**
     * 즐겨 찾기를 추가 합니다.
     * @param {*} param0
     * @returns
     */
    addFavoriteMenu({id, favoriteName, title, engTitle, url} = {}){

        const self = this;

        let newData = {
            id,
            favoriteName,
            title,
            engTitle,
            url
        }

        const favorites = self.getFavorites();

        newData["favoriteName"] = newData.favoriteName ?? (self._isKorean(self.lang) ? newData.title : newData.engTitle);

        if(favorites.filter(x => x.id == newData.id).length > 0)
            return;

        favorites.push(newData);

        this.updateFavorites(favorites);
    }


    /**
     * 즐겨 찾기를 제거 합니다.
     * @param {*} id
     */
    removeFavoriteMenus(id){
        const self = this;
        const favorites = self.getFavorites();

        this.updateFavorites(favorites.filter(x => x.id != id));

    }

    /**
     * 즐겨 찾기 팝업을 생성합니다.
     */
    openPopup() {
        if(!this.popupConfig.isExist) {
            this.createFavoritePopup();
            this.initFavoriteGrid();
            this.addPopupEventHandler();
            this.popupConfig.isExist = true;
            this.popupChangeLanguage(this.lang);
        }

        this.loadFavoriteGridData();
        layerOpen('popupFavorite');
    }

    /**
     * 메인 화면 메뉴 리스트의 즐겨 찾기 팝업 element를 생성 합니다.
     */
    createFavoritePopup() {

        let el = [];
        el[0] = document.createElement("div");
        el[0].id = "popupFavorite";
        el[0].className = "popup";

        el[1] = document.createElement("div");
        el[1].className = "popup__wrap";

        el[2] = document.createElement("div");
        el[2].className = "popup__header";

        el[3] = document.createElement("h2");
        el[3].innerHTML = '즐겨찾기 목록';

        el[4] = document.createElement("button");
        el[4].className = "ico__close";

        el[5] = document.createElement("span");
        el[5].className = "blind";
        el[5].innerHTML = '닫기';

        el[6] = document.createElement("div");
        el[6].className = "popup__content";

        el[7] = document.createElement("div");
        el[7].className = "grid--full";

        el[8] = document.createElement("div");
        el[8].className = "grid__cell";

        el[9] = document.createElement("div");
        el[9].className = "cell__header";

        el[10] = document.createElement("div");
        el[10].className = "title";

        el[11] = document.createElement("strong");
        el[11].innerHTML = '즐겨찾기 목록';

        el[12] = document.createElement("div");
        el[12].className = "button__group";

        el[13] = document.createElement("button");
        el[13].id = "up";
        el[13].className = "btn--sm--outline--dark";
        el[13].innerHTML = '▲';

        el[14] = document.createElement("button");
        el[14].id = "down";
        el[14].className = "btn--sm--outline--dark";
        el[14].innerHTML = '▼';

        el[15] = document.createElement("button");
        el[15].id = "delete";
        el[15].className = "btn--sm--danger";
        el[15].innerHTML = '삭제';

        el[16] = document.createElement("div");
        el[16].className = "cell__content";

        el[17] = document.createElement("div");
        el[17].id = this.popupConfig.favoriteGridId;
        el[17].className = "wj-user-grid";
        el[17].setAttribute('style', 'height: 300px');

        el[18] = document.createElement("div");
        el[18].className = "grid__cell";

        el[19] = document.createElement("div");
        el[19].className = "button__group--center";

        el[20] = document.createElement("button");
        el[20].id = "regist";
        el[20].className = "btn--lg--primary";
        el[20].innerHTML = '저장';

        el[21] = document.createElement("button");
        el[21].className = "btn--lg--outline--gray-500 btn__close";
        el[21].innerHTML = '취소';
        el[21].onclick =  function(){ layerClose('popupFavorite'); }

        el[0].appendChild(el[1]);
        el[1].appendChild(el[2]);
        el[2].appendChild(el[3]);
        el[2].appendChild(el[4]);
        el[4].appendChild(el[5]);
        el[1].appendChild(el[6]);
        el[6].appendChild(el[7]);
        el[7].appendChild(el[8]);
        el[8].appendChild(el[9]);
        el[9].appendChild(el[10]);
        el[10].appendChild(el[11]);
        el[9].appendChild(el[12]);
        el[12].appendChild(el[13]);
        el[12].appendChild(el[14]);
        el[12].appendChild(el[15]);
        el[8].appendChild(el[16]);
        el[16].appendChild(el[17]);
        el[7].appendChild(el[18]);
        el[18].appendChild(el[19]);
        el[19].appendChild(el[20]);
        el[19].appendChild(el[21]);

        document.body.appendChild(el[0]);
    }

    /**
     * 즐겨 찾기 그리드를 초기화합니다.
     */
    initFavoriteGrid() {
        const self = this;
        let favoriteColumns = [
            { binding: 'no', header: 'No', width: 50, isReadOnly: true, align: "center" },
            { binding: 'favoriteName', header: '즐겨찾기 명', width: 300, isReadOnly: false },
            { binding: 'title', header: '메뉴 이름', width: 300, isReadOnly: true },
            { binding: 'engTitle', header: 'menu name', width: 300, isReadOnly: true },
            { binding: 'menuPath', header: '경로', width: 400, isReadOnly: true },
            { binding: 'engMenuPath', header: 'menu path', width: 400, isReadOnly: true }
        ];

        if(self._isKorean(self.lang)) {
            favoriteColumns[3].visible = false;
            favoriteColumns[5].visible = false;
        } else {
            favoriteColumns[2].visible = false;
            favoriteColumns[4].visible = false;
        }

        const favoriteGridId =  '#' + self.popupConfig.favoriteGridId;

        self.favoriteGrid = skepStdWijmo.flexGrid.init(favoriteGridId, {
            anchorCursor: true,
            selectionMode: wijmo.grid.SelectionMode.Row,
            columns: favoriteColumns,
            allowResizing: wijmo.grid.AllowResizing.Both,
            beginningEdit: (s, e) => {
                const col = s.columns[e.col];
                let editedItem = s.collectionView.sourceCollection[e.row];
                const itemsAdded = s.collectionView.itemsAdded.map(arr=>arr);
                const isAddedRow = $.inArray(editedItem, itemsAdded) == -1 ? false : true;

                if(!isAddedRow && col.binding != 'favoriteName') {
                    e.cancel = true;
                }
            }
        });

        skepStdWijmo.flexGrid.rowChecker(self.favoriteGrid);
    }

    /**
     * 즐겨 찾기 데이터를 로드합니다.
     */
    loadFavoriteGridData() {

        const self = this;

        if(!self.favoriteGrid){
            throw new Error('Grid is not initiated.');
        }
        const menus = JSON.parse(sessionStorage.getItem(self._STDFR_MENUS_SESSION_STORAGE));
        const list = JSON.parse(localStorage.getItem("STDFR_FAVORITE_LOCAL_STORAGE"))||[];

        self.favoriteGrid.itemsSource.sourceCollection = list.map((x, index) => {

            const menuId = x.id;
            let currentMenuArchi = self._searchMenuArchi(menus, menuId);

            const menuPath = ["Home", ];
            const engMenuPath = ["Home", ]

            if(currentMenuArchi) {
                menuPath.push(currentMenuArchi.text);
                engMenuPath.push(currentMenuArchi.engText);

                while(currentMenuArchi.sub && currentMenuArchi.sub.length > 0){
                    currentMenuArchi = currentMenuArchi.sub[0];
                    menuPath.push(currentMenuArchi.text);
                    engMenuPath.push(currentMenuArchi.engText);
                }
            }

            return{
                ...x,
                no: index + 1,
                menuPath: menuPath.join(' > '),
                engMenuPath: engMenuPath.join(' > '),
            }
        });
    }

    //메뉴 트리 구조에서 직계 메뉴 구조를 찾습니다.
    _searchMenuArchi(menus, searchMenuId){

        for(let i = 0; i < menus.length; i++){
            if(menus[i].id == searchMenuId)
                return menus[i];

            if(menus[i].sub && menus[i].sub.length > 0) {
                const find = this._searchMenuArchi(menus[i].sub, searchMenuId);
                if(find){
                    menus[i].sub = [find];
                    return menus[i];
                }
            }
        }
    }

    /**
     * 즐겨 찾기 팝업 버튼 이벤트를 바인드합니다.
     */
    addPopupEventHandler() {
        let self = this;

        if(!self.favoriteGrid){
            throw new Error('Grid is not initiated.');
        }

        // 위
        $(document).on('click', '#up', function() {

            skepStdWijmo.flexGrid.rowMoveUp(self.favoriteGrid);
        });

        // 아래
        $(document).on('click', '#down', function() {

            skepStdWijmo.flexGrid.rowMoveDown(self.favoriteGrid);
        });

        // 삭제
        $(document).on('click', '#delete', function() {

            const checkedItems = self.favoriteGrid.selectedItems;

            if(checkedItems.length == 0) {
                skep.ui.msg.alert('삭제할 항목을 선택해주세요.', "stdframework.cm.favorite.msg.delete_noItem");
                return;
            }

            skepStdWijmo.flexGrid.delRows(self.favoriteGrid);
        });

        // 저장
        $(document).on('click', '#regist', function() {

            self.saveFavoritePopup();
        })

        // 닫기
        $('#popupFavorite .ico__close').click(function(e) {

            e.preventDefault();
            e.stopPropagation();

            if (self.favoriteGrid.itemsSource.itemsRemoved.length > 0) {

                skep.ui.msg.confirmYesno('저장되지 않은 항목이 있습니다. 변경사항을 폐기하시겠습니까?', "stdframework.cm.favorite.msg.existNotSaveItem")
                .then(result => {
                    if (!result) {
                        return;
                    }
                    layerClose('popupFavorite');
                });
            } else {
                layerClose('popupFavorite');
            }
        });
    }

    /**
     * 즐겨 찾기 팝업 저장 내역을 검증하고 저장합니다.
     */
    saveFavoritePopup() {
        let self = this;

        if(!self.favoriteGrid){
            throw new Error('Grid is not initiated.');
        }

        if (!self.saveFavoriteValidation()) return;

        skep.ui.msg.confirmYesno('저장하시겠습니까?', "stdframework.cm.favorite.msg.confirmSave")
            .then(result => {

                if (!result) return;

                // const data = {
                //     saveItems: JSON.stringify(self.favoriteGrid.itemsSource.sourceCollection.map(function(arr){ return arr}))
                // }

                const data = self.favoriteGrid.itemsSource.sourceCollection.map(x=>x);
                self.saveFavorite(data);
                layerClose('popupFavorite');

            });
    }

    /**
     * 즐겨 찾기 팝업 저장 내역을 검증합니다.
     * @returns 검증 결과
     */
    saveFavoriteValidation() {

        let result = true;

        this.favoriteGrid.itemsSource.sourceCollection.map(x => {
            if(x.id === '') { // menu id
                skep.ui.msg.alert('즐겨찾기 정보를 확인해주세요.', 'stdframework.cm.favorite.msg.confirmSaveData');
                result = false;
            }
        });

        return result;
    }

    /**
     * 즐겨 찾기 팝업 내역을 저장합니다.
     * @param {*} data
     */
    saveFavorite(data) {
        let self = this;

        this.updateFavorites(data);
    }

    /**
     * 즐겨 찾기 언어를 변경합니다.
     * @param lang
     */
    changeLanguage(lang) {
        let self = this;
        self.lang = lang;

        self.popupChangeLanguage(self.lang);
    }

    /**
     * 즐겨 찾기 팝업 언어를 변경합니다.
     */
    popupChangeLanguage(lang) {
        const self = this;

        //다국어 처리 관련 부분은 추후 추가 개선 진행...

        if(!self.popupConfig.isExist) return;


        if(self.favoriteGrid == null) return;

        if($('#popupFavorite').localize)
            $('#popupFavorite').localize();

        if(self._isKorean(lang)) {
            self.favoriteGrid.columns[2].visible = true;
            self.favoriteGrid.columns[3].visible = false;
            self.favoriteGrid.columns[4].visible = true;
            self.favoriteGrid.columns[5].visible = false;
        } else {
            self.favoriteGrid.columns[2].visible = false;
            self.favoriteGrid.columns[3].visible = true;
            self.favoriteGrid.columns[4].visible = false;
            self.favoriteGrid.columns[5].visible = true;
        }
   }
}