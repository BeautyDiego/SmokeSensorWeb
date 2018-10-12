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
            <Form ref="modalForm" :model="modalForm" :label-width="80"
                  value=true style="padding: 3px 60px">
                <Form-item label="省份" prop="Province"
                           :rules="{required: true, message: '必填,1-25位字符',min:1,max:50, trigger:'blur',type:'string'}">
                    <Input v-model="modalForm.Province"></Input>
                </Form-item>
                <Form-item label="市" prop="City"
                           :rules="{required: true, message: '必填,1-25位字符',min:1,max:50, trigger:'blur',type:'string'}">
                    <Input v-model="modalForm.City"></Input>
                </Form-item>
                <Form-item label="区" prop="AreaName"
                           :rules="{required: true, message: '必填,1-50位字符',min:1,max:100, trigger:'blur',type:'string'}">
                    <Input v-model="modalForm.AreaName"></Input>
                </Form-item>
            </Form>
            <div slot="footer">
                <Button type="ghost" @click="cancel">关闭</Button>
                <Button type="primary" :loading="modalForm_loading"
                        @click="saveForm('modalForm')">保存
                </Button>
            </div>
        </Modal>
    </div>

</template>

<script>
    import {addAreas, editAreas} from './../../../api/getData'

    export default {
        props: {
            parentForm: {
                type: Object,
                default: function () {
                    return {
                        Id: '',
                        Province: '',
                        City: '',
                        AreaName: '',
                    }
                }
            },
            modalShow: {
                type: Boolean,
                default: true,
            },
            modalFormTitle: {
                type: String,
                default: '添加区域',
            },
        },
        data() {
            return {
                IsModalShow: false,
                modalForm: {},
                modalForm_loading: false
            }
        },
        watch: {
            modalShow(curVal, oldVal) {
                this.modalForm = Object.assign(this.parentForm);
                this.IsModalShow = curVal;
                if (this.modalFormTitle == '添加区域') {
                    this.modalForm.Province = '广东省'
                    this.modalForm.City = '珠海市'
                }
            }
        },
        created() {
        },
        mounted() {

        },
        methods: {
            cancel() {
                this.$emit('listenModalForm');
            },
            saveForm(name) {
                this.$refs[name].validate(async (valid) => {
                    if (valid) {
                        this.modalForm_loading = true;
                        const params = this.modalForm;
                        try {
                            let result;
                            if (this.modalFormTitle === '添加区域') {
                                result = await addAreas(params);
                            } else {
                                result = await editAreas(params);
                            }
                            if (result.success) {
                                this.$Message.success('提交成功!');
                                this.$emit('listenModalForm');
                                this.$emit('refreshTableList');
                            } else {
                                this.$Message.error(result.msg);
                            }
                        } catch (err) {
                            console.log(err);
                            this.$Message.error('服务器异常，稍后再试');
                        }
                        this.modalForm_loading = false;
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
        }
    }

</script>
