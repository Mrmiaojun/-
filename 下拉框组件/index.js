var dataJson=null;  // 定义一个容器存放所有大学名字
var downBoxState=false;
var str ='';  //定义的HTML字符串，用于嵌入页面
var newstr='';  // 当input输入内容时，前缀匹配的select-item
var $oBox=$('.componect-select>#select-downBox');  // 获取到 select-downBox
var $oInput=$('.componect-select > .select-input'); 
var newDataArr=[];  //放匹配成功的数据
var aginDataArr=[];  // 再次匹配的数据
var cplock=true;  // 是否为拼音输入中的flag
function myData (res){  // jsonp 的回调函数
    dataJson=res;
    newDataArr=res;
}
$(document).ready(function(){
    // 给每个select-item 添加点击监听
    $oBox.on('click','.select-item',function(){
        $oInput.val($(this).text());  //赋值当前选中的内容到input框中
        $oBox.css('display','none');  // 隐藏下拉列表
        downBoxState=false;
    });
})
/**
 * 点击icon 的时候，打开或关闭下拉列表
 */
$('.componect-select>#select-btn').on('click',function(){
    // $oBox.html(str); 
    loadAll(dataJson);
    if(downBoxState){
        downBoxState=false;
        $oBox.css('display','none');
    }
    else{
        downBoxState =true;
        $oBox.css('display','block');
    }
})

/**
 * 给input 添加focus监听，清空select-downBox 的内容
 */
$oInput.focus(function(e){
    $oBox.html('');
})
/**
 * 判断为拼音输入开始
 */
$oInput.on('compositionstart',function(){
    cplock=false;
})
/**
 * 判断为拼音输入结束
 */
$oInput.on('compositionend',function(){
    cplock=true;
})
/**
 *  值改变时，获取输入的值，匹配前缀并将匹配的结果显示出来，且匹配的前缀字变成红色
 */
$oInput.on('input',function(){
    downBoxState =true;
    $oBox.css('display','block');
    setTimeout(function(){
        if(cplock){
            aginDataArr=[];
            newstr='';
            var oVal=$oInput.val();
            if(oVal!=''){
                var reg=new RegExp('^'+oVal+'.*');
                matchAll(dataJson,reg);
                // 遍历前缀匹配成功的学校名字数组
                window.setTimeout(function(){
                    loadAll(aginDataArr,false);
                },1)
            }
            else{
                loadAll(dataJson,true);
            }
        }
    },1);
})


// 处理庞大数据的函数

/**
 *  数据分组函数（每组500条）
 */
function group(data){
    var result=[];
    var groupItem;
    for(var i=0;i< data.length;i++){
        if(i%500==0){
            groupItem !=null && result.push(groupItem);
            groupItem=[];
        }
        groupItem.push(data[i]);
    }
    result.push(groupItem);
    return result;
}

var currIndex=0;
/**
 * 加载一组数据的函数 
 */
function loadPart(group,index,flag){
    var html='';
    if(flag){
        for (var i=0;i<group.length;i++){
            var item=group[i];
            html+='<div class="select-item">'+group[i].name+'</div>';
        }
    }
    else{
        if(group){
            for (var i=0;i<group.length;i++){
                var item=group[i];
                var oVal=$oInput.val();
                var str='<div class="select-item">'+item.name+'</div>'
                html+=str.replace(oVal,"<font color=red>"+oVal+"</font>");
            }
        }
    }
    // 保证加载顺序不乱
    while(index-currIndex==1){
        $oBox.append(html);
        currIndex=index;
    }
}

/**
 * 加载所有数据的函数
 * flag 传入只能为boolean  true 表示全部展示 false 表示只渲染匹配前缀成功的
 */
function loadAll(theData,flag){
    $oBox.html('');
    currIndex=0;
    var groups =group(theData);  // 将所有数据分组，以500为一组
    for(var i=0;i<groups.length;i++){
        window.setTimeout(function(){
            var group=groups[i];
            var index=i+1;
            return function(){
                loadPart(group,index,flag);
            }
        }(),1)
    }
}

/**
 * 处理大量数据匹配的函数
 */
var matchIndex=0;
 function matchAll(theData,reg){
    matchIndex=0;
    var oVal=$oInput.val();
    var groups=group(theData);
    for(var i=0;i<groups.length;i++){
        window.setTimeout(function(){
            var group=groups[i];
            var index=i+1;
            return function(){
                matchPart(group,index,reg);
            }
        }(),1)
    }
    return true;
 }

 /**
  * 匹配一组数据的函数
  */
 function matchPart(group,index,reg){
    for(var i=0;i<group.length;i++){
        if(group[i].name.match(reg)){  //匹配前缀
        aginDataArr.push(group[i]); 
        }
    }
    while(index-matchIndex==1){
        matchIndex=index;
    }
 }