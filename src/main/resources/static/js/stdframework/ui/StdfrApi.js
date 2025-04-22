/**
 * Jquery Ajax method를 wrapping한 클래스 입니다.
 * 
 * 
 * const api = new ApiWrapper([settings]);
 * 
 * settings 
 * {
 *      jquery : $,   // jquery 선택자 입니다. 기본값 $, 변경이 필요한 경우 입력 합니다.
 *      autoReload : true, //기본값 true, x-stdfr-redirect-event 을 포함하는 응답에 대해서 필요시 자동으로 화면을 reload 합니다.
 *      csrfHeader : , // csrf 헤더, csrf 사용시 추가 합니다.
 *      csrfToken :  , // csrf 토큰, csrf 사용시 추가 합니다.
 * 
 * }
 * 
 * 
 * Jquery의 ajax, get, post 와 동일하게 사용합니다.
 * api.ajax(url [, settings])
 * api.ajax([settings]);
 * 
 * api.get(url [, data ] [, success ] [, dataType ] [, progressElement] )
 * api.get([settings]);
 * 
 * api.post(url [, data ] [, success ] [, dataType ] [, progressElement] )
 * api.post([settings]);
 */
class StdfrApi{

    constructor(settings){
        this.jquery = settings?.jquery ?? $;
        this.autoReload = settings?.autoReload ?? true;
        this.csrfHeader = settings?.csrfHeader;
        this.csrfToken = settings?.csrfToken;
    }

    //ajax(url [, settings])
    //ajax([settings])
    ajax(){
        if(arguments.length === 1){

            if(typeof arguments[0] === 'string')
                return this.innerAjaxOnlyOptions({url: arguments[0]});

            return this.innerAjaxOnlyOptions(arguments[0]);
        }
        else   
            return this.innerAjax(arguments[0], arguments[1]);
    }
    
    innerAjaxOnlyOptions(options){
        return this.innerAjax(options.url, options);
    }

    innerAjax(url, options){

        let self = this;
        let ajaxOptions = {};

        if(options.progressElement) {
            skep.ui.progressSpinnerOn(options.progressElement);
        }

        Object.getOwnPropertyNames(options).forEach((value)=>{
            //Custom 로직이 들어가지 않는 property만 복사
            if(value.toLowerCase != 'success') 
                ajaxOptions[value] = options[value];
        });

        ajaxOptions.success = (data, textStatus, xhr)=>{ 
                    
            const redirectEventHeader = xhr.getResponseHeader('x-stdfr-redirect-event');
            if(redirectEventHeader && self.autoReload){
                if(redirectEventHeader == 'SESSION_EXPIRED' || redirectEventHeader == "LOGIN_REQUIRED"){
                    location.reload();
                }
            }

            if(options.success)
                options.success(data, textStatus, xhr);

        }

        if(!ajaxOptions.headers)
            ajaxOptions.headers ={};

        if(!ajaxOptions.headers["x-stdfr-redirect-mode"])
            ajaxOptions.headers["x-stdfr-redirect-mode"] = "replace";

        //csrf 있는경우
        if(this.csrfHeader && this.csrfToken && !ajaxOptions.headers[this.csrfHeader])
            ajaxOptions.headers[this.csrfHeader] = this.csrfToken;

        
        ajaxOptions.complete = (jqXHR, textStatus) => {
            if(options.progressElement) {
                skep.ui.progressSpinnerOff(options.progressElement);
            }

            if(options.complete)
                options.complete(jqXHR, textStatus);
        }
        return this.jquery.ajax(url, ajaxOptions);
    }


    //get(url [, data ] [, success ] [, dataType ] [, progressElement])
    //get([settings])
    get(){
        if(arguments.length === 1){

            if(typeof arguments[0] === 'string')
                return this.ajax({type:"GET", url: arguments[0]});

            let settings = arguments[0];
            settings['type'] = "GET";
            return this.ajax(settings);
        }
        else if(arguments.length > 1) {

            let settings = {type : "GET"};

            settings['url'] = arguments[0];

            //data 생략
            if( typeof arguments[1] === 'function') {
                settings['success'] = arguments[1];

                //dataType 생략
                if( typeof arguments[2] === 'object' ) {
                    settings['progressElement'] = arguments[3];
                } else {
                    settings['dataType'] = arguments[3];
                    settings['progressElement'] = arguments[4];
                }
            }
            else {
                settings['data'] = arguments[1];
                settings['success'] = arguments[2];

                //dataType 생략
                if( typeof arguments[3] === 'object' ) {
                    settings['progressElement'] = arguments[3];
                } else {
                    settings['dataType'] = arguments[3];
                    settings['progressElement'] = arguments[4];
                }
            }

            return this.ajax(settings);
        }
    }

    //post(url [, data ] [, success ] [, dataType ] [, progressElement] )
    //post([settings])
    post(){
        if(arguments.length === 1){

            if(typeof arguments[0] === 'string')
                return this.ajax({type:"POST", url: arguments[0]});

            let settings = arguments[0];
            settings['type'] = "POST";
            return this.ajax(settings);
        }
        else if(arguments.length > 1) {

            let settings = {type : "POST"};

            settings['url'] = arguments[0];

            //data 생략
            if( typeof arguments[1] === 'function') {
                settings['success'] = arguments[1];
                settings['dataType'] = arguments[2];

                //dataType 생략
                if( typeof arguments[2] === 'object' ) {
                    settings['progressElement'] = arguments[3];
                } else {
                    settings['dataType'] = arguments[3];
                    settings['progressElement'] = arguments[4];
                }
            }
            else {
                settings['data'] = arguments[1];
                settings['success'] = arguments[2];
                
                //dataType 생략
                if( typeof arguments[3] === 'object' ) {
                    settings['progressElement'] = arguments[3];
                } else {
                    settings['dataType'] = arguments[3];
                    settings['progressElement'] = arguments[4];
                }
            }

            return this.ajax(settings);
        }
    }

}