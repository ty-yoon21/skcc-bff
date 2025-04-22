
class StdfrContentHeader{

    constructor({targetElement, initLang, onAddFavoriteEventListener, onRemoveFavoriteEventListener } = {}){


        this._STDFR_ADD_FAVORITE_MENU = "STDFR_ADD_FAVORITE_MENU";
        this._STDFR_REMOVE_FAVORITE_MENU = "STDFR_REMOVE_FAVORITE_MENU";
        this._STDFR_OPEN_FAVORITE_MENU = "STDFR_OPEN_FAVORITE_MENU";
        this._STDFR_FAVORITE_LOCAL_STORAGE = "STDFR_FAVORITE_LOCAL_STORAGE";
        this._STDFR_MENUS_SESSION_STORAGE = "STDFR_MENUS";
        this._GLOBAL_LANGUAGE_CHANGED = "GLOBAL_LANGUAGE_CHANGED";
        this._STDFR_CHANGE_FAVORITE_MENU = "STDFR_CHANGE_FAVORITE_MENU";

        this._currentMenuId = sessionStorage.getItem("currentMenuId");
        this._target = targetElement;

        this.lang = initLang ?? 'ko';

        this.onAddFavoriteEventListener = onAddFavoriteEventListener ?? this._defaultOnAddFavoriteEventLister;
        this.onRemoveFavoriteEventListener = onRemoveFavoriteEventListener ?? this._defaultOnRemoveFavoriteEventLister;


        window.addEventListener("message", (e) => {
            if(e.origin != window.origin)
                return;
            this._eventDispatcher(e.data);    
        });

    }

    //헤더를 생성하고 이벤트를 등록 합니다.
    init({title, path}={}){
     
        const self = this;

        let _title;
        let _path;

        const currentMenu = this._getCurrentMenuInfo();

        if(title)
            _title = title;
        else {
            _title = this._isKorean(this.lang) ? currentMenu.title : currentMenu.engTitle;
        }

        if(path){
            _path = path;
        }else{
            _path = this._isKorean(this.lang) ? currentMenu.path : currentMenu.engPath;
        }
        
        let div_header = document.createElement("div");
        div_header.className = "container__header";

        let div_title = document.createElement("div");
        div_title.className = "title";
        div_header.appendChild(div_title);
        
        let btn_favorite = document.createElement("button");
        btn_favorite.id = "btnFavorite";
        btn_favorite.className = this._isFavorites(currentMenu.id) ? "ico__star--warning" : "ico__star--gray-400";
        btn_favorite.addEventListener("click", () => { self._isFavorites(currentMenu.id) ? self.onRemoveFavoriteEventListener(currentMenu, btn_favorite) : self.onAddFavoriteEventListener(currentMenu, btn_favorite)});
        div_title.appendChild(btn_favorite);

        let span_blind_favorite = document.createElement("span");
        span_blind_favorite.className = "blind";
        btn_favorite.appendChild(span_blind_favorite);
        
        let btn_title = document.createElement("button");
        btn_title.className = "title__button";
        // btn_title.addEventListener("click", () => {
        //     btn_title.classList.toggle('is-open');
        //     div_title_menu.classList.toggle('is-open');
        // });

        div_title.appendChild(btn_title);

        let h2_title = document.createElement("h2");
        h2_title.appendChild(document.createTextNode(_title));
        btn_title.appendChild(h2_title);

        let i_title = document.createElement("i");
        i_title.className = "ico__arrow-down";
        btn_title.appendChild(i_title);

        let span_blind_title = document.createElement("span");
        span_blind_title.className = "blind";
        i_title.appendChild(span_blind_title);
        

        let div_title_menu = document.createElement("div");
        div_title_menu.className = "title__menu";
        div_title.appendChild(div_title_menu);

        let ul_title_menu = document.createElement("ul");
        div_title_menu.appendChild(ul_title_menu);

        //다른곳 클릭하면 창 닫기
        document.addEventListener('click', (e) => {
            btn_title.classList.remove("is-open"); 
            div_title_menu.classList.remove('is-open');
        });

        btn_title.addEventListener("click", (e) => {

            //document의 clieck event 전파 안되도록 막아야함
            e.preventDefault();
            e.stopPropagation();
            //헤더의 즐겨찾기 목록 화살표 메뉴 클릭 이벤트를 처리 합니다.

            btn_title.classList.add("is-open"); 
            div_title_menu.classList.add('is-open');

            const favorites = JSON.parse(localStorage.getItem(this._STDFR_FAVORITE_LOCAL_STORAGE))||[];

            const nodes = favorites.map(x => {
                let element = document.createElement("li");
                let link = document.createElement("a");

                link.textContent = !self._isKorean(self.lang) ? x.engTitle : x.title;

                link.addEventListener("click", (e) => { 
                    e.preventDefault();
                    window.parent.postMessage({ 
                        event: self._STDFR_OPEN_FAVORITE_MENU,
                        msg: {
                            id: x.id,
                        }
                    }, window.origin);
                });
                element.appendChild(link);
                return element;
            });

            ul_title_menu.replaceChildren();

            nodes.forEach(element => {
                ul_title_menu.appendChild(element)    
            });

        });

        let li_title_menu = document.createElement("li");
        ul_title_menu.appendChild(li_title_menu);

        let a_title_menu = document.createElement("a");
        a_title_menu.href = "javascript:;";
        ul_title_menu.appendChild(a_title_menu);

        let div_breadcrumb = document.createElement("div");
        div_breadcrumb.className = "breadcrumb";
        div_header.appendChild(div_breadcrumb);

        let ul_breadcrumb = document.createElement("ul");
        div_breadcrumb.appendChild(ul_breadcrumb);

        _path.forEach((element, index) => {
            let li = document.createElement("li");
            
            let textNode = document.createTextNode(element);

            if(index == _path.length -1){
                let a = document.createElement("a");
                a.href = "javascript:;";
                a.appendChild(textNode);
                li.appendChild(a);
            }else{
                let p = document.createElement("p");
                p.appendChild(textNode);
                li.appendChild(p);
            }
                
            ul_breadcrumb.appendChild(li);
        });

        this._target.appendChild(div_header);
        self.setTitleMenu();
    }

    _eventDispatcher(data){

        const self = this;

        if(data.event == self._GLOBAL_LANGUAGE_CHANGED){
            // 언어 변경 이벤트를 처리합니다.
            this.changeLanguage(data.data);
        } else if(data.event == self._STDFR_CHANGE_FAVORITE_MENU) {
            // 즐겨찾기 아이콘 재설정
            this.setFavoriteIcon();
            // 헤더 즐겨찾기 목록 화살표 메뉴 재설정
            this.setTitleMenu();
        }
    }

    _isKorean(lang){
        const lowerCase = lang.toLowerCase();
        return lowerCase == 'ko' || lowerCase =="ko-kr" || lowerCase == "kr";
    }

    //현재 오픈된 메뉴 정보를 조회 합니다.
    _getCurrentMenuInfo(){

        const menus = JSON.parse(sessionStorage.getItem(this._STDFR_MENUS_SESSION_STORAGE));
        let currentMenuArchi = this._searchMenuArchi(menus, this._currentMenuId);

        if(currentMenuArchi){

            let result = {
                id : this._currentMenuId,
                title: currentMenuArchi.text,
                engTitle: currentMenuArchi.engText,
                path : ["Home", currentMenuArchi.text],
                engPath : ["Home", currentMenuArchi.engText],
                url: currentMenuArchi.url
            };

            while(currentMenuArchi.sub && currentMenuArchi.sub.length > 0){
                currentMenuArchi = currentMenuArchi.sub[0];
                result.title = currentMenuArchi.text;
                result.engTitle = currentMenuArchi.engText;
                result.url = currentMenuArchi.url;
    
                result.path.push(currentMenuArchi.text);
                result.engPath.push(currentMenuArchi.engText);
            }

            return result;
        }
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
 

    //즐겨 찾기 등록 여부를 확인 합니다.
    _isFavorites(id){
        const favorites = JSON.parse(localStorage.getItem(this._STDFR_FAVORITE_LOCAL_STORAGE))||[];
        return favorites.filter(x => x.id == id).length > 0;
    }

    //즐겨 찾기 추가 이벤트를 처리 합니다.
    _defaultOnAddFavoriteEventLister(currentMenu, element){

        window.parent.postMessage({ 
            event: this._STDFR_ADD_FAVORITE_MENU,
            msg: {
                id: currentMenu.id,
                title: currentMenu.title, 
                engTitle: currentMenu.engTitle, 
                url: currentMenu.url,
            }
        }, window.origin);

        element.classList.remove('ico__star--gray-400');
        element.classList.add('ico__star--warning');
        
    }

    //즐겨 찾기 제거 이벤트를 처리 합니다.
    _defaultOnRemoveFavoriteEventLister(currentMenu, element){

        window.parent.postMessage({ 
            event: this._STDFR_REMOVE_FAVORITE_MENU,
            msg : {
                id: currentMenu.id
            }
        }, window.origin);

        element.classList.remove('ico__star--warning');
        element.classList.add('ico__star--gray-400');
    }

    setFavoriteIcon() {
        const element = this._target.querySelector('#btnFavorite');

        if(this._isFavorites(this._currentMenuId)) {
            element.className = 'ico__star--warning';
        } else {
            element.className = 'ico__star--gray-400';
        }
    }

    setTitleMenu() {
        const favorites = JSON.parse(localStorage.getItem(this._STDFR_FAVORITE_LOCAL_STORAGE))||[];
        const i_title = document.querySelector('.title__button .ico__arrow-down');
        const div_title_menu = document.querySelector('.title__menu');

        if(favorites.length > 0) {
            i_title.style.display = 'block';
            div_title_menu.style.display = 'block';
        } else {
            i_title.style.display = 'none';
            div_title_menu.style.display = 'none';
        }
    }

    // 언어 변경시 처리
    changeLanguage(lang) {

        const self = this;
        removeAllChildNodes(self._target);
        self.lang = lang;
        self.init();

    }

}