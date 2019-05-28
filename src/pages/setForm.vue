<template>
    <div id='getForm'>
        <el-form :model="searchForm" :rules="searchFormRules" :label-width="labelWidth" ref="setform" >
            <template v-for="item,index in list">           
            <el-form-item v-if="item.show" class="item" :key="index" :label-width="item.labelWidth||labelWidth"  :label="item.label" :prop="item.prop">
                <i v-if="showicon" @click="delCurItem(item,index)" class="el-icon-delete delitem"></i>
                <template v-if="item.type === 'text'">
                    <el-input :readonly="typeof item.readonly == 'boolean'? item.readonly : false" v-model="searchForm[item.prop]" v-bind:style="{ width: (item.width || 150)+'px' }" :maxlength="item.maxlength ? item.maxlength : 100"></el-input>
                </template>

                <template v-else-if="item.type === 'textprepend'">
                    <el-input  v-model="searchForm[item.prop]"  v-bind:style="{ width: (item.width || 150)+'px' }">
                        <template slot="prepend">{{item.prepend}}</template>
                    </el-input>
                </template>
                <template v-else-if="item.type === 'textappend'">
                    <el-input  v-model="searchForm[item.prop]"  v-bind:style="{ width: (item.width || 150)+'px' }">
                        <template slot="append">{{item.append}}</template>
                    </el-input>
                </template>
                
                <template v-else-if="item.type === 'textarea'">
                    <el-input type="textarea" v-model="searchForm[item.prop]"  v-bind:style="{ width: (item.width || 150)+'px' }"></el-input>
                </template>
                <template v-else-if="item.type === 'formeditor'">
                    <!-- <div @copy.stop.prevent = "()=>{return false}" @paste.stop.prevent="()=>{return false}"    @contextmenu.stop.prevent = "()=>{return false}">  -->
                    <div>                   
                        <el-input type="textarea" ref="textareaeditor" :myAttr="item.prop" v-model="searchForm[item.prop]" style="display:none;"  v-bind:style="{ width: (item.width || 150)+'px' }"></el-input>
                        <vue-html5-editor ref="veditor" @change="(val)=>{ if(item.onchange){item.onchange(val,item.prop)}else{handleEditorChange(val,item.prop)}}" :content="item.value"  :height="item.height" :z-index="item.zIndex" :auto-height="false" :show-module-name="item.showModuleName"></vue-html5-editor>
                    </div>
                </template>

                <template v-else-if="item.type === 'select'">
                    <el-select @change="(val)=>{changeSelect(val,item,index,list)}"  v-model="searchForm[item.prop]" placeholder="请选择"  v-bind:style="{ width: (item.width || 150)+'px' }">
                        <el-option v-for="val,key in item.selectList" :key="key" :label="val.label" :value="val.value"></el-option>
                    </el-select>
                </template>

                <template v-else-if="item.type === 'date'" >                   
                    <el-date-picker  v-bind:style="{ width: (item.width || 150)+'px' }" type="date" placeholder="选择日期" v-model="searchForm[item.prop]"></el-date-picker>
                </template>
                <template v-else-if="item.type === 'datetime'" >                   
                    <el-date-picker  v-bind:style="{ width: (item.width || 150)+'px' }" type="datetime" placeholder="选择日期" v-model="searchForm[item.prop]"></el-date-picker>
                </template>
                <template v-else-if="item.type === 'datetimerange'">                   
                        <el-date-picker
                        :time-arrow-control="false"
                        v-model="searchForm[item.prop]"
                        type="datetimerange"
                        :picker-options="item.pickerOptions || ''"
                        :range-separator="item.separator || 至"
                        :start-placeholder="item.startPlaceholder||开始日期"
                        :end-placeholder="item.endPlaceholder||结束日期"  v-bind:style="{ width: (item.width || 150)+'px' }">
                      </el-date-picker>
                </template>

                <template v-else-if="item.type === 'checkbox'">                   
                    <el-checkbox :label="item.chklabel" v-model="searchForm[item.prop]">{{item.checklabel}}</el-checkbox>
                </template>
                <template v-else-if="item.type === 'checkboxGroup'">                   
                    <el-checkbox-group v-model="searchForm[item.prop]">
                        <el-checkbox v-for="chk,chknum in item.checklist" :label="chk.label" :name="item.prop" :key="chknum"></el-checkbox>                    
                    </el-checkbox-group>
                </template>

                <template v-else-if="item.type === 'radio'">                   
                    <el-radio v-model="searchForm[item.prop]">{{item.radiolabel}}</el-radio>
                </template>
                <template v-else-if="item.type === 'radioGroup'">                   
                    <el-radio-group v-model="searchForm[item.prop]">
                        <el-radio v-for="radio,radionum in item.radiolist" :label="radio.label" :name="item.prop" :key="radionum"></el-radio>
                    </el-radio-group>
                </template>

                <template v-else-if="item.type === 'upload'">                   
                        <el-upload
                        :with-credentials="true"
                        :ref="item.ref"
                        :accept="item.filetype"
                        :prop="item.prop"
                        :action="item.url"
                        :on-preview="item.onpreview"
                        :on-remove="item.onremove"
                        :file-list="item.fileList"
                        list-type="picture"
                        :multiple="false"
                        :limit="1"
                        :data="item.data"
                        :on-exceed="handleonexceed"
                        :on-success="submitImgSuccess"
                        :on-error="submitImgError"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitImg(item.ref)">上传到服务器</el-button>
                        <div slot="tip" class="el-upload__tip">{{item.tip}}</div>
                      </el-upload>
                </template>
                <template v-else-if="item.type === 'colorpicker'">                   
                    <el-color-picker v-model="searchForm[item.prop]" size="mini"></el-color-picker>
                </template>
            </el-form-item>
        </template>
        </el-form>
    </div>
</template>

<script>
import Util from '@assets/js/util.js'
export default {
    name: 'Setform',
    props:{
        'labelWidth':{
            type:String,
            default:()=>{
                return '100px';
            }
        },
        'list':{
            type:Array,
            default:()=>{
                return [];
            }
        },
        'showicon':{
            type:Boolean,
            default:()=>{
                return false;
            }
        }
    },
    data(){
        return{
            searchForm:{},
            searchFormRules:{},
            curUploadRef:''
        }
    },
    created(){
        this.getSearchFormObj(this.list);
        this.getSearchFromRule(this.list);
    },
    watch:{
        'list':{
            // 监听数据表格变化
            handler:function(cur,old){
                // console.log('watch searchform cur...');
                // console.log(cur);
               this.getSearchFormObj(cur);
               this.getSearchFromRule(cur);
            },
            deep:true
        },
    },
    mounted(){     
        let el = this.$refs.veditor[0].$refs.content;
        el.addEventListener('paste',(e)=>{           
            Util.textInit(e);
        },false);
    },
    methods:{
        handleonexceed(file,fileList){
            this.$message.warning(`当前限制选择 1 个文件`);
        },
        getSearchFormObj(arr){
           if(arr.length<=0){return;}
           let obj = {} 
           arr.map(item=>{
               obj[item.prop] = item.value || this.searchForm[item.prop];             
           })
           this.searchForm = Object.assign({},obj);
        },
        getSearchFromRule(arr){
            if(arr.length<=0){return;}
            let obj = {};
            arr.map(item=>{
                if(item.haveRule){
                    obj[item.prop] = item.rule;
                }
            })
            this.searchFormRules = Object.assign({},obj);
        },
        submitForm() {
            let flag = true;
            this.$refs.setform.validate((valid) => {
                if (valid) {
                    flag = true;
                } else {
                    flag =  false;
                }
            });
            return flag;
        },
        resetForm() {
            this.$refs.setform.resetFields();
        },
        handleEditorChange(val,prop){
            // 将editor映射到textarea上
            // let texta = this.$refs.textareaeditor[0];
            // let prop = texta.$attrs.myAttr;
            this.searchForm[prop] = val;
            this.$emit('editorChange',val);
            // console.log(val);
        },
        // 上传图片
        submitImg(ref){
            // console.log('submit');
            // console.log(this.$refs[ref]);
            this.$refs[ref][0].submit();
            this.curUploadRef = ref;
        },
        submitImgSuccess(res,file,fileList){
            // console.log('successs');
            // console.log(res);
            let uploadel =  this.$refs[this.curUploadRef][0];
            let prop = uploadel.$attrs.prop;

            if(!res.status){
                this.$message.warning('上传失败');
                this.searchForm[prop] = '';
            }else{
                // 获取上传后的图片地址
                // this.searchForm[prop] = res.url;
                this.searchForm[prop] = res.imageUrl;
                this.$emit('imgUrl',{
                    url:res.imageUrl,
                    prop:prop
                })
            }
        },
        submitImgError(err, file, fileList){
            console.log('error...');
            console.log(err.message);
        },
        delCurItem(item,index){
            this.$emit('delItem',index);
        },
        changeSelect(val,item,index,list){
            // console.log('select change');
            // console.log(val);
            this.$emit('selectchange',{value:val,item:item,index:index});
        }
    }
}
</script>

<style scoped>
    .item{
        position:relative;
        padding-right:20px;
    }
    .item:hover  i.delitem{
        display:block;
    }
    .delitem{
        position: absolute;
        cursor:pointer;
        right: -19px;
        top: 14px;
        z-index: 10;
        display:none;
    }
</style>