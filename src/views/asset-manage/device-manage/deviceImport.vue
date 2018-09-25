<style scoped>

</style>

<template>

<div>
  
  <Modal v-model="IsModalShow" title="烟感设备导入" :mask-closable="false" @on-cancel="cancel" width="680">
    <Row style="margin-bottom:20px;">
      <Button @click="downloadExcelTemplate" type="ghost" style="background-color:#fff"  size="large"
              icon="archive">导入模版
      </Button>
      <Upload 
              ref="upload"
               :headers="MyHeaders"
               :before-upload="beforeUpload"
               :on-success="handleSuccess"
               :format="['xls','xlsx']"
               :on-format-error="handleFormatError"
               :action="UploadAddress"
               class="top-btn">
        <Button type="primary" size="large" :loading="IsUploading" icon="ios-cloud-upload-outline">导入烟感设备</Button>
      </Upload>
    </Row>

    <Row v-if="tableData.length>0">
      <Table stripe size="small"  :columns="tableColums" :data="tableData"></Table>
    </Row>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >关闭</Button>
    </div>
  </Modal>
</div>

</template>

<script>
import {baseUrl} from './../../../api/env'
export default {
    props:{
      modalShow:{
        type: Boolean,
        default: true,
      },
    },
    data() {
        return {
          IsModalShow:false,
          modalForm:{
          },
          modalForm_loading:false,
          tableColums: [
              {
                  align:'center',
                  title: '行号',
                  key: 'RowNum',
              },
              {
                  align:'center',
                  title: '关键字',
                  key: 'Keyword',
              },
              {
                  align:'center',
                  title: '原因',
                  key: 'Reason',
              }],
          tableData: [
          ],
          IsUploading:false,
        }
    },
    computed:{
        MyHeaders:function () {
            let myHeaders = {};
            let tokenValue = sessionStorage.getItem("token");
            if (tokenValue){
                myHeaders.Authorization=tokenValue;
            }
            return myHeaders;
        },
        UploadAddress:function () {
            return baseUrl+'/Smk_Devices/UploadExcel';
        },
    },
    watch:{
      modalShow(curVal,oldVal){
        this.IsModalShow = curVal;
        this.tableData=[];
        this.$refs['upload'].clearFiles();
      }
    },
    created(){

    },
    mounted(){
    },
    methods: {
      cancel() {
          if (!this.IsUploading){
              this.$emit('listenModalForm');
          }
      },
      beforeUpload(){
          this.IsUploading=true;
      },
      handleSuccess (res, file) {
          this.IsUploading=false;
          let result=res;
          if(res.success){
              this.$Message.success('上传成功！');
              if (res.lstResult){
                  this.tableData=res.lstResult;
              }
              this.$emit('refreshTableList');
          }else{
              if (res.lstResult){
                  this.tableData=res.lstResult;
              }
              this.$Message.error(res.msg);
          }

          console.log(result)
      },
      handleFormatError (file) {
          this.IsUploading=false;
          this.$Notice.warning({
              title: '文件格式不对',
              desc: '上传文件格式不正确，请上传xls或xlsx格式的excel'
          });
      },
      downloadExcelTemplate(){
          const url = baseUrl + "/ExcelTemplate/烟感设备导入模版.xlsx";
          window.open(url);
      },
    }
}

</script>
