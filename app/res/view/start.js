define(['$', '_', 'b', 'v','i', getViewPath('start')], function ($, _, b, v,i, html) {
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
            'data-id': 'start',
            className: 'page start-port'
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
            console.log('onShow');
            this.is = new IScroll('#start-port-content', { mouseWheel: true, tap: true,click: true});
            //this.css({'visibility':'visible'})
        },
        //dom隐藏前
        onHide: function () {
            console.log('onHide');
        }
    });

    return View;
});