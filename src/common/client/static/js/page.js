/**
 * @require bigpipe.js
 *
 * 使用方式
 */
(function(root) {
    var Util = root.BigPipeUtil;
    var Event = root.BigPipeEvent;
    var BigPipe = root.BigPipe;
    var urlReg = /^(?:[^:]+:)?(?:\/\/[^\/]*)?([^#]*)?(?:#(.*))?$/i;
    var Page = {};

    var appOptions = {
        selector: "a,[data-href]",
        // cacheMaxTime: 5 * 60 * 1000,
        layer : null,
        validate: null
    };

    var started = false;
    var canPushState = !!window.history.pushState;
    var layer, curPageUrl;

    function start(options) {
        if (started) {
            return;
        }
        started = true;

        var m = urlReg.exec(location.href);
        if (m[2]) {
            location.href = m[2];
        }

        Util.mixin(appOptions, options || {});
        layer = getDom(appOptions.layer) || document.body;
        curPageUrl = getCurrentUrl();

        bindEvent();
    };

    function getDom(selector) {
        if(typeof selector === "string") {
            return document.querySelector(ele);
        } else if (selector && selector.nodeType) {
            return selector;
        }
    }

    function bindEvent() {
        if (canPushState) {
            window.addEventListener('popstate', checkUrl);
        } else if ('onhashchange' in window) {
            window.addEventListener('hashchange', checkUrl);
        }

        layer.addEventListener('click', proxy, true);
    }

    /**
     * 事件代理
     * @param {MouseEvent} 点击事件对象
     */
    function proxy(e) {
        var element = e.target,
            parent = element,
            selector = appOptions.selector,
            top = document.body;

        while (parent !== top) {

            if (matchSelector(parent, selector)) {

                urlAttr = parent.tagName.toLowerCase() === "a" ? "href" : "data-href";
                url = parent.getAttribute(urlAttr);

                // 验证url, 可以自行配置url验证规则
                if (validateUrl(url)) {

                    e.stopPropagation();
                    e.preventDefault();

                    var opt = {
                        replace: parent.getAttribute("data-replace") || false,
                        container: parent.getAttribute("data-container"),
                        pagelets: parent.getAttribute("data-pagelets") || 'spage',
                        target : parent
                    };

                    redirect(url, opt);
                }
                return;
            } else {
                parent = parent.parentNode;
            }
        }
    }

    /**
     * 检查元素是否匹配选择器
     * @param  {HTMLElement} element
     * @param  {String} selector 选择器规则
     * @return {boolean}
     */
    function matchSelector(element, selector) {
        if (!element || element.nodeType !== 1) {
            return false
        }

        var matchesSelector = element.webkitMatchesSelector || element.matchesSelector,
            parent,
            match;

        if (matchesSelector) {
            match = matchesSelector.call(element, selector)
        } else {
            parent = element.parentNode;
            match = !!parent.querySelector(selector);
        }

        return match;
    }

    function redirect(url, opt) {
        url = getUrl(url);

        if (getCurrentUrl() === url) {
            return;
        }

        opt = Util.mixin(opt || {}, {
            trigger: true,
            replace: false
        });

        if (!opt.trigger) {
            return changeUrl(url, opt.replace);
        }

        fetchPage(url, opt, function() {
            changeUrl(url, opt.replace);
        });
    }

    // 修改 url
    function changeUrl(url, replace) {
        if (canPushState) {
            history[replace ? 'replaceState' : 'pushState']({}, document.title, url);
        } else {
            // fallback to use hash.
            url = '#' + url;
            replace ? location.replace(url) : (location.href = url);
        }
        curPageUrl = url;
    }

    function fetchPage(url, opt, callback) {
        // todo cache
        opt = Util.mixin({
            pagelet: 'spage',
            url: url
        }, opt || {});

        Page.trigger('pagestart', url);
        opt.cb = function() {
            curPageUrl = url;
            Page.trigger('pagedone', url);
            callback && callback();
        };
        BigPipe.load(opt);
    }

    /**
     * 验证URL是否符合validate规则
     * @param  {string} url
     * @return {boolean}
     */
    function validateUrl(url) {
        var validate = appOptions.validate;

        if (validate && validate instanceof RegExp) {
            return validate.test(url);
        } else if (typeof validate === 'function') {
            return validate(url);
        }

        return true;
    }

    function checkUrl() {
        var url = getCurrentUrl();

        if (url === curPageUrl) {
            return;
        }
        fetchPage(url);
    }

    function getUrl(url) {
        var m = urlReg.exec(url);

        if (!m) {
            throw new Error('ilegal url formatter `' + url + '`');
        }

        return m[2] || m[1] || '/';
    }

    function getCurrentUrl() {
        return getUrl(window.location.href);
    }

    Page.start = start;
    Page.redirect = redirect;
    Event.mixto(Page);
    root.Page = Page;
})(this);