let list = [{
    "type":"text",
    "label":"活动名称",
    "prop":"name",
    "width":400,
    "value":"",
    "haveRule":true,
    "rule":[
        {"required":"true","message":"请填写活动名称","trigger":"blur"}
    ]    
},{
    "type":"datetimerange",
    "label":"活动时间",
    "prop":"date" ,
    "value":[],
    "separator":"-",
    "startPlaceholder":"开始日期",
    "endPlaceholder":"结束日期",
    "width":400,
    "haveRule":true,
    "rule":[
        {"required":"true","type":"array","message":"请选择日期","trigger": "change"}
    ]   
},{
    "type":"formeditor",
    "label":"活动说明",
    "prop":"desc",
    "height":150,
    "zIndex":1000,
    "showModuleName":false,
    "value":"",
    "width":400,
    "haveRule":true,
    "rule":[
        {"required":"true","message":"请填写活动说明","trigger":"blur"}
    ],
    onchange(val){
        // console.log("change.....");
        // console.log(val);
         // 实时监控编辑器，并赋值到页面上
        // this.phoneData.rule = val;
    } 
},{
    "type":"checkbox",
    "label":"重复中奖",
    "prop":"rewardflag",
    "value":false,
    "checklabel":"允许",
    "haveRule":false
},{
    "type":"textappend",
    "label":"每人最多抽奖次数",
    "append":"次",
    "prop":"maxnum",
    "value":"",
    "width":400,
    "haveRule":true,
    "rule":[
        {"required":"true","message":"请填写最多活抽奖次数","trigger":"blur"}
    ]  
},{
    "type":"textappend",
    "label":"每人每天最多抽奖次数",
    "append":"次",
    "prop":"limitnum",
    "value":"",
    "width":400,
    "haveRule":true,
    "rule":[
        {"required":"true","message":"请填写每人每天最多活抽奖次数","trigger":"blur"}
    ]  
},{
    "type":"uploadimg",
    "label":"上传图片",
    "ref":"uploadbg",
    "prop":"bgImg",
    "fileList":[],
    "url":"https://jsonplaceholder.typicode.com/posts/",
    "haveRule":true,
    "rule":[
        {"required":"true","message":"请上传图片","trigger":"blur"}
    ],
    onpreview(file){
        console.log(file);
    },
    onremove(file, fileList){
        console.log(file,fileList);
    },
    onexceed(){
        this.$message.warning(`当前限制选择 1 个文件`);
        // this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    }
},{
    "type":"colorpicker",
    "label":"颜色",
    "prop":"bgColor",
    "fileList":[],
    "haveRule":true,
    "rule":[
        {"required":"true","message":"请上传图片","trigger":"blur"}
    ]  
}
]