({
    appDir: './',
    baseUrl: './res',
    dir: './build',
    modules:[
        {
            name: 'main',
            excludeShallow: [
                "jquery"
            ]
        }
    ],
    fileExclusionRegExp: /^(r|build)\.js$/,
    removeCombined: false,
    paths:{
        jquery:'lib/jquery-2.1.4.min',
        director:'lib/director.min',
        iscroll:'lib/iscroll',
    }
})
