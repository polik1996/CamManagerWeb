//init plugin

//save current selected window
var g_iWndIndex = 0;
$(function(){
    //check the installation status of plugin
	if(-1 == WebVideoCtrl.I_CheckPluginInstall()){
        alert("The plugin is uninstalled, please install the WebComponents.exe! ");
        return;
    }
    //init plugin parameters and insert the plugin
    WebVideoCtrl.I_InitPlugin(750, 450, {
        iWndowType: 2,
        cbSelWnd: function(xmlDoc){
            g_iWndIndex = $(xmlDoc).find("SelectWnd").eq(0).text();
            var szInfo = "selected window number:" + g_iWndIndex;
//            showCBInfo(szInfo);
        }
    });    
    WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");
    //check plugin to see whether it is the latest
    if(-1 == WebVideoCtrl.I_CheckPluginVersion()){
        alert("Detected the latest version, please double click WebComponents.exe to update!");
        return;
    }
    //window event binding
    $(window).bind({
       resize: function(){
           var $Restart = $("#restartDiv");
           if($Restart.length > 0){
               var oSize = getWindowSize();
               $Restart.css({
                   width: oSize.width + "px",
                   height: oSize.height + "px"
               });
           }
       } 
    });
});

function changeWndNum(iType){
    iType = parseInt(2, 10);
    WebVideoCtrl.I_ChangeWndNum(iType);
}

function clickLogin(){
    var szIP = $("#loginip").val(),
        szPort = $("#port").val(),
        szUserName = $("#username").val(),
        szPassword = $("#password").val();
    
    if("" == szIP || "" == szPort){
        return;
    }
    
    var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUserName, szPassword, {
        success: function(xmlDoc){
//            showOPInfo(szIP + "login success!");
            $("#ip").prepend("<option value='" + szIP + "'>" + szIP + "</option");
            setTimeout(function(){
                $("#ip").val(szIP);
                getChannelInfo();
            }, 10);
        }, 
        error: function(){
//            shshowOPInfo(szIP + "login failed!");
        }
    });
    if(-1 == iRet){
//        showOPInfo(szIP + "login already!")
    }
}


function clickLogout(){
    var szIP = $("#ip").val(),
        szInfo = "";
    if(szIP == ""){
        return;
    }
    var iRet = WebVideoCtrl.I_Logout(szIP);
    if(0 == iRet){
        szInfo = "exit success!";
        $("#ip option[value='" + szIP + "']").remove();
        getChanelInfo;
    }else{
        szInfo = "exit failed!";
//        showOPInfo(szIP + " " + szInfo);
    }
}

function getChanelInfo(){
    var szIP = $("#ip").val(),
        oSel = $("#channels").empty(),
        nAnalogChannel = 0;
    if("" == szIP){
        return;
    }
    WebVideoCtrl.I_GetAnalogChannelInfo(szIP, {
        async: false,
        success: function(xmlDoc){
            var oChannels = $(xmlDoc).find("VideoInputChannel");
            nAnalogChannel = oChannels.length;
            $.each(oChannels, function(i){
                var id = parseInt($(this).find("id").eq(0).text(), 10), name = $(this).find("name").eq(0).text();
                if("" == name){
                    name = "Camera " + (id < 9 ? "0" + id :id);
                }
                oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
            });
//            showOPInfo(szIP + " get analog channel success！");
        },
        error: function () {
//			showOPInfo(szIP + " get analog channel failed！");
		}
    });
    WebVideoCtrl.I_GetDigitalChannelInfo(szIP, {
        async:false,
        success: function(xmlDoc){
            var oChannels = $(xmlDoc).find("InputProxyChannelStatus");
            $.each(oChannels, function(i){
                var id = parseInt($(this).find("id").eq(0).text(), 10),
                    name = $(this).find("name").eq(0).text(),
                    online = $(this).find("online").eq(0).text();
                if("false" == online){
                    return true;
                }
                if("" == name){
                    name = "IPCamera " + ((id - nAnalogChannel) < 9 ? "0" + (id - nAnalogChannel) : (id - nAnalogChannel));
                }
                oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
            });
//            showOPInfo(szIP + " get IP channel success！");
        },
        error: function(){
//            showOPInfo(szIP + " get IP channel failed！");
		}
    });
    
    WebVideoCtrl.I_GetZeroChannelInfo(szIP, {
        async: false,
        success: function(xmlDoc){
            var oChannels = $(xmlDoc).find("ZeroVideoChannel");
            $.each(oChannels, function(i){
                var id = parseInt($(this).find("id").eq(0), 10),
                    name = $(this).find("name").eq(0).text();
                if("" == name){
                    name = "Zero Channel " + (id < 9 ? "0" + id : id);
                }
                if("true" == $(this).find("enabled").eq(0).text()){
                    oSel.append("<option value='" + id + "' bZero='true'>" + name + "</option>");
                }
            });
//            showOPInfo(szIP + " get zero-channel success！");
        },
        error: function (){
//            showOPInfo(szIP + " get zero-channel failed！");
        }
    });
}

function clickStartRealPlay(){
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szIP = $("#ip").val(),
        iStreamType = parseInt($("#streamtype").val(), 10),
        iChannelID = parseInt($("#channels").val(), 10),
        bZeroChannel = $("#channels option").eq($("#channels").get(0).selectedIndex).attr("bZero") == "true" ? true : false,
        szInfo = "";
    if("" == szIP){
        return;
    }
    if(oWndInfo != null){
        WebVideoCtrl.I_Stop();
    }
    var iRet = WebVideoCtrl.I_StartRealPlay(szIp, {
        iStreamType: iStreamType,
        iChannelID: iChannelID,
        bZeroChannel: bZeroChannel
    });
    if(0 == iRet){
        szInfo = "start real play success!";
    }else{
        szInfo = "start real play failed!";
    }
//    showOPInfo(szIP + " " + szInfo);
}

function clickStopRealPlay(){
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";
    if(oWndInfo != null){
        var iRet = WebVideoCtrl.I_Stop();
        if(0 == iRet){
            szInfo = "stop real play success!";
        }else{
            szInfo = "stop real pley failed!";
        }
        showOPInfo(oWndInfo.szIP + " " + szInfo);
    }
}

function getWindowSize(){
    var nWidth = $(this).width() + $(this).scrollLeft(),
        nHeight = $(this).height() + $(this).scrollTop();
    return {width: nWidth, height: nHeight};
}

