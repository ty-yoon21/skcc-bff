

/**
 *  다국어 처리 관련 도움을 주는 라이브러리 입니다.
 * 
 *  i18Next와 jqueryI18next, i18nextBrowserLanguageDetector 가 필요합니다.
 * 
 *  리소스를 요청할 때 locale 구분 없이 언어 코드만 사용합니다. (ko, en)
 */
class StdfrI18next {

    /**
     * 
     * @param {Object} targetElement - localize를 수행할 영역 element를 jquery Object 로 지정합니다.
     * @param {Function} onLocalize  - localize 후 수행됩니다. 이곳에서 필요한 추가 작업을 진행합니다.
     * @param {Array} namespaces - 사용할 네임스페이스를 지정합니다.
     * @param {Boolean} useCoreNs - core 네임 스페이스 사용 여부를 지정합니다. 기본값은 true 입니다.
     * @param {Boolean} useLangComponent - 다국어 처리 모듈 사용 여부를 지정합니다. false인 경우 다국어 라이브러리 조회 API를 요청하지 않습니다. 기본값은 true입니다.
     * @param {Boolean} useAutoChanged - Event기반 자동 다국어 변경 기능 사용 여부를 지정합니다. 기본값은 true 입니다.
     * @param {String} defaultNamespace - 기본 네임스페이스를 지정합니다.
     * @param {Array} resourcePaths - 추가로 조회할 로드할 리소스 경로를 지정합니다. 문자열 배열로 입력해야합니다.
     * @param {Object} api - 별도 api 클래스를 사용하는 경우 지정합니다. 기본값은 $ 입니다.
     * @param {String} contextPath - contextPath를 사용하는 경우 지정합니다. contextPath는 /로 시작해야합니다. 마지막 /은 생략합니다. ex)/path1 => (o), /path1/ => (x)
     */
    constructor({ targetElement, onLocalize, namespaces, useCoreNs, useLangComponent, useAutoChanged, defaultNamespace, resourcePaths, api, contextPath } = {}) {

        this.targetElement = targetElement;

        if (!this.targetElement) {
            console.error('targetElement must not ne null');
        }

        this.onLocalize = onLocalize;
        if (typeof this.onLocalize !== "function") {
            console.error('localize must be function type');
        }

        this._useCoreNs = useCoreNs ?? true;
        this._useLangComonent = useLangComponent ?? true;
        this._useAutoChanged = useAutoChanged ?? true;

        this.resourcePaths = resourcePaths ?? [];
        this.namespaces = namespaces ?? [];

        if (this._useCoreNs) {
            this.namespaces = ['core', ...this.namespaces];
        }
        this._defaultNs = defaultNamespace ?? this.namespaces[0];

        this.api = api ?? $;
        this.contextPath = contextPath ?? "";
    }

    // i18next를 초기화합니다.
    init(cb) {
        const self = this;

        i18next.use(i18nextBrowserLanguageDetector).init({
            ns: [...self.namespaces],
            defaultNS: self._defaultNs,
            fallbackLng: 'ko',
        }, async (err, t) => {

            let _err = err;

            try {
                jqueryI18next.init(i18next, $, {useOptionsAttr: true});
                await self._localize(self.getLanguage());
            } catch (error) {
                _err = error;
            }
            finally {
                if (cb) cb(_err, t);
            }

        });

        if (this._useAutoChanged) {
            // 언어 변경 이벤트를 처리합니다.
            $(window).on("message", function (e) {
                var data = e.originalEvent.data;  // Should work.

                if (data.event == "GLOBAL_LANGUAGE_CHANGED") {
                    const lng = data.data;
                    self.changeLanguage(lng);
                }
            });
        }

    }



    //layout에 대해서 언어를 변경하고
    //커스텀 localize 함수가 있는 경우 실행합니다.
    async _localize(lng) {

        await this._loadResources();

        this.targetElement.localize();

        if (this.onLocalize)
            this.onLocalize(lng);
    }


    async _loadResources() {

        const self = this;
        const promises = [];

        self.namespaces.forEach((ns) => {

            if (!i18next.hasResourceBundle(self.getLanguage(), ns)) {

                if (ns == 'core') {
                    //ui-core 리소스 경로 - 고정
                    promises.push(self.getResource('/locales/stdframework/ui/{lng}/translation.json', ns, self.getLanguage()));
                } else {

                    //다국어 처리 라이브러리의 api 경로 - 고정
                    if (self._useLangComonent)
                        promises.push(self.getResource('/stdfr/ui/lang/api/v1/languages/{ns}/{lng}', ns, self.getLanguage()));

                    //사용자가 직접 입력한 경로
                    self.resourcePaths.forEach((path) => {
                        promises.push(self.getResource(path, ns, self.getLanguage()));
                    });
                }
            }
        });

        await Promise.allSettled(promises).then((results) =>
            results.filter(x => x.status === 'fulfilled').forEach((x) => {
                self.addResourceBundle(x.value.lng, x.value.ns, x.value.res);
            })
        );
    }

    getResource(path, ns, lng) {

        const self = this;
        const url = path.replaceAll('{ns}', ns).replaceAll('{lng}', lng);

        return new Promise((resolve, reject) => {
            self.api.ajax({
                dataType: "json",
                url: `${self.contextPath}${url}`,
                success: (res) => {
                    if (res.responseCode != 'FAIL') {
                        // success
                        resolve({ ns, lng, res });
                    } else {
                        // fail
                        reject(null);
                    }
                },
                error: () => {
                    reject(null);
                }
            });
        });
    }

    // resource를 추가합니다.
    addResourceBundle(lang, ns, resource) {
        i18next.addResourceBundle(lang, ns, resource, true, true);
    }

    //언어를 변경 합니다.
    changeLanguage(lng, callback) {
        const self = this;
        
        i18next.changeLanguage(lng, async () => {
            
            await self._localize(lng);
            if (callback)
                callback();
        });
    }

    t(key, options) {
        return i18next.t(key, options);
    }

    getLanguage() {
        if(i18next.language)
            return i18next.language.split('-')[0];
        else
            return i18next.language;
    }
}