let dataJson=null  // 定义一个容器存放所有大学名字
let downBoxState=false
let str =''  //定义的HTML字符串，用于嵌入页面
let newstr=''  // 当input输入内容时，前缀匹配的select-item
let $oBox=$('.componect-select>#select-downBox')  // 获取到 select-downBox
let $oInput=$('.componect-select > .select-input') 
let newDataArr=[]  //放匹配成功的数据
let aginDataArr=[]  // 再次匹配的数据
let cplock=true  // 是否为拼音输入中的flag
function myData (res){  // jsonp 的回调函数
    dataJson=res
    newDataArr=res
}
$(document).ready(()=>{
    $.each(dataJson,(i,item)=>{
        str+='<div class="select-item">'+item.name+'</div>'
    })
    // $('.componect-select > .select-downBox').html(str)  // 将动态生成的str加载到页面
    
    // 给每个select-item 添加点击监听
    $oBox.on('click','.select-item',function(){
        $oInput.val($(this).text())  //赋值当前选中的内容到input框中
        $oBox.css('display','none')  // 隐藏下拉列表
        downBoxState=false
    }) 
})
/**
 * 点击icon 的时候，打开或关闭下拉列表
 */
$('.componect-select>#select-btn').on('click',()=>{
    $oBox.html(str) 
    if(downBoxState){
        downBoxState=false
        $oBox.css('display','none')
    }
    else{
        downBoxState =true
        $oBox.css('display','block')
    }
})

/**
 * 给input 添加focus监听，清空select-downBox 的内容
 */
$oInput.focus(function(e){
    $oBox.html('')
})
/**
 * 判断为拼音输入开始
 */
$oInput.on('compositionstart',function(){
    cplock=false
})
/**
 * 判断为拼音输入结束
 */
$oInput.on('compositionend',function(){
    cplock=true
})
/**
 *  值改变时，获取输入的值，匹配前缀并将匹配的结果显示出来，且匹配的前缀字变成红色
 */
$oInput.on('input',function(){
    downBoxState =true
    $oBox.css('display','block')
    setTimeout(function(){
        if(cplock){
            aginDataArr=[]
            newstr=''
            console.log($oInput.val())
            let oVal=$oInput.val()
            if(oVal!=''){
                let reg=new RegExp('^'+oVal+'.*')
                for(let i=0;i<dataJson.length;i++){
                    if(dataJson[i].name.match(reg)){  //匹配前缀
                    aginDataArr.push(dataJson[i]) 
                    }
                }
                console.log(aginDataArr)
                let mystr
                // 遍历前缀匹配成功的学校名字数组
                $.each(aginDataArr,(i,item)=>{
                    mystr='<div class="select-item">'+item.name+'</div>'
                    newstr+=mystr.replace(oVal,"<font color=red>"+oVal+"</font>")
                })
                $oBox.html(newstr)
            }
            else{
                $oBox.html(str)
            }
        }
    },1)
})