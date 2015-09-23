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
        'r':'lib/director.min',
        'text':'lib/text',
        
        'c':'common/c',
        'b': 'common/b',
        
        'v': 'common/v',

        'app':'common/app',
    }
});

require(['app'], function (APP) {
    new APP();


    // var routes = {
    //     '/ccin':ccin,
    //     '/ccout':ccout,
    // };


    // var router = Router(routes);


    // router.init("/");
});