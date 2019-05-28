<template>
  <div id='aia-sence'>
      <el-container class="aia-sence-main">
        <!-- 左侧模板列表 -->
        <el-aside id="aia-senceLeft" style="width:280px">
          <h3 class="aia-title">模板中心</h3>
          <ul class="clearfix aia-templist">
            <li @click="getCurTemp(item)" :style="{background:'url('+item.icon+') left top no-repeat',backgroundSize:'cover',backgroundPosition: 'center center'}" v-for="item,index in tempList" :key="index"></li>
          </ul>
        </el-aside>
        <!-- 中间编辑区域 -->
        <el-main class="aia-sence-mid" style="position:relative;overflow:hidden;">
          <div id="sencePhone" @click="editorItemClick({id:null})">
            <h3 class="phone-title">{{phoneTitle}}</h3>
            <div id="phoneContent">
              <!-- 元素放置区域 -->
               <ul id="aia-editor">
                 <li class="editor-box animated" draggable="false" @dragstart="(e)=>{}" :ref="item.id" @mousedown="(e)=>{ if(item.editable){return false;} editorItemDown(e,item)}" @click.stop="editorItemClick(item)" :style="item.boxStyle" v-for="item,index in pageList">
                   <div class="editor-el-content noselect"  @blur="(e)=>{console.log('blur');}" @dblclick.stop.prevent="itemDbClick($event,item)">
                     <template v-if="item.type == 'text'" >
                        <div :class="{'editor-el-text':true,editable:item.editable}"  :contenteditable="''+item.editable+''">
                          <span :style="item.el.style">{{item.el.content}}</span>
                        </div>
                     </template>
                     <template v-if="item.type == 'img'">
                       <img draggable="false" :src="item.el.url" :alt="item.el.desc" :style="item.el.style ||　''">
                     </template>
                   </div>

                   <!-- 拖拽 -->
                   <div v-if="item.dragable" class="editor-drag noselect">
                      <div class="editor-drag-circle editor-drag-ne" @mousedown.stop="editorNEBorder( $event,item)"></div>
                      <div class="editor-drag-circle editor-drag-n"></div>
                      <div class="editor-drag-circle editor-drag-nw" @mousedown.stop="editorNWBorder( $event,item)"></div>
                      <div class="editor-drag-circle editor-drag-w" @mousedown.stop="editorEBorder( $event,item)"></div>
                      <div class="editor-drag-circle editor-drag-sw" @mousedown.stop="editorSWBorder( $event,item)"></div>
                      <div class="editor-drag-circle editor-drag-s" @mousedown.stop="editorSBorder( $event,item)"></div>
                      <div class="editor-drag-circle editor-drag-se" @mousedown.stop="editorSEBorder( $event,item)"></div>
                      <div class="editor-drag-circle editor-drag-e" @mousedown.stop="editorWBorder( $event,item)"></div>
                      <div class="editor-title-circle" @mousedown.stop="editorRotate($event,item)"></div>
                      <div class="editro-title-line"></div>
                   </div>
                 </li>
               </ul>
            </div>
          </div>
        </el-main>
        <!-- 右侧tool区域 -->
        <el-aside id="aia-sence-tool" style="width:70px;">
          <div class="aia-sence-tool-content">
              <div class="aia-sence-tool-item" @click="addTextTool"><i class="aia-icon aia-icon-12 aia-icon-text"></i><span>文本</span></div>
              <div class="aia-sence-tool-item"><i class="aia-icon aia-icon-12 aia-icon-pic"></i><span>图片</span></div>
              <div class="aia-sence-tool-item"><i class="aia-icon aia-icon-12 aia-icon-bg"></i><span>背景</span></div>
              <div class="aia-sence-tool-item" @click="addMusic"><i class="aia-icon aia-icon-12 aia-icon-music"></i><span>音乐</span></div>
              <div class="aia-sence-tool-item"><i class="aia-icon aia-icon-12 aia-icon-shape"></i><span>形状</span></div>
              <div class="aia-sence-tool-item"><i class="aia-icon aia-icon-12 aia-icon-component"></i><span>组件</span></div>
              <div class="aia-sence-tool-item"><i class="aia-icon aia-icon-12 aia-icon-form"></i><span>表单</span></div>
              <div class="aia-sence-tool-item"><i class="aia-icon aia-icon-12 aia-icon-effect"></i><span>特效</span></div>
          </div>        
        </el-aside>
        <!-- 右侧样式、动画设置区域 -->
        <el-aside id="aia-senceRight">
            <!-- 基础样式 -->
            <el-tabs  type="border-card" v-model="activeName">
              <el-tab-pane label="基础配置" name="first">
                <div style="padding:20px 15px 0 15px;">
                    <el-form size="mini" label-position="left" ref="basicform"  label-width="65px">
                        <el-form-item label="文字颜色" prop="color">
                          <el-color-picker v-model="basicform.color" size="mini"></el-color-picker>
                        </el-form-item>
                        <el-form-item label="行高" prop="lineHeight">
                          <el-slider v-model="basicform.lineHeight" :min="0" :max="100" :show-input-controls="false" show-input>
                        </el-slider>
                        </el-form-item>
                        <el-form-item label="文字大小" prop="fontSize">
                          <el-input v-model="basicform.fontSize"></el-input>
                        </el-form-item>
                      </el-form>
                </div>                
              </el-tab-pane>
              <!-- 动画设置 -->
              <el-tab-pane label="动画" name="second" style="padding:0;">
                <div style="padding-top:20px;">
                    <div style="padding-bottom:22px;text-align:center;">
                        <el-button size="mini" type="info" @click="addAni" icon="el-icon-plus" plain>添加动画</el-button>
                        <el-button size="mini" type="success" icon="el-icon-caret-right" plain>预览动画</el-button>
                    </div>
                    <div class="animate-card" v-for="item,index in aniData" :key="index">
                      <div class="animate-card-title noselect" @click="clickAniTitle(item)">
                        <span>动画{{index+1}}</span>
                        <span class="fr">
                          <i @click.stop="delAni(item,index)" class="el-icon-delete" style="margin-right:10px;"></i>
                          <i v-show="item.show" class="el-icon-caret-bottom"></i>
                          <i v-show="!item.show" class="el-icon-caret-right"></i>
                        </span>
                      </div>
                      <div style="padding:15px 15px 0;" v-show="item.show">
                          <el-form  label-width="65px">
                              <el-form-item label="动画方式" size="mini">
                                  <el-select v-model="item.form.name" placeholder="请选择">
                                    <el-option-group
                                      v-for="group in animateList"
                                      :key="group.label"
                                      :label="group.label">
                                      <el-option
                                        v-for="item in group.options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                      </el-option>
                                    </el-option-group>
                                  </el-select>
                              </el-form-item>
                              <el-form-item label="动画时间" size="mini">
                                  <el-slider  v-model="item.form.duration"  :min="0" :max="100" :show-input-controls="false" show-input></el-slider>
                              </el-form-item>
                              <el-form-item label="延迟时间" size="mini">
                                  <el-slider  v-model="item.form.delay" :min="0" :max="100" :show-input-controls="false" show-input></el-slider>
                              </el-form-item>
                              <el-form-item label="播放次数" size="mini">
                                  <el-slider  v-model="item.form.iterationCount" :min="0" :max="100" :show-input-controls="false" show-input></el-slider>
                              </el-form-item>
                              <el-form-item label="循环播放" size="mini">
                                  <el-checkbox v-model="item.form.loop" size="mini">否</el-checkbox>
                              </el-form-item>
                          </el-form>
                      </div>
                      
                    </div>
                </div>  
              </el-tab-pane>
            </el-tabs>
        </el-aside>
      </el-container>

       <!-- 音乐弹框 -->
        <el-dialog
          class="audioDialog"
          title="选择背景音乐"
          :visible.sync="audioFlag"
          :modal-append-to-body = "false"
          width="970px">
          <div class="audio-panel clear" v-loading="audioLoading" element-loading-spinner="aia-loading-circle" element-loading-text="拼命加载中..." element-loading-background="rgba(0, 0, 0, 0.3)">
              <div class="audio-panel-left">
                  <ul>
                      <li :class="{'audio-panel-acitve':(audioActive == 0)}" @click="audioActive = 0"><span>音乐库</span></li>
                      <!-- <li :class="{'audio-panel-acitve':(audioActive == 1)}" @click="audioActive = 1"><span>我的</span></li> -->
                  </ul>
                  <div class="audio-panel-upload">
                      <el-button  size="mini" @click="popTypeModel" type="success" plain>点击上传</el-button>
                      <!-- <el-upload
                          accept="audio/*" 
                          :data="{fileType:3,musicType:curAudioType}"
                          :action="uploadUrl"
                          :on-success = "handleAudioSuccess"
                          :multiple="false"
                          :limit="1"
                          :on-exceed="handleExceed"
                          :show-file-list = "false"
                          :file-list="bgAudioFileList">
                          <el-button  size="mini" @click="popTypeModel" type="success" plain>点击上传</el-button>
                          </el-upload> -->
                  </div>
              </div>
              <div class="audio-panel-right">
                  <!-- 音乐库 -->
                  <div v-show="audioActive==0" class="audio-panel-musiclibrary">
                      <ul class="audio-panel-classes">
                          <li v-for="item,index in audioClasses" :class="{'audio-panel-classes-item':(audioActiveType==index)}" @click="audioClickType(index,item)" :key="index">{{item.musicType}}</li>
                      </ul>
                      <ul class="audio-panel-audioList">
                          <li v-for="item,index in audioList" :class="{'audio-panel-audioList-active':(curAudioEl.id == item.id)}" @click="choiceCurAudio(item)">
                              <span>{{item.musicName}}</span>
                              <span class="audio-panel-audioList-icon"  @click.stop="audioPlay(item)">
                                  <i v-show="!item.play" class="el-icon-caret-right"></i>
                                  <i v-show="item.play" class="el-icon-loading"></i>
                              </span>
                          </li>
                      </ul>
                      <div class="audio-panel-tip">
                          <p><span>已选择：</span><span v-text="curAudioEl.musicName"></span><i v-show="!!curAudioEl.musicName" class="el-icon-circle-close-outline" @click="delCurAudio" style="margin-left:15px;cursor:pointer;"></i></p>
                      </div>
                      <div class="audio-panel-toolbar">
                          <el-pagination
                              @current-change="audioCurrentChange"
                              :current-page.sync="audioCurPage"
                              :page-size="10"
                              layout="total, prev, pager, next"
                              :total="audioTotal">
                          </el-pagination>
                      </div>
                      
                  </div>
                  <!-- 我的 -->
                  <div v-show="audioActive==1">

                  </div>
                  <audio loop :src="audioSrc" ref="aiaAudio" id="aiaAudio"></audio>
                  <el-button-group class="audio-foot-btn">
                      <el-button type="info" @click="audioFlag=false" size="mini">取消</el-button>
                      <el-button type="success" @click="audioOk" size="mini">确定</el-button>
                  </el-button-group>
              </div>
          </div>
          <!-- <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
          </span> -->
      </el-dialog>

      <el-dialog
          title="上传音乐"
          :visible.sync="uploadMusicFlag"
          :modal-append-to-body = "false"
          width="400px">
          <div style="height:200px;">
              <el-form size="mini" label-width="80px">
                  <el-form-item label="音乐类型" required>
                      <el-select v-model="curAudioType" placeholder="请选择">
                          <el-option
                              v-for="item in audioClassesList"
                              :key="item.id"
                              :label="item.tcName"
                              :value="item.id">
                          </el-option>
                      </el-select>
                      </el-form-item>
                      <el-form-item label="上传音乐" style="margin-top:30px;">
                              <el-upload
                              :with-credentials="true"
                              ref="musicUpType"
                              accept="audio/*" 
                              :data="{fileType:3,musicType:curAudioType}"
                              :action="uploadUrl"
                              :on-success = "handleAudioSuccess"
                              :multiple="false"
                              :limit="1"
                              :on-exceed="handleExceed"
                              :file-list="bgAudioFileList"
                              :auto-upload="false"
                              >
                              <el-button  slot="trigger" size="mini" :disabled="!curAudioType" type="primary" plain>点击上传</el-button>
                              <el-button :disabled="!curAudioType"  style="margin-left: 10px;" size="mini" type="success" @click="submitAudioUpload">上传</el-button>
                          </el-upload>
                      </el-form-item>
                      <el-form-item label="" style="margin-top:30px;">
                          <span style="color:#888;font-size:12px;">请先选择音乐类型，再上传音乐</span>
                      </el-form-item>
              </el-form>
          
              
          </div>
          <!-- <span slot="footer" class="dialog-footer">
              <el-button @click="uploadMusicFlag=false" type="primary">取消</el-button>
          </span> -->
      </el-dialog>
  </div>
</template>

<script>
import imgs0 from '@assets/images/tempThumbs/turn1.png'
import imgs1 from '@assets/images/prize.png'
import imgs2 from '@assets/images/tempThumbs/nine1.png'
import imgs3 from '@assets/images/participate.png'
import imgs4 from '@assets/images/tempThumbs/nine2.png'
import imgs5 from '@assets/images/prize.png'
import imgs6 from '@assets/images/tempThumbs/nine2.png'
import imgs7 from '@assets/images/participate.png'
import imgs8 from '@assets/images/tempThumbs/turn1.png'
import imgs9 from '@assets/images/prize.png'
import imgs10 from '@assets/images/tempThumbs/nine1.png'
import imgs11 from '@assets/images/participate.png'
import imgs12 from '@assets/images/participate.png'
import animateList from '@assets/js/animate.js'

export default {
  name: 'name',
  data() {
    return {
      animateList:animateList,
      phoneTitle:'中秋佳节',
      // 左侧
      tempList:[{
        id:0,
        icon:imgs0,
        pages:[{
          id:0,
          title:'大转盘',
          pagedata:[{
              id:0,
              type:'text',   
              dragable:false,       
              boxStyle:{
                width: '320px',
                height: '40px',
                left: '28px',
                top: '100px',
                zIndex: 1,
                transform: 'translate3d(0px, 0px, 0px) rotateZ(0deg)',
                opacity: 1
              },
              el:{
                content:'模板一内容...',
                style:{
                  color: 'rgb(65, 107, 55)',
                  fontFamily: 'hanyi_wh65',
                  fontSize: '16px'
                }           
              }            
            }, {
                id:1,
                type:'img',    
                dragable:true,   
                boxStyle:{
                  width: '128px',
                  height: '128px',
                  left: '50px',
                  top: '200px',
                  zIndex: 1,
                  transform: 'translate3d(0px, 0px, 0px) rotateZ(0deg)',
                  opacity: 1
                },
                el:{
                  url:imgs1,
                  desc:'img',
                  style:{
                    
                  }           
                }          
            }]
          },
        ]
      },{
        id:1,
        icon:imgs2,
        pages:[{
          id:0,
          title:'九宫格',
          pagedata:[{
            id:0,
            type:'text',   
            dragable:false,       
            boxStyle:{
              width: '320px',
              height: '40px',
              left: '28px',
              top: '100px',
              zIndex: 1,
              transform: 'translate3d(0px, 0px, 0px) rotateZ(0deg)',
              opacity: 1
            },
            el:{
              content:'模板一内容...',
              style:{
                color: 'rgb(65, 107, 55)',
                fontFamily: 'hanyi_wh65',
                fontSize: '16px'
              }           
            }            
          },
          {
            id:1,
            type:'img',    
            dragable:true,   
            boxStyle:{
              width: '97px',
              height: '75px',
              left: '50px',
              top: '200px',
              zIndex: 1,
              transform: 'translate3d(0px, 0px, 0px) rotateZ(0deg)',
              opacity: 1
            },
            el:{
              url:imgs3,
              desc:'img',
              style:{
                
              }          
            }   
          }]
        }]  
      },{
        id:2,
        icon:imgs4,
        pages:[{
          id:0,
          title:'大转盘',
          pagedata:[{
              id:0,
              type:'text',   
              dragable:false,       
              boxStyle:{
                width: '320px',
                height: '40px',
                left: '28px',
                top: '100px',
                zIndex: 1,
                transform: 'translate3d(0px, 0px, 0px) rotateZ(0deg)',
                opacity: 1
              },
              el:{
                content:'模板一内容...',
                style:{
                  color: 'rgb(65, 107, 55)',
                  fontFamily: 'hanyi_wh65',
                  fontSize: '16px'
                }           
              }            
            }, {
                id:1,
                type:'img',    
                dragable:true,   
                boxStyle:{
                  width: '128px',
                  height: '128px',
                  left: '50px',
                  top: '200px',
                  zIndex: 1,
                  transform: 'translate3d(0px, 0px, 0px) rotateZ(0deg)',
                  opacity: 1
                },
                el:{
                  url:imgs5,
                  desc:'img',
                  style:{
                    
                  }           
                }          
            }]
          },
        ]
      },{
        id:4,
        icon:imgs6,
        pages:[{
          id:0,
          title:'九宫格',
          pagedata:[{
            id:0,
            type:'text',   
            dragable:false,       
            boxStyle:{
              width: '320px',
              height: '40px',
              left: '28px',
              top: '100px',
              zIndex: 1,
              transform: 'translate3d(0px, 0px, 0px) rotateZ(0deg)',
              opacity: 1
            },
            el:{
              content:'模板一内容...',
              style:{
                color: 'rgb(65, 107, 55)',
                fontFamily: 'hanyi_wh65',
                fontSize: '16px'
              }           
            }            
          },
          {
            id:1,
            type:'img',    
            dragable:true,   
            boxStyle:{
              width: '97px',
              height: '75px',
              left: '50px',
              top: '200px',
              zIndex: 1,
              transform: 'translate3d(0px, 0px, 0px) rotateZ(0deg)',
              opacity: 1
            },
            el:{
              url:imgs7,
              desc:'img',
              style:{
                
              }          
            }   
          }]
        }] 
      },{
        id:5,
        icon:imgs8,
        pages:[{
          id:0,
          title:'大转盘',
          pagedata:[{
              id:0,
              type:'text',   
              dragable:false,       
              boxStyle:{
                width: '320px',
                height: '40px',
                left: '28px',
                top: '100px',
                zIndex: 1,
                transform: 'translate3d(0px, 0px, 0px) rotateZ(0deg)',
                opacity: 1
              },
              el:{
                content:'模板一内容...',
                style:{
                  color: 'rgb(65, 107, 55)',
                  fontFamily: 'hanyi_wh65',
                  fontSize: '16px',
                  lineHeight:'40px'
                }           
              }            
            }, {
                id:1,
                type:'img',    
                dragable:true,   
                boxStyle:{
                  width: '128px',
                  height: '128px',
                  left: '50px',
                  top: '200px',
                  zIndex: 1,
                  transform: 'translate3d(0px, 0px, 0px) rotateZ(0deg)',
                  opacity: 1
                },
                el:{
                  url:imgs9,
                  desc:'img',
                  style:{
                    lineHeight:'40px'
                  }           
                }          
            }]
          },
        ]
      },{
        id:6,
        icon:imgs10,
        pages:[{
          id:0,
          title:'九宫格',
          pagedata:[{
            id:0,
            type:'text',   
            dragable:false,       
            boxStyle:{
              width: '320px',
              height: '40px',
              left: '28px',
              top: '100px',
              zIndex: 1,
              transform: 'translate3d(0px, 0px, 0px) rotateZ(0deg)',
              opacity: 1
            },
            el:{
              content:'模板一内容...',
              style:{
                color: 'rgb(65, 107, 55)',
                fontFamily: 'hanyi_wh65',
                fontSize: '16px'
              }           
            }            
          },
          {
            id:1,
            type:'img',    
            dragable:true,   
            boxStyle:{
              width: '97px',
              height: '75px',
              left: '50px',
              top: '200px',
              zIndex: 1,
              transform: 'translate3d(0px, 0px, 0px) rotateZ(0deg)',
              opacity: 1
            },
            el:{
              url:imgs11,
              desc:'img',
              style:{
                
              }          
            }   
          }]
        }]  
      }],
      // 中间
      pageList:[
        {
          id:0,
          type:'text',   
          dragable:false,  
          editable:false,     
          boxStyle:{
            width: '320px',
            height: '40px',
            left: '28px',
            top: '100px',
            zIndex: 0,
            transform: 'translate3d(0px, 0px, 0px) rotateZ(45deg)',
            opacity: 1
          },
          el:{
            content:'我是测试内容...',
            style:{
              color: '#416b37',
              fontFamily: 'hanyi_wh65',
              fontSize: '16px',
              lineHeight:'40px'
            }           
          },          
        }, {
          id:1,
          type:'img',    
          dragable:true,   
          boxStyle:{
            width: '97px',
            height: '75px',
            left: '128px',
            top: '200px',
            zIndex: 1,
            transform: 'translate3d(0px, 0px, 0px) rotateZ(0deg)',
            opacity: 1
          },
          el:{
            url:imgs12,
            desc:'img',
            style:{
              
            }
          },
          animateList:[
            {
              show:true,
              form:{
                name:'bounce',
                duration: 1,    //动画持续时间
                delay: 0,    //动画延迟时间
                iterationCount: 1,    //动画执行次数
                loop:false,
              }          
            },
            {
              show:true,
              form:{
                name:'flash',
                duration: 2,    //动画持续时间
                delay: 1,    //动画延迟时间
                iterationCount: 2,    //动画执行次数
                loop:false,
              }
            }
          ],
        }
      ],
      // 右侧
      activeName:'first',
      basicform:{},
      curItem:{},
      animateValue:'',
      aniData:[
        {
          show:true,
          form:{
            name:'',
            duration: 0,    //动画持续时间
            delay: 0,    //动画延迟时间
            iterationCount: 0,    //动画执行次数
            loop:false,
          }
        }
      ],
      // 上传音乐
      uploadMusicFlag:false,
      curAudioType:'',
      audioClassesList:[],
      uploadUrl:REQUEST_PATH+'upload/uploadFile',
      bgAudioFileList:[],
      audioDialog:false,
      audioLoading:false,
      audioClasses:[],
      audioList:[],
      audioCurPage:1,
      audioTotal:0,
      audioSrc:'',
      audioFlag:false,
      audioActive:0,//当前活动tab
      curAudioEl:{},
      audioActiveType:0,//当前活动类别
    }
  },
  watch:{
    basicform:{
      handler:function(cur,old){
        if(this.curItem.id != null){
          this.curItem.el.style = Object.assign(this.curItem.el.style,{
            color:cur.color,
            lineHeight:cur.lineHeight+'px',
            fontSize:cur.fontSize+'px',
          })
        }
      },
      deep:true
    }
  },
  created(){
    // 初始化动画
    this.pageList.map(item=>{
      if(item.hasOwnProperty('animateList')){
        console.log('has...')
        let aniArr = [];
        item.animateList.map(val=>{
          aniArr.push(val.form.name+' '+ val.form.duration+'s '+val.form.delay+'s '+val.form.iterationCount)
        })
        item.boxStyle.animation = aniArr.join(',')
        console.log(item);
      }
    })
    // 获取音乐数据
    this.getMusicList();
    this.getMusicType();
  },
  mounted(){
    this.scroll.init(document.querySelector('#aia-senceLeft'));
    this.scroll.init(document.querySelector('#aia-senceRight'));
  },
  methods: {
    /* 左侧区域*/

    // 点击模板
    getCurTemp(item){
      console.log('template li data...');
      console.log(item);
      this.pageList = [];
      let page = item.pages[0];
      this.phoneTitle = page.title;
      page.pagedata.map(item=>{
        this.pageList.push(item);
      })      
    },

    //中间 editor 
    // 元素点击事件
    editorItemClick(obj){
      console.log('click...');
      console.log(obj);
      obj.dragable = true;
     
      // 清空页面元素的拖拽和编辑状态
      this.pageList.map(val=>{        
        if(val.id !== obj.id){
          val.dragable = false;
          val.editable = false;          
        }
        return val;
      })

      if(this.curItem.id == obj.id ){
        return false;
      }else{
        this.curItem = obj;
      }     
      console.log('obj id');
      console.log(obj.id);
      if(obj.id != null){
        switch(obj.type){
          case 'text':{
            //  设置基础样式
            console.log('style..');
            console.log(obj.el.style.lineHeight.slice(0,-2));
            this.basicform=Object.assign({
              color:obj.el.style.color,
              lineHeight:parseInt(obj.el.style.lineHeight.slice(0,-2)),
              fontSize:parseInt(obj.el.style.fontSize.slice(0,-2)),
            })
            break;
          }
          default:{
            this.basicform = {}
          }
        }
        
      }
    },
    // 元素双击事件
    itemDbClick(e,item){
      let el = e.target || e.srcElement;
      console.log('dbclick..');
      console.log(el);  
      
      if(item.type != 'text'){
        return false;
      }

      if(item.type == 'text'){
        item.editable = true;
      }
      this.$nextTick(()=>{
        this.selectText('editable');
      })     
    },
   selectText(containerid) {
      console.log('editable');
      console.log($('.editor-el-content').find('.editable').get(0));
      let el = $('.editor-el-content').find('.editable').get(0);
      if (document.selection) {
          var range = document.body.createTextRange();
          range.moveToElementText(el);
          range.select();
      } else if (window.getSelection) {
          var range = document.createRange();
          range.selectNodeContents(el);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
      }
    },
    // 元素drag事件
    editorItemDown(e,item){
      // console.log('drag..');
      // console.log(e);
      // console.log(item);
      // let e =  e = e || window.event;
      if(!item.dragable){
        return;
      }

      let el = e.srcElement || e.target;
      let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft; 
      let scrollY = document.documentElement.scrollTop || document.body.scrollTop; 
      let initialX = e.pageX || e.clientX + scrollX; 
      let initialY = e.pageY || e.clientY + scrollY; 

      let lenLeft = item.boxStyle.left.length-2;
      let lenTop = item.boxStyle.top.length-2;
      let initialItemLeft = parseInt(item.boxStyle.left.substring(0,lenLeft));
      let initialItemTop = parseInt(item.boxStyle.top.substring(0,lenTop))

      document.onmousemove=function(e){
        let el = e.srcElement || e.target;
        let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft; 
        let scrollY = document.documentElement.scrollTop || document.body.scrollTop; 
        let x = e.pageX || e.clientX + scrollX; 
        let y = e.pageY || e.clientY + scrollY; 

        let disX = x - initialX;
        let disY = y - initialY;

        item.boxStyle.left = initialItemLeft + disX +'px';
        item.boxStyle.top = initialItemTop + disY + 'px';
        // console.log('move...');
        // console.log(item.boxStyle.left);
      }
      document.onmouseup=function(){
        // console.log('mouseup...');
        el.onmousemove = null;
        document.onmousemove = null;
        document.onmouseup = null
      }
    },

    // Math.cos(180*(Math.PI*2/360))
    // 元素拉伸事件
    // 拖拽西边的边框
    editorWBorder(e,item){
      let el = e.srcElement || e.target;
      let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft; 
      // let scrollY = document.documentElement.scrollTop || document.body.scrollTop; 
      let initialX = e.pageX || e.clientX + scrollX; 
      // let initialY = e.pageY || e.clientY + scrollY; 

      let lenLeft = item.boxStyle.left.length-2;
      let lenTop = item.boxStyle.top.length-2;
      let w = parseInt(item.boxStyle.width.substring(0,item.boxStyle.width.length-2));
      let l = parseInt(item.boxStyle.left.substring(0,lenLeft));
      // let t = parseInt(item.boxStyle.top.substring(0,lenTop))

      let transfromStyle = item.boxStyle.transform;
      let reg = /rotateZ\((-*\w*)deg\)/ig;
      let rotateDeg = '';
      transfromStyle.replace(reg, function(s,value) {
          rotateDeg = parseInt(value);
      });

      console.log('deg...');
      console.log(rotateDeg);

      document.onmousemove=function(e){
        let x = e.pageX || e.clientX + scrollX; 
        // let y = e.pageY || e.clientY + scrollY; 
        let disX = initialX - x;
        // let disY = initialY - y;

        // let endx = disX * Math.cos(rotateDeg * (Math.PI*2/360));
        // let endy = disX * Math.sin(rotateDeg*(Math.PI*2/360))

        // console.log('计算x、y...');
        // console.log(endx);
        // console.log(endy);

        let endW = w + disX;
        if(endW <= 1){
          return;
        }
        item.boxStyle.width = endW +'px';
        // item.boxStyle.left = l - endx +'px';
        // item.boxStyle.top = t - endy + 'px';
        item.boxStyle.left = l - disX +'px';
      }
      document.onmouseup=function(){
        // console.log('mouseup...');
        el.onmousemove = null;
        document.onmousemove = null;
        document.onmouseup = null
      }
    },
    // 拖拽东边的边框
    editorEBorder(e,item){
      let el = e.srcElement || e.target;
      let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft; 
      let initialX = e.pageX || e.clientX + scrollX; 
      let w = parseInt(item.boxStyle.width.substring(0,item.boxStyle.width.length-2));

      document.onmousemove=function(e){
        let x = e.pageX || e.clientX + scrollX; 
        let disX = initialX - x;
        let endW = w - disX;
        if(endW <= 1){
          return;
        }
        item.boxStyle.width = endW +'px';
      }
      document.onmouseup=function(){
        el.onmousemove = null;
        document.onmousemove = null;
        document.onmouseup = null
      }
    },
     // 拖拽东边的边框
     editorSBorder(e,item){
      let el = e.srcElement || e.target;
      let scrollY = document.documentElement.scrollTop || document.body.scrollTop; 
      let initialY = e.pageY || e.clientY + scrollY;
      let lenTop = item.boxStyle.top.length-2;
      let h = parseInt(item.boxStyle.height.substring(0,item.boxStyle.height.length-2));
      let t = parseInt(item.boxStyle.top.substring(0,lenTop));

      document.onmousemove=function(e){
        let y = e.pageY || e.clientY + scrollY; 
        let disY = initialY - y;
        let endH = h - disY;
        if(endH<=1){
          return;
        }
        item.boxStyle.height = endH +'px';
      }
      document.onmouseup=function(){
        el.onmousemove = null;
        document.onmousemove = null;
        document.onmouseup = null
      }
    },
     // 拖拽西北角
     editorNWBorder(e,item){
      let el = e.srcElement || e.target;
      let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft; 
      let scrollY = document.documentElement.scrollTop || document.body.scrollTop; 
      let initialX = e.pageX || e.clientX + scrollX; 
      let initialY = e.pageY || e.clientY + scrollY; 

      let lenLeft = item.boxStyle.left.length-2;
      let lenTop = item.boxStyle.top.length-2;
      let w = parseInt(item.boxStyle.width.substring(0,item.boxStyle.width.length-2));
      let h = parseInt(item.boxStyle.height.substring(0,item.boxStyle.height.length-2));
      let l = parseInt(item.boxStyle.left.substring(0,lenLeft));
      let t = parseInt(item.boxStyle.top.substring(0,lenTop))

      document.onmousemove=function(e){
        let x = e.pageX || e.clientX + scrollX; 
        let y = e.pageY || e.clientY + scrollY; 
        let disX = initialX - x;
        let disY = initialY - y;

        let endW = w + disX;
        let endH = h + disY;

        if(endW <=1 || endH <=1){
          return;
        }
        item.boxStyle.width = endW +'px';
        item.boxStyle.height = endH +'px';
        item.boxStyle.left = l - disX +'px';
        item.boxStyle.top = t - disY + 'px';
      }
      document.onmouseup=function(){
        // console.log('mouseup...');
        el.onmousemove = null;
        document.onmousemove = null;
        document.onmouseup = null
      }
    },
     // 拖拽东北角
     editorNEBorder(e,item){
      let el = e.srcElement || e.target;
      let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft; 
      let scrollY = document.documentElement.scrollTop || document.body.scrollTop; 
      let initialX = e.pageX || e.clientX + scrollX;
      let initialY = e.pageY || e.clientY + scrollY;

      let lenLeft = item.boxStyle.left.length-2;
      let lenTop = item.boxStyle.top.length-2;
      let w = parseInt(item.boxStyle.width.substring(0,item.boxStyle.width.length-2));
      let h = parseInt(item.boxStyle.height.substring(0,item.boxStyle.height.length-2));
      let l = parseInt(item.boxStyle.left.substring(0,lenLeft));
      let t = parseInt(item.boxStyle.top.substring(0,lenTop))

      document.onmousemove=function(e){
        let x = e.pageX || e.clientX + scrollX; 
        let y = e.pageY || e.clientY + scrollY; 
        let disX = initialX - x;
        let disY = initialY - y;

        let endW = w - disX;
        let endH = h + disY;

        if(endW <=1 || endH <=1){
          return;
        }

        item.boxStyle.width = endW +'px';
        item.boxStyle.height = endH +'px';
        // item.boxStyle.left = l - disX +'px';
        item.boxStyle.top = t - disY + 'px';
      }
      document.onmouseup=function(){
        // console.log('mouseup...');
        el.onmousemove = null;
        document.onmousemove = null;
        document.onmouseup = null
      }
    },
     // 拖拽西南角
     editorSWBorder(e,item){
      let el = e.srcElement || e.target;
      let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft; 
      let scrollY = document.documentElement.scrollTop || document.body.scrollTop; 
      let initialX = e.pageX || e.clientX + scrollX;
      let initialY = e.pageY || e.clientY + scrollY;

      let lenLeft = item.boxStyle.left.length-2;
      let lenTop = item.boxStyle.top.length-2;
      let w = parseInt(item.boxStyle.width.substring(0,item.boxStyle.width.length-2));
      let h = parseInt(item.boxStyle.height.substring(0,item.boxStyle.height.length-2));
      let l = parseInt(item.boxStyle.left.substring(0,lenLeft));
      // let t = parseInt(item.boxStyle.top.substring(0,lenTop))

      document.onmousemove=function(e){
        let x = e.pageX || e.clientX + scrollX; 
        let y = e.pageY || e.clientY + scrollY; 
        let disX = initialX - x;
        let disY = initialY - y;

        let endW = w + disX;
        let endH = h - disY;

        if(endW <=1 || endH <=1){
          return;
        }
        item.boxStyle.width = endW +'px';
        item.boxStyle.height = endH +'px';
        item.boxStyle.left = l - disX +'px';
        // item.boxStyle.top = t - disY + 'px';
      }
      document.onmouseup=function(){
        // console.log('mouseup...');
        el.onmousemove = null;
        document.onmousemove = null;
        document.onmouseup = null
      }
    },
     // 拖拽东南角
     editorSEBorder(e,item){
      let el = e.srcElement || e.target;
      let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft; 
      let scrollY = document.documentElement.scrollTop || document.body.scrollTop; 
      let initialX = e.pageX || e.clientX + scrollX;
      let initialY = e.pageY || e.clientY + scrollY;

      let lenLeft = item.boxStyle.left.length-2;
      let lenTop = item.boxStyle.top.length-2;
      let w = parseInt(item.boxStyle.width.substring(0,item.boxStyle.width.length-2));
      let h = parseInt(item.boxStyle.height.substring(0,item.boxStyle.height.length-2));
      // let l = parseInt(item.boxStyle.left.substring(0,lenLeft));
      // let t = parseInt(item.boxStyle.top.substring(0,lenTop))

      document.onmousemove=function(e){
        let x = e.pageX || e.clientX + scrollX; 
        let y = e.pageY || e.clientY + scrollY; 
        let disX = initialX - x;
        let disY = initialY - y;

        let endW = w - disX;
        let endH = h - disY;

        if(endW <=1 || endH <=1){
          return;
        }
        item.boxStyle.width = endW +'px';
        item.boxStyle.height = endH +'px';
        // item.boxStyle.left = l - disX +'px';
        // item.boxStyle.top = t - disY + 'px';
      }
      document.onmouseup=function(){
        // console.log('mouseup...');
        el.onmousemove = null;
        document.onmousemove = null;
        document.onmouseup = null
      }
    },
    // 旋转
    editorRotate(e,item){
      let el = e.srcElement || e.target;
      // 获取父元素的坐标位置
      let parent = el.parentNode.parentNode;
      let bounding = parent.getBoundingClientRect();
      let centerX = bounding.left + bounding.width/2;
      let centerY = bounding.top + bounding.height/2;

      document.onmousemove=function(e){
        let el = e.srcElement || e.target;
        let scrollX = document.documentElement.scrollLeft || document.body.scrollLeft; 
        let scrollY = document.documentElement.scrollTop || document.body.scrollTop; 
        let x = e.pageX || e.clientX + scrollX; 
        let y = e.pageY || e.clientY + scrollY; 
        // 获取鼠标移动距离
        let disX = x - centerX;
        let disY = y - centerY;        
        // 获取旋转角度
        let r = 270 - ((180/Math.PI) * Math.atan2(disY,disX)); 
        let enddeg = -r;
        // 实时旋转元素
        item.boxStyle.transform = 'translate3d(0px, 0px, 0px) rotateZ('+enddeg+'deg)'
      }
      document.onmouseup=function(){
        el.onmousemove = null;
        document.onmousemove = null;
        document.onmouseup = null
      }
    },

    // 右侧
    // tool事件
    addTextTool(){
      // 清空页面元素的拖拽和编辑状态
      $('#sencePhone').click();
      this.pageList.push({
          id:this.$util.getId(),
          type:'text',   
          dragable:true,       
          editable:true,
          boxStyle:{
            width: '320px',
            height: '40px',
            left: '5px',
            top: '20px',
            zIndex: this.pageList.length,
            transform: 'translate3d(0px, 0px, 0px) rotateZ(0deg)',
            opacity: 1
          },
          el:{
            content:'请填写内容...',
            style:{
              color: '#656565',
              fontFamily: 'hanyi_wh65',
              fontSize: '16px',
              lineHeight:'40px'
            }           
          }       
      })
      // 默认可编辑
      this.$nextTick(()=>{
        this.selectText('editable');
      })   
    },
    // 音乐
    addMusic(){
     this.audioFlag = true;
    },
    handleAudioSuccess(){
      console.log('音乐上传成功...')
      console.log(res);
      if(!res.status){
          this.$message.warning('上传失败');
      }else{
          // 获取上传后的图片地址
          this.getMusicList();
          this.uploadMusicFlag = false;
          
          // 跟移动端通信
          /*console.log('post autio...');
          document.querySelector("#ifr").
          contentWindow.postMessage({
              'bgAudio':res.imageUrl
          },this.baseUrl+this.ifrSrc); */  
      }
    },
    handleExceed(){
      this.$message.warning(`只能上传一个文件`);
    },
    submitAudioUpload(){
      this.$refs.musicUpType.submit();
    },
    popTypeModel(){                    
        this.curAudioType = '';
        this.bgAudioFileList = [];
        this.uploadMusicFlag = true;
    },
    getMusicType(){
        this.$post({
          url:REQUEST_PATH+'music/getMusicType',
          data:{},
          success:(res)=>{
             res.data.data.map(item=>{
                  this.audioClassesList.push(item);
                  this.audioClasses.push(item);
              })                        
              this.audioClasses.unshift({
                  id:'',
                  musicType:'全部'
              });
          }
        })
    },      
    // 获取音乐列表
    getMusicList(){
        this.$post({
          url:REQUEST_PATH+'music/getMusic',
          data:{
            musicType:this.curMusicType,
            pageIndex:this.audioCurPage
          },
          loading:'audioLoading',
          success:(res)=>{
            this.audioList = res.data.data;
            this.audioTotal = res.data.total;
          }
        })
    },        
    // 设置背景音乐
    audioClickType(index,item){
        // 点击当前类型方法
        this.audioActiveType = index;
        this.curMusicType = item.id;
        this.getMusicList();
    },
    // 点击音乐行
    choiceCurAudio(item){
        this.curAudioEl = Object.assign({},item);
    },
     // 播放音乐
    audioPlay(item){
        let audioEl = document.getElementById('aiaAudio');
        console.log('播放音乐');
        item.play = !item.play;
        this.audioSrc = '';      
        this.audioSrc = item.musicUrl;                                   
        this.audioList.map(val=>{
            if(item.id != val.id){
                val.play = false;
            }
        });                   
        if(!item.play){
            if (!audioEl.paused) {
                audioEl.pause();
            } 
        }else{
            audioEl.pause();
            this.$nextTick(()=>{
                audioEl.play();
            })
        }                    
    },
    delCurAudio(){
        this.curAudioEl = {};
    },
    // 点击确定
    audioOk(){
        console.log('点击音频弹框确定按钮...');
        this.audioFlag = false;
        this.bgAudio = this.curAudioEl.musicUrl || '';
        let audioEl = document.getElementById('aiaAudio');
        if (!audioEl.paused) {
            audioEl.pause();
            this.curAudioEl = '';
        } 
        this.audioList.map(item=>{
            if(item.play){
                item.play = false;
            }
        })
    },
    // 换页
    audioCurrentChange(page){
        this.audioCurPage = page;
        this.getMusicList();
    },
    // 添加动画
    addAni(){
      this.aniData.push({
        show:true,
        form:{
          method:'',
          animateTime:0,
          expandTime:0,
          playNum:0,
          isLoop:false
        }
      })
    },
    // 删除动画
    delAni(item,index){
      this.aniData.splice(index,1);
    },
    // 点击动画标题显示和隐藏面板
    clickAniTitle(item){
      item.show = !item.show;
    }
  }
}
</script>

<style lang='less' rel="stylesheet/less" scoped>  
  #aia-sence{
    height:100%;
    overflow:hidden;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    background-color:#d0cfd8;
  }
  #aia-sence .aia-sence-main{
    height:100%;
  }
  #aia-main .el-main{
    background-color:transparent;
  }

  /* 公用 */
  #aia-senceLeft,#aia-senceRight{
    background-color:#f0f3f4;
    text-align:left;
  }
  #aia-senceLeft h3.aia-title,#aia-senceRight h3.aia-title{
    margin:10px 0;
    font-size:16px;
  }
  /* 左侧 */
  #aia-senceLeft{
    padding-left:10px;
    min-width:100px;
  }  
  #aia-senceLeft .aia-templist li{
    /* float:left; */
    display: inline-block;
    vertical-align: top;
    width:80px;
    height:139px;
    margin-right:10px;
    margin-bottom:10px;
    overflow:hidden;
    cursor:pointer;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    border: 1px solid #ccd5db;
    font-size:0;
    border-radius: 5px;    
    transform-origin: center,center;    
  }
  #aia-senceLeft .aia-templist li:hover{
    box-shadow:0 0px 10px rgba(0,0,0,.3);
  }
  #aia-senceLeft .aia-templist li img{
    width:100%;
  }

  /* 中间 */
  .aia-sence-mid{
    min-width:450px;
  }
  #sencePhone{
    width:326px;
    height:620px;
    margin:65px auto 0;
    background:url('@assets/images/phone.svg') left center;
  }
  .phone-title{
    height:40px;
    text-align:center;
    color:#fff;
    line-height: 40px;
    padding-top:57px;
    font-size:15px;
    font-weight:none;
    margin:0;
  }
  #phoneContent{
    /* overflow:hidden; */
    width:320px;
    height:486px;
    background-color:transparent;
    position:absolute;
    margin-left:3px;
    z-index:0;
  }

  /* 工具 */
  #aia-sence-tool{    
    min-width:70px;
    .aia-sence-tool-content{
      position: relative;
      top: 60px;
      background-color:#31364a;
    }
  }
  #aia-editor{
    .editor-box{
      position: absolute;
      transform-origin:50% 50%;
    }
    .editor-el-content{
      width:100%;
      height:100%;
      overflow:hidden;
      position:relative;
      z-index:3;
      >img{
        width:100%;
        height:100%;
      }
    }
    .editor-el-text{
      cursor: default;
      font-size: 24px;
      width: 320px;
      height: 40px;
      line-height: 40px;
      text-rendering: optimizeLegibility;
      min-height: inherit;     
      outline:none;
    }
    .aia-editor li .editor-el-text[contenteditable="true"]{
      -webkit-touch-callout: text;
      -webkit-user-select: text;
      -khtml-user-select: text;
      -moz-user-select: text;
      -ms-user-select: text;
      user-select: text;
    }

    /* drag */
    .editor-drag{
      width:100%;
      height:100%;
      border:1px solid #59c7f9;
      position:absolute;
      left:-6px;
      top:-6px;
      z-index:2;
      padding:6px;

      .editor-drag-circle{
        position:absolute;
        width: 12px;
        height: 12px;
        background-color: #fff;
        border: 1px solid #59c7f9;
        border-radius: 12px;        
      }
      .editor-drag-nw{
        cursor: nw-resize;
        top: -5px;
        left: -5px;
      }
      .editor-drag-n{
        /* cursor:move; */
        left: 50%;
        top: -7px;
        margin-left: -6px;
      }
      .editor-drag-ne{
        cursor:ne-resize;
        top: -5px;
        right: -6px;
      }
      .editor-drag-w{
        cursor:w-resize;
        top: 50%;
        right: -7px;
        margin-top: -5px;
      }
      .editor-drag-se{
        cursor: se-resize;
        bottom: -5px;
        right: -6px;       
      }
      .editor-drag-s{
        cursor: s-resize;
        left: 50%;
        bottom: -7px;
        margin-left: -6px;
      }
      .editor-drag-sw{
        cursor: sw-resize;
        bottom: -5px;
        left: -5px;        
      }
      .editor-drag-e{
        cursor: e-resize;
        top: 50%;
        left: -7px;
        margin-top: -5px;
      }
      .editor-title-circle{
        position:absolute;
        width: 12px;
        height: 12px;
        top: -28px;
        left: 50%;
        margin-left: -6px;
        background-color: #44cb83;
        border-radius: 12px;       
        border: none;
        cursor: url('/assets/images/rotate.ico') 10 10,default;
      }
      .editro-title-line{
        width: 1px;
        height: 12px;
        top: -18px;
        left: 50%;
        margin-left: -.5px;
        background-color: #44cb83;
        position:absolute;
      }
    }
  }
  #aia-sence-tool .aia-sence-tool-item{
    font-size:12px;
    color:#fff;
    height:40px;
    cursor:pointer;
    line-height:40px;
    &:hover{
      background-color:#76838f;
    }
    i{
      vertical-align:middle;
      margin-top: -2px;
    }
    span{
      margin-left:7px;
    }
  }

  /* 右侧 */
  #aia-senceRight{
    /* padding:0 10px; */
    min-width:300px;
    .animate-card{
      .animate-card-title{
        background: #f6f9fa;
        height: 34px;
        line-height: 34px;
        overflow: hidden;
        font-size:13px;
        margin-top:-2px;
        border-top: 1px solid #e6ebed;
        border-bottom: 1px solid #e6ebed;
        padding:0 15px;
        cursor:pointer;
      }
    }
  }
</style>