window.BASEURL='res';
window.VIEWS_PATH = 'view/';

function getViewPath(path) {
    return 'text!' + VIEWS_PATH + path + '.html';
}

require.config({
    baseUrl: BASEURL,
    shim: {
        $: {
            exports: 'jQuery'
        },
        _: {
            exports: '_'
        }
    },
    paths: {
        '$':'lib/jquery-2.1.4.min',
        '_':'lib/underscore',
        'd':'lib/director.min',
        'text':'lib/text',
        'i':'lib/iscroll',
        'c':'common/c',
        'b': 'common/b',
        'v': 'common/v',
        'ban':'common/index_banner',

        'app':'common/app',
    }
});

require(['app'], function (APP) {
    new APP();
});