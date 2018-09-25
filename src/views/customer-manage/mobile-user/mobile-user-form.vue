<style scoped>
</style>

<template>

  <div>

    <Modal v-model="IsModalShow" :title="modalFormTitle" :mask-closable="false" @on-cancel="cancel" width="600">
      <Form ref="modalForm" :model="modalForm" :label-width="100" value=true style="padding: 3px 60px">
        <Form-item label="用户名" prop="UserName" :rules="{required: true, message: '必填,1-50位字符',min:1,max:50,  trigger:'blur',type:'string'}">
          <Input v-model="modalForm.UserName" maxlength=50></Input>
        </Form-item>
        <Form-item label="手机号" prop="Mobile" :rules="{required: true, message: '输入11位手机号', trigger:'blur',type:'string',pattern: /^1\d{10}$/}">
          <Input v-model="modalForm.Mobile" maxlength=20></Input>
        </Form-item>
        <Form-item label="商铺名称" prop="ShopName">
          <Input v-model="modalForm.ShopName" maxlength=20></Input>
        </Form-item>
        <Form-item label="地址">
          <Input v-model="modalForm.ADDR" type="textarea" :rows="2" maxlength=30></Input>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button type="ghost" @click="cancel">关闭</Button>
        <Button type="primary" :loading="modalForm_loading" @click="saveForm('modalForm')">保存</Button>
      </div>
    </Modal>
  </div>

</template>

<script>
import { editMobileCus } from "../../../api/getData";
export default {
  props: {
    parentForm: {
      type: Object,
      default: function() {
        return {
          Id: "",
          UserName: "",
          Mobile: "",
          ShopName: "",
          ADDR: ""
        };
      }
    },
    modalShow: {
      type: Boolean,
      default: true
    },
    modalFormTitle: {
      type: String,
      default: "修改微信用户"
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
  created() {},
  mounted() {},
  methods: {
    cancel() {
      this.$emit("listenModalForm");
    },
    saveForm(name) {
      this.$refs[name].validate(async valid => {
        debugger;
        if (valid) {
          this.modalForm_loading = true;
          const params = this.modalForm;
          try {
            let result;
            if (this.modalFormTitle === "修改微信用户") {
              debugger;
              result = await editMobileCus(params);
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
