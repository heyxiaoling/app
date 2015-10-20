define(['$', '_', 'b', 'v', getViewPath('login')], function ($, _, b, v, html) {
    var View = b.Class(v.PageView, {
        _propertys_: function () {
            this.template = html;
            this.url = ''; //获取首页文章
            this.is=null;
        },
        init: function (superInit, request, interface) {
            superInit(request, interface);
            console.log('init');
        },
        createHtml: function () {
            return this.template;
        },
        attrs: {
            'data-id': 'login',
            className: 'page'
        },
        events: {
        },
        onCreate: function () {
            console.log('onCreate');
        },
        //dom创建后数据加载时执行，用于加载后执行我们的逻辑
        onLoad: function () {
            console.log('onLoad');
            $.get(this.url, function (data) {
                var s = '';
            });
        },
        //dom创建后，未显示
        onShow: function () {
            this.is = new IScroll('#login-content', { mouseWheel: true, tap: true,click: true });
        },
        //dom隐藏前
        onHide: function () {
            console.log('onHide');
        }
    });

    return View;
});