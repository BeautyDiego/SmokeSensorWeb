<style scoped>
</style>

<template>

<div>
  
  <Modal
    v-model="IsModalShow"
    :title="modalFormTitle"
    :mask-closable="false"
    @on-cancel="cancel"
    width="600">
    <Form ref="modalForm" :model="modalForm" :label-width="100"  value=true  style="padding: 3px 60px">
      <Form-item label="设备名称" prop="DevName" :rules="{required: true, message: '必填,1-50位字符',min:1,max:50,  trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.DevName" maxlength=50 ></Input>
      </Form-item>
      <Form-item label="设备型号" prop="DevModel" :rules="{required: true, message: '必填',  trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.DevModel" maxlength=20></Input>
      </Form-item>
      <Form-item label="IMEI" prop="IMEI" :rules="{required: true, message: '必填', trigger:'blur',type:'string'}" >
        <Input v-model="modalForm.IMEI" maxlength=20></Input>
      </Form-item>
      <Form-item label="ICCID" prop="ICCID" >
        <Input v-model="modalForm.ICCID" maxlength=25></Input>
      </Form-item>
      <Form-item label="安装地址" >
        <Input v-model="modalForm.InstallADDR" type="textarea" :rows="2" maxlength=30></Input>
      </Form-item>
    </Form>
    <div slot="footer">
      <Button type="ghost"  @click="cancel" >关闭</Button>
      <Button type="primary"  :loading="modalForm_loading" @click="saveForm('modalForm')">保存</Button>
    </div>
  </Modal>
</div>

</template>

<script>
import { addDevice, editDevice } from "../../../api/getData";
export default {
  props: {
    parentForm: {
      type: Object,
      default: function() {
        return {
        Id: "",
        Web_UsersId: "",
        Web_AgentId: "",
        Admin_GroupId: "",
        Agent_GroupId: "",
        Customer_GroupId: "",
        DevId: "",
        DevName: "",
        DevModel: "1",
        FriendName: "",
        IMEI: "",
        ICCID: "",
        InstallDate: "",
        InstallADDR: "",
        Remark: ""
        };
      }
    },
    modalShow: {
      type: Boolean,
      default: true
    },
    modalFormTitle: {
      type: String,
      default: "添加设备"
    }
  },
  data() {
    return {
      IsModalShow: false,
      modalForm: {},
      modalForm_loading: false
    };
  },
  watch: {
    modalShow(curVal, oldVal) {
      this.modalForm = Object.assign(this.parentForm);
      this.IsModalShow = curVal;
    }
  },
  created() {
  },
  mounted() {},
  methods: {
    cancel() {
      this.$emit("listenModalForm");
    },
    saveForm(name) {
      this.$refs[name].validate(async valid => {
        if (valid) {
          this.modalForm_loading = true;
          const params = this.modalForm;
          try {
            let result;
            if (this.modalFormTitle === "添加设备") {
              result = await addDevice(params);
            } else {
              result = await editDevice(params);
            }
            if (result.success) {
              this.$Message.success("提交成功!");
              this.$emit("listenModalForm");
              this.$emit("refreshTableList");
            } else {
              this.$Message.error(result.msg);
            }
          } catch (err) {
            console.log(err);
            this.$Message.error("服务器异常，稍后再试");
          }
          this.modalForm_loading = false;
        } else {
          this.$Message.error("表单验证失败!");
        }
      });
    }
  }
};
</script>
