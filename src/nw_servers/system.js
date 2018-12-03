var nodeSysServer = function () {
    var tns = {};
    tns.getSystemInfo = function () {
        var os = require('os');
        return os.platform();
    }

    tns.openbaidu = function () {
        // 创建窗口并获取它的窗口对象
        nw.Window.open('https://www.baidu.com', {}, function (new_win) {
            // do something with the newly created window
        });
    }
    return tns;
}