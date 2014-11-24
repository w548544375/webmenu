/** * Created by wangweiguang on 11/20/14. *//** * 拓扑图js，生成拓扑图结构 * @author wangweiguang * @version 1.0.0 * @param 需要SEXTopology.css文件 *//** * 拓扑图对象的类定义 * id * level * name * imgUrl *args= {"id":id,"level":level,"type":type,"parentId":parentId *		"name":name,"imgUrl":imgurl, *      "width":width,"height":height,"x":top,"y":left} * @return {null} * @return {null} */function TopologyObject(args){    if (args.id == undefined || args.id == null) {        console.log("id 不能为空.");        return null;    };    if (args.level == undefined || args.level == null) {        console.log("不没没有层级关系。");        return null;    };    if (args.imgUrl == undefined || args.imgUrl == null || args.imgUrl == "") {        console.log("不能没有背景图。");        return null;    };    this.id = args.id;    this.level = args.level;    this.type = args.type;    this.name = args.name;    this.imgUrl = args.imgUrl;    this.parentId = args.parentId;    //默认的宽高    if (args.width < 120 || args.x == undefined || args.x == null) {   //最小宽度为180        this.width = 120;    }else    {        this.width = args.width;    }    if (args.height < 120 ||args.height  == undefined || args.height  == null) {    //最小高度为160        this.height = 120;    }else{        this.height = args.height;    }    if(args.x == undefined || args.x == null)        this.x = 0;    else        this.x = args.x;    if(args.y == undefined || args.y == null)        this.y = 0;    else        this.y = args.y;    this.div = null;    this.divId = null;    //连线    //作为源的连线    this.connectionAsSource =[];    //一般说来，被作为目标的connection只有一个，但是为了意外的发生，我们这里仍然使用数组    this.connectionAsTarget =[];}/** * 对象由4个部分组成，最外层的div <topoObjectDiv> * 显示图片的div <topologyObjectHead> * 显示名字的div <topologyObjectTitle> * 显示名字的i * 创建单个对象 * 返回 一个html object */TopologyObject.prototype.createDiv = function(){    //创建最外层div <topoObjectDiv>    var topoObjectDiv = document.createElement('div'); //创建div元素    //设置最外层div的id    topoObjectDiv.setAttribute('id','topology_object_'+this.id);    topoObjectDiv.setAttribute('class','sexrytopology');    //设置宽度    topoObjectDiv.style.width = this.width+"px";    //设置高度    topoObjectDiv.style.height = this.height+"px";    //设置位置    topoObjectDiv.style.position = "absolute";    topoObjectDiv.style.top = this.y+"px";    topoObjectDiv.style.left = this.x+"px";    //topoObjectDiv.setAttribute('draggable','true');    //背景层div <topologyObjectHead>    var topologyObjectHead = document.createElement('div');    //添加样式    topologyObjectHead.setAttribute('class','sexrytopology_head');    //设置背景图片    topologyObjectHead.style.backgroundImage = "url("+this.imgUrl+")";    //设置背景图片的宽高 background-size    topologyObjectHead.style.backgroundSize = this.width+"px "+this.height*0.70+"px";    //名字层div <topologyObjectTitle>    var topologyObjectTitle = document.createElement('div');    topologyObjectTitle.setAttribute('class','sexrytopology_title');    var title = document.createElement('i');    title.innerHTML = this.name;    topologyObjectTitle.appendChild(title);    //将2个div都添加到最外层的div，作为子div    topoObjectDiv.appendChild(topologyObjectHead);    topoObjectDiv.appendChild(topologyObjectTitle);    //这样做的目的是为了把div和对象关联。    //赋值自身的div    this.div= topoObjectDiv;    //赋值自身的divid    this.divId = topoObjectDiv.getAttribute('id');    //console.log(this);    return topoObjectDiv;};/** * 给对象添加事件，可以是任意事件 * @param eventType 事件类型，比如 click mouseenter mouseover * @param callbackFunction 触发事件所需要执行的函数 * @返回值 成功添加事件返回true，添加失败返回false */TopologyObject.prototype.addTopologyEvent = function(eventType,callbackFunction){    var dom = this.div;    var topology = this;    function func(){        callbackFunction(topology);        console.log(topology.name+"触发事件。");    }    //IE浏览器    if (dom.attachEvent) {        dom.attachEvent("on"+eventType,func);        return true;    }else if(dom.addEventListener){  //firefox chrome        dom.addEventListener(eventType,func,false);        return true;    }    return false;};TopologyObject.prototype.addListener = function(eventType,callbackFunction){    this.addTopologyEvent(eventType,callbackFunction);}/* *更新对象所对应的div的位置,同时更新对象的位置 *@param newx 新的x位置 *@param newy 新的y位置 */TopologyObject.prototype.updatePosition = function(newx,newy){    //获取div    var self = this.div;    //设置新的位置，同时更新对象的    this.x = newx;    this.y = newy;    self.style.top = newx+"px";    self.style.left= newy +"px";    //console.log("当前位置:"+this.x+":"+this.y);};/* *当自身的位置改变的时候，也有必要对对象的xy进行更新 * */TopologyObject.prototype.didViewChanged = function() {    var me = this;    this.addTopologyEvent("mouseup", function(){        var computedStyle = document.defaultView.getComputedStyle(me.div,null);        var x = computedStyle.top.substring(0,computedStyle.top.length-2);        var y = computedStyle.left.substring(0,computedStyle.left.length-2);        //更新对象的xy        me.x = x;        me.y = y;        //输出当前位置        //  console.log(me.name+":"+me.x +":"+me.y);    });};/***上面是对拓扑图对象的定义***//****************************无情的分割线*********************************//** *sexrytopology  负责控制所有topologyobject在container中的位置，添加和删除 * *//** * *构造函数，初始化一些默认参数 * */function SexryTopology(containerId,objects){    //每个对象的默认宽度    this.objectWidth = 120;    //每个对象的默认高度    this.objectHeight = 120;    //默认的容器    this.container = containerId;    //默认的左右间距    this.defaultLeft = 160;    //默认的上下间距    this.defaultTop = 14;    //数据    //默认x位置    this.x = 0;    //默认y位置    this.y =0;    this.data = objects;    //利用this.data创建好对象之后，返回的值就是this.topologyobjects    this.topologyobjects = null;    //默认的jsplumb的参数    this.defaultJsplumbArg ={        PaintStyle:{ //连线的样式            lineWidth:1,            strokeStyle:"#236245",            outlineColor:"#236345",            outlineWidth:1        },        //Overlays:[["Arrow",{location:1}]],        DragOptions:{cursor:"crosshair"}, //可拖拽的鼠标样式        Anchors:["Continuous","Continuous"], //连接的两个点的在object上的位置，这里选择智能选择        Connector:[ "Flowchart",{midpoint:1.0}], //连线方式,gap起点到div的间距        // Connector:["Straight"],        Endpoint:[ "Dot",{radius:1}],   //连接线的终点样式,Rectangle Dot Blank Image        EndpointStyle : { fillStyle: "#545953"  }        //Anchors : ["AutoDefault","AutoDefault"]        //container:"readytogo"    };    //初始化jsplumb为null    this.jsPlumbInstance = null;    //禁用浏览器默认的右键菜单    document.getElementById(containerId).oncontextmenu=function(){return false;};}/* *获取容器的信息 *返回 容器的长度 宽度 * */SexryTopology.prototype.getContainerInfo = function(){    var dom = document.getElementById(this.container);    var height = dom.offsetHeight;    var width = dom.offsetWidth;    return {"height":height,"width":width};};/* *像container中添加topology的对象的div *这是一个private的方法 */SexryTopology.prototype.insert = function(topologyobjectDiv){    var dom = document.getElementById(this.container);    dom.appendChild(topologyobjectDiv);}/* *绑定事件到单个对象 * */SexryTopology.prototype.addEvent = function(obj,type,callbackFunction){    //alert(obj.object.id);    obj.addTopologyEvent(type,callbackFunction);};/* * 绑定事件到所有对象中去 * */SexryTopology.prototype.allAddEvent = function(type,callbackFunction){    for(var i= 0;i<this.topologyobjects.length;i++){        this.topologyobjects[i].addTopologyEvent(type,callbackFunction);    }}/* *函数功能：获取level的所有对象 *@param level 查找的等级 *返回 对象数组 */SexryTopology.prototype.getLevelObjects = function(level){    var result = new Array();    for (var i = 0; i < this.topologyobjects.length; i++) {        if(this.topologyobjects[i].level == level)        {            result.push(this.topologyobjects[i]);        }    };    return result;};/* * 函数功能：取得对象的最大leve * 返回 最大的level的值 * */SexryTopology.prototype.getMaxLevel = function(){    var max = this.topologyobjects[0].level;    for (var i = 0; i < this.topologyobjects.length; i++) {        if(max < this.topologyobjects[i].level)            max = this.topologyobjects[i].level;    }    return max;};/* * 函数功能 ： 对所有对象进行排序，根据对象的parentId * @param 要排序的数组 * 返回 ： 无返回 */SexryTopology.prototype.sortByParentId = function(array){    //冒泡排序法  由小到大排序    for(var i = 0;i < array.length -1;i++){        for(var j =0;j<array.length - i -1;j++){            if(array[j].parentId > array[j+1].parentId){                var temp = array[j];                array[j] = array[j+1];                array[j+1] = temp;            }        }    }};/* * 函数功能：根据id找到父对象 * @param id 要查找的父对象的id * @param array 要查找的数组 * 返回 查找到的对象 */SexryTopology.prototype.getTopologyObject = function(id){    for (var i = 0; i < this.topologyobjects.length; i++) {        if (id == this.topologyobjects[i].id) {            return this.topologyobjects[i];        };    };    return null;};/**  函数功能 ： 查找topologyobject的index */SexryTopology.prototype.getTopologyObjectIndex = function(obj){    for (var i = 0; i < this.topologyobjects.length; i++) {        if (obj.id == this.topologyobjects[i].id) {            return i;        };    };    return null;}/* *根据构造函数传过来的array创建topologyobject * */SexryTopology.prototype.createObjets = function(array){    var result = new Array();    for (var i = 0; i < array.length; i++) {        var arg = {            "id":array[i].id,            "type":array[i].type,            "level":array[i].level,            "name":array[i].name,            "imgUrl":array[i].imgUrl,            "width":this.objectWidth,            "height":this.objectHeight,            "parentId":array[i].parentId,            "x":this.x,            "y":this.y        };        var object = new TopologyObject(arg);        if (object != null) {            result.push(object);        };    };    this.topologyobjects = result;    return result;};//所有父级元素下移SexryTopology.prototype.moveAllParentDownButme = function(me){    var array = new Array();    this.getParentsButMine(me,array);    //console.log("当前元素为：");    //console.log(me);    //console.log("找到的所有父元素除了自身的父元素：");    //console.log(array);};//找到所有子元素SexryTopology.prototype.findChildNode=function(parentNode){    var allchild = new Array();        for (var i = 0; i < this.topologyobjects.length; i++) {            if (this.topologyobjects[i].parentId == parentNode.id) {                allchild.push(this.topologyobjects[i]);            }        }    return allchild;};//找到当前元素的父元素SexryTopology.prototype.findParentNode = function(childNode){    for(var i=0;i<this.topologyobjects.length;i++){        if(this.topologyobjects[i].id == childNode.parentId){            return this.topologyobjects[i];            }        }    //如果没有找到，就说明没有父元素，返回null        return null;    };/** 函数功能 删除指定节点，* @param node 节点对象，* @param bool 是否删除子元素的子元素* @return 删除的个数 */SexryTopology.prototype.deleteNode= function(node,bool){    //找到本节点的子节点，以及子节点的子节点    if(bool) {        var child = this.findChildNode(node);        for (var i = 0; i < child.length; i++) {            this.deleteNode(child[i], bool);            //移除她们的连线            this.jsPlumbInstance.detach(child[i].connectionAsTarget[0]);            //从对象列表中移除对象            this.topologyobjects.splice(this.getTopologyObjectIndex(child[i]),1);            //从前台页面中移除对应的div            child[i].div.parentNode.removeChild(child[i].div);        }    }else{  //只删除本节点        //移除她们的连线        //删除本节点的时候，要判断是否有子对象和父对象，如果有，那么就要把子对象和父对象进行连接        var  parentObj = this.findParentNode(node);        var  children = this.findChildNode(node);         if(parentObj == null) //说明是根对象，不能被删除            return;         if(children.length > 0){ //有子对象的时候             this.jsPlumbInstance.detachAllConnections(node.div);             for(var i =0;i<parentObj.connectionAsSource.length;i++){                 if(parentObj.connectionAsSource[i].targetId == node.divId)                 {                     //移除失效connection                     parentObj.connectionAsSource.splice(i,1);                 }             }             for(var i=0;i<children.length;i++) {                 //子对象的连接重置                children[i].connectionAsTarget =[];                 children[i].parentId = parentObj.id;                 this.connect(parentObj,children[i]);             }         }else{ //没有子对象的情况              this.jsPlumbInstance.detach(node.connectionAsTarget[0]);              for(var i =0;i<parentObj.connectionAsSource.length;i++){                  if(parentObj.connectionAsSource[i].targetId == node.divId)                  {                      //移除失效connection                      parentObj.connectionAsSource.splice(i,1);                  }              }         }        //从对象列表中移除对象        this.topologyobjects.splice(this.getTopologyObjectIndex(node),1);        //从前台页面中移除对应的div        node.div.parentNode.removeChild(node.div);    }    //console.log(this.topologyobjects); /*   for(var i=0;i<this.topologyobjects.length;i++){        var obj = this.topologyobjects[i];        console.log("对象"+i+":"+obj.id+"==="+obj.parentId);    }    console.log("=====================================================");*/}//判断数组中是否包含对象Array.prototype.contains = function(obj){    var i = this.length;    while (i--) {        if (this[i] === obj) {            return true;        }    }    return false;}//获得除了自己的父对象之外的其他父对象SexryTopology.prototype.getParentsButMine = function(me,array){    if(me.level > 0){        var objects = this.getLevelObjects(me.level-1);        var parentObj = this.getTopologyObject(me.parentId);        for(var i=0;i<objects.length;i++)        {            //加入的条件为除了自己的父对象，以及            if(objects[i].id != me.parentId && objects[i].y >= me.y)            {                if(! array.contains(objects[i])){                    objects[i].y += this.defaultTop+this.objectHeight;                    array.push(objects[i]);                }            }            //逐层递归调用 ,一层一层的父级网上找            this.getParentsButMine(parentObj, array);        }    }};//给每个对象设置位置SexryTopology.prototype.deploy  = function(){    //创建对象    this.createObjets(this.data);    //获取最大层级    var maxLevel = this.getMaxLevel();    //console.log("MaxLevel = "+maxLevel);    //按照层级遍历    for (var curentLevel = 1; curentLevel <= maxLevel; curentLevel++) {        objects = this.getLevelObjects(curentLevel);        this.sortByParentId(objects);        //console.log("排序后的数组为:");        //	console.log(objects);        var count = 0;        //取得父元素的对象        var parentObject = this.getTopologyObject(objects[0].parentId);        //console.log("当前元素的父元素为:");        //console.log(parentObject);        for(var i= 0;i<objects.length;i++){            //	console.log("条件判断:"+(objects[i].parentId != parentObject.id));            //如果当前对象的父对象变化，就要变化父对象。            if (objects[i].parentId != parentObject.id) {                count = 0;                parentObject = this.getTopologyObject(objects[i].parentId);            }            count++;            objects[i].x = (this.defaultLeft+this.objectWidth)*curentLevel;            //根据父元素y位置确定本元素的y            objects[i].y = parentObject.y+(this.defaultTop+this.objectHeight)*(count-1);            //console.log("count:"+count);            //console.log("count is :"+count+"x:y="+objects[i].x+":"+objects[i].y);            //如果子级元素个数大于1，则所有除了他的父级元素以及同级剩下的元素都要下移动一个单位            if (count > 1) {                this.moveAllParentDownButme(objects[i]);            };        } //第二层for循环    } //第一层for循环};//初始化jsplumb,并且使得所有元素可拖动SexryTopology.prototype.initJsplumb = function(arg){    var firstInstance = jsPlumb.getInstance(arg);    if (firstInstance != null) {        var windows = jsPlumb.getSelector(".sexrytopology");        // initialise draggable elements.        firstInstance.draggable(windows);    }    this.jsPlumbInstance = firstInstance;    return firstInstance;};//连线函数SexryTopology.prototype.connect= function(sourceobj,targetobj){/*   var sourceEndpoint = {        isSource:true    };    var targetEndpoint = {        isTarget:true    };    var sourceUUID = "Source"+sourceobj.divId;    var targetUUID = "Target"+targetobj.divId;    this.jsPlumbInstance.addEndpoint(sourceobj.divId,sourceEndpoint,{anchor:"Continuous",uuid:sourceUUID});    this.jsPlumbInstance.addEndpoint(targetobj.divId,targetEndpoint,{anchor:"Continuous",uuid:targetUUID});*/    //获取div的id进行连线   var connection = this.jsPlumbInstance.connect({"source":sourceobj.divId,        "target":targetobj.divId,editable:true});    //var connection = this.jsPlumbInstance.connect({uuids:["Source"+sourceobj.divId,"Target"+targetobj.divId]});    sourceobj.connectionAsSource.push(connection);    targetobj.connectionAsTarget.push(connection);    //链接是jsplumb的一个对象   /* console.log("源：");    console.log(sourceobj);    console.log("目标:");    console.log(targetobj);    console.log("connection:");    console.log(connection);*/    return connection;}//初始化所有连接，返回所有jsplumb链接对象的connectionSexryTopology.prototype.connectAll = function(){    var array = new Array();    var maxLevel = this.getMaxLevel();    for(var i=1;i<=maxLevel;i++){        var objects = this.getLevelObjects(i);        for(var j =0;j<objects.length;j++){            var parent = this.getTopologyObject(objects[j].parentId);            var connection = this.connect(parent,objects[j]);            array.push(connection);        }    }    return array;}//画出最终结果到div中SexryTopology.prototype.draw = function(){    //布局的确定    this.deploy();    //添加到网页中    for(var i=0;i<this.topologyobjects.length;i++){        var div = this.topologyobjects[i].createDiv();        //要先进行插入，再进行绑定事件        this.insert(div);        //初始化的时候就要绑定变化事件        this.topologyobjects[i].didViewChanged();    }    var instance = this.initJsplumb(this.defaultJsplumbArg);    //console.log(instance);    var connections = this.connectAll();    //console.log(connections);    //去除连接    //instance.detach(connections[0]);};