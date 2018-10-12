<style scoped>
</style>

<template>

    <div>

        <Modal v-model="IsModalShow" :title="modalFormTitle" :mask-closable="false" @on-cancel="cancel" width="600">
            <Form ref="modalForm" :model="modalForm" :label-width="80" value=true style="padding: 3px 60px">
                <Form-item label="单位名称" prop="MainName" :rules="{required: true, message: '必填,1-50位字符',min:1,max:100, trigger:'blur',type:'string'}">
                    <Input v-model="modalForm.MainName"></Input>
                </Form-item>
                <Form-item label="责任人" prop="ManagerName" :rules="{required: true, message: '必填,1-50位字符',min:1,max:100, trigger:'blur',type:'string'}">
                    <Input v-model="modalForm.ManagerName"></Input>
                </Form-item>
                <Form-item label="联系电话" prop="ManagerMobile" :rules="{required: true, message: '输入11位手机号', trigger:'blur',type:'string',pattern: /^1\d{10}$/}">
                    <Input v-model="modalForm.ManagerMobile"></Input>
                </Form-item>
                <Form-item label="办公室电话" prop="OfficeMobile">
                    <Input v-model="modalForm.OfficeMobile"></Input>
                </Form-item>
                <Form-item label="单位地址" prop="MainAddr">
                    <Input v-model="modalForm.MainAddr" type="textarea"></Input>
                </Form-item>
                <Form-item label="备注" prop="Remark">
                    <Input v-model="modalForm.Remark" type="textarea"></Input>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="cancel">关闭</Button>
                <Button type="primary" :loading="modalForm_loading" @click="saveForm('modalForm')">保存
                </Button>
            </div>
        </Modal>
    </div>

</template>

<script>
import { addMaintenance, editMaintenance } from "./../../../api/getData";

export default {
  props: {
    parentForm: {
      type: Object,
      default: function() {
        return {
          Id: "",
          MainName: "",
          MainAddr: "",
          ManagerName: "",
          ManagerMobile: "",
          OfficePhone: "",
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
      default: "添加维保单位"
    }
  },
  data() {
    return {
      IsModalShow: false,
      modalForm: {},
      modalForm_loading: false,
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
            if (this.modalFormTitle === "添加维保单位") {
              result = await addMaintenance(params);
            } else {
              result = await editMaintenance(params);
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
