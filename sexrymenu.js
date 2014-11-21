/**
 * Created by wangweiguang on 11/20/14.
 */
/*
 *
 *拓扑图的菜单插件，
 *@author wangweiguang
 *@version 1.0.0
 *
 */
//给每个menu编号，避免重复

//默认构造参数，可以是menuItem（‘title’）或者 menuItem（‘title’，group)
//或者 menuItem('title',group,subof);

//@param itemId 菜单项id
//@param  ‘title’ 菜单标题
//@param  ‘group’ 分组
//@param  ‘parentId’ 属于哪个item的子标签
//menuItem ={itemId,'title',group,subof};
function MenuItem()
{
    //不允许空参数
    if (arguments.length == 0)
        return null;
    this.itemId = arguments[0]; //itemId
    this.title = arguments[1]; //item title
    this.group = arguments[2]; //item group
    this.parentId = arguments[3]; //item is sub of who
    //默认没有divId 和 div
    this.divId = null;
    //默认不显示
    this.isSHow = false;

    this.div = null;
    this.width = 0;
    this.height = 0;
}


MenuItem.prototype.registeronClick = function(functionbody){
    var dom = this.div;
   // var item = this;
    //var clickFunc = new Function(item,functionbody);
    var item = this;

    function func(){
        console.log(item.itemId+"第"+item.group+"组被点击了。");
        functionbody(item);
     }
    //IE
    if(dom.attachEvent){
        dom.attachEvent("onclick",func);
    }
    else{ //非iE
        dom.addEventListener("click",func,false);
    }

};




//构造函数 string数组
function SexryMenu()
{
    //最大的字符串长度
    var maxWordLength = 0;
    //允许空参数构建
    if (arguments.length == 0) {
        var items = new Array();
        this.items = items;
        //默认的菜单宽度
        maxWordLength = 120;
    }
    else{
        this.items = arguments[0];
        maxWordLength = this.items[0][0].title.length;
    };
    //获取已经存在的menu
    var exist = document.getElementsByClassName('sexrymenu');
    var menuId = 0;
    if (exist.length != 0) {
        menuId = exist.length;
    };
    //console.log(menuId);

    //创建新的div
    var menuDiv = document.createElement('div');
    menuDiv.setAttribute('id','sexry_menu_'+menuId);
    menuDiv.setAttribute('class','sexrymenu');
    menuDiv.style.display = 'none'; //隐藏div
    menuDiv.style.position = 'fixed'; //设置定位方式为跟随浏览器当前视图
    menuDiv.style.zIndex = '100';//设置上层

    //ul
    var groupNum = 0;
    var itemNum = 0;
    var ul = document.createElement('ul');
    for(var i = 0;i<this.items.length;i++){
        groupNum ++;
        ul.appendChild(document.createElement('hr'));
        for(var j=0;j<this.items[i].length;j++){
            var item = this.items[i][j];
            //重新设置最大长度，直到找到那个最大长度
            if(maxWordLength < item.title.length)
                maxWordLength = item.title.length;
            var itemDiv = document.createElement('li');
            itemDiv.setAttribute('id','menuitem_'+item.group+'_'+item.itemId);
            itemDiv.innerHTML = item.title;
            //设置item的div属性
            item.div = itemDiv;
            //设置item的divId
            item.divId = itemDiv.getAttribute('id');
            ul.appendChild(itemDiv);
            //注册点击事件
            //item.registeronClick();
            itemNum++;
        }
    }
    //获取当前页面的字体大小

    //列表加入div中
    menuDiv.appendChild(ul);
    //div插入body中
    document.body.appendChild(menuDiv);
    //设置menu的宽度
    var allchild = menuDiv.getElementsByTagName('li');
    var fontsize= document.defaultView.getComputedStyle(allchild[0],null).fontSize;
    fontsize = fontsize.substr(0,fontsize.length-2);
    //设置宽度
    this.width = (maxWordLength+1)* fontsize ;
    menuDiv.style.width = this.width+"px";
    //设置div高度
    this.height = fontsize * itemNum * groupNum ;
    menuDiv.style.height = this.height+ "px";
    // console.log(menuDiv);

    /***赋值给自身元素变量**/
    this.div = menuDiv;
    this.divId = 'sexry_menu_'+menuId;
}





/* 类的静态方法
 *  通过一个数组创建菜单的模型  menuItem ={'title','group','subof','itemId'};
 * @return 返回的是一个menu的实例
 */
SexryMenu.wrapMenwFromStringArray = function(menuItemArray){

    var items = new Array();
    for(var i=0;i<arguments.length;i++){
        var group = new Array();
        for(var j=0;j<arguments[i].length;j++){
            var item = new MenuItem(j,arguments[i][j],i);
            group.push(item);
        }
        items.push(group);
    }
    //console.log(items);
    return new SexryMenu(items);
};

/*
 *添加菜单项
 *@param menuItem要添加的菜单项
 *@retrun the index of the added item.
 */
SexryMenu.prototype.appedMenuItem = function(menuItem){};

/*
 * 在指定index添加菜单
 * @param index 要添加菜单条目的索引
 * @param menuItem 菜单项
 */
SexryMenu.prototype.addMenuItemAtIndex = function(index,menuItem){};

/*
 * 移除菜单项,通过索引移除菜单项
 * @param 菜单的index
 * @return true if success,false if failed.
 */
SexryMenu.prototype.removeMenuItemAtIndex = function(index){};

/*
 * 获取menu的dom对象
 * @return menu的dom对象
 */
SexryMenu.prototype.getMenuDom = function(){};

/*
 * 获取menuitem的dom对象
 * @param index menuitem的索引
 * @return 返回menuitem的dom对象
 */
SexryMenu.prototype.getMenuItemDom = function(index){};





//显示
SexryMenu.prototype.show = function(){
    //鼠标位置

    var x = window.event.x;
    var y = window.event.y;
    console.log(this.isBound('right'));
    //如果下面的长度不足够显示整个菜单，就会把菜单向上显示
    if(this.isBound('bottom'))
        this.updatePosition(x,y-this.height);
    //右边不足以显示真个菜单就把菜单向左显示
    else if(this.isBound('right'))
        this.updatePosition(x-this.width,y);
    else
        this.updatePosition(x,y);
    this.div.style.display = 'block';
    //改变状态
    this.isShow = true;
}
//隐藏
SexryMenu.prototype.hide = function(){
    this.div.style.display = 'none';
    //改变状态
    this.isShow = false;
}

//显示和隐藏menu
SexryMenu.prototype.doMenu = function(){
    this.isShow ? this.hide() : this.show();
    //div宽度
    //console.log(this.div.offsetHeight);
    //console.log("可视区域宽高："+window.innerWidth+":"+window.innerHeight);

};



//更新menu的位置
SexryMenu.prototype.updatePosition = function(x,y){
    this.div.style.top = y+"px";
    this.div.style.left = x+"px";
};

//判断鼠标是不是再边缘 参数 {bottom,right}
SexryMenu.prototype.isBound =  function(direction){
    //console.log(document.defaultView.getComputedStyle(this.div,null).height);
    //console.log(window.event.x+this.width+"   "+window.innerWidth);
    return	(direction == 'right') ? window.event.x+this.width > window.innerWidth :
    window.event.y +this.height > window.innerHeight;
};


//绑定事件
SexryMenu.prototype.addEvent = function(menuItem,type,func){
    var dom = menuItem.div;
    //IE
    if(dom.attachEvent){
        dom.attachEvent("on"+type,func);
    }
    else{ //非iE
        dom.addEventListener(type,func,false);
    }

}




//绑定item点击事件
SexryMenu.prototype.setOnClickListener  = function(funcbody){
    //console.log(funcbody);
    for(var i=0;i<this.items.length;i++){
     for(var j=0;j<this.items[i].length;j++){
     this.items[i][j].registeronClick(funcbody);
        }
     }
};

