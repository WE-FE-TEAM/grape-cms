/**
 * 负责处理后台系统, 菜单栏的渲染和交互
 * Created by jess on 16/6/12.
 */


'use strict';

const utils = require('common:widget/ui/utils/utils.js');
const service = require('common:widget/ui/service/service-factory.js');

const dashService = service.getService('dash');

//菜单展开时
const MENU_UNFOLD = 'sub-menu-unfold';
//某个菜单选中时
const MENU_ITEM_SELECTED = 'menu-item-selected';

function generateMenuList(arr, index = 0) {
    let out = '<ul class="nav child_menu">';
    if (index == 0) {
        out = '<ul class="nav side-menu">';
    }
    arr.forEach((item, index) => {
        let children = item.children;
        let subMenus = '';
        let itemClass = 'menu-item';
        let itemText = '';
        if (children.length > 0) {
            itemClass += ' sub-menu-container';
            itemText = item.channelName;
            subMenus = generateMenuList(children, ++index);
            out += '<li data-id="' + item._id + '" class="' + itemClass + '">' +
                '<div class="menu-item-text">' + '<i class="fa fa-sitemap"></i>' + itemText + '<span class="fa fa-chevron-down"></span>' + '</div>' +
                subMenus +
                '</li>';
        } else {
            itemText = '<a href="' + item.realUrl + '" target="_self">' + item.channelName + '</a>';
            out += '<li data-id="' + item._id + '" class="' + itemClass + '">' + '<a href="' + item.realUrl + '" target="_self">' + '<div class="menu-item-text">' + '<i class="fa fa-clone"></i>'+ item.channelName +
                '</div>' + '</a>'+ subMenus +
                '</li>';
        }
    });
    out += '</ul>';
    return out;
}

let singleton = {

        init: function () {

            let searchConf = utils.getSearchConf();

            let currentChannelId = searchConf.channelId || null;

            Promise.all([dashService.getUserMenuTree({channelId: currentChannelId}), dashService.getChannelPath({channelId: currentChannelId})])
                .then((arr) => {
                    // console.log( arr );
                    let all = arr[0];
                    let current = arr[1];
                    let menuData = null;
                    let currentPath = null;
                    try {
                        menuData = all.data.data;
                        currentPath = current.data.data;
                    } catch (e) {

                    }
                    if (!menuData || !currentPath) {
                        alert('菜单数据异常, 请联系开发人员');
                        return;
                    }

                    singleton.render(menuData, currentPath);
                })
                .catch((err) => {
                    alert(err.message);
                });

        },

        render: function (menuData, currentPath) {

            let topLevelMenu = menuData.children;

            let html = generateMenuList(topLevelMenu);
            let $menu = $('#dash-menu');

            $menu.html(html);
            
            $menu.on('click', '.sub-menu-container', function (e) {
                e.stopPropagation();
                $(e.currentTarget).toggleClass(MENU_UNFOLD);
            });

            //选中当前的栏目
            let currentChannel = currentPath[0];
            if (currentChannel) {
                let channelId = currentChannel._id;
                $menu.find('.menu-item[data-id=' + channelId + ']').addClass(MENU_ITEM_SELECTED)
                    .parents('.sub-menu-container').addClass(MENU_UNFOLD);
            }
        }
    }
    ;


module.exports = singleton;