<style>

    .userManagement {
        padding: 10px;
        min-height: 600px;
    }

</style>

<template>

    <div class="userManagement">
        <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
            <Row>
                <Col span="24">
                <Button class="top-right-btn" size="large" icon="plus"
                        @click="addItem">添加
                </Button>
                <Poptip width="400" title='搜索' placement="bottom-end"
                        class="top-btn">
                    <Button type="primary" size="large" icon="ios-search">搜 索
                    </Button>
                    <div style="text-align:center" slot="content">
                        <Form ref="searchForm" :model="searchForm"
                              :label-width="80" value=true
                              style="min-width:200px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
                            <Row>
                                <Form-item label="用户名称">
                                    <Input v-model="searchForm.uName"></Input>
                                </Form-item>
                            </Row>
                            <Row>
                                <Form-item label="用户角色">
                                    <Select v-model="searchForm.uType"
                                            :transfer="true">
                                        <Option :value="0">全部</Option>
                                        <Option :value="1">管理员</Option>
                                        <Option :value="2">代理商</Option>
                                        <Option :value="3">普通客户</Option>
                                    </Select>
                                </Form-item>
                            </Row>
                        </Form>
                        <Row>
                            <Button style="margin-left:5px;margin-top:10px;float:right;background-color: #5bc0de;color:#fff"
                                    size="small" @click="doSearchTableList">确定
                            </Button>
                            <Button style="float:right;margin-top:10px;"
                                    size="small" @click="resetSearch">重置
                            </Button>
                        </Row>
                    </div>
                </Poptip>
                </Col>
            </Row>
        </div>
        <!--table-->
        <Row>
            <Table stripe size="small" :columns="tableColums"
                   :data="tableData"></Table>
        </Row>
        <Row>
            <Page :total="total" :current="currentPage"
                  @on-change="changeCurrentPage" show-total
                  style="float:right;margin-top:10px"></Page>
        </Row>
        <!--新增编辑-->
        <areasForm :modalShow="formShow"
                   :modalFormTitle="formTitle"
                   :parentForm="parentForm"
                   @listenModalForm="hideModel"
                   @refreshTableList="getTableList"></areasForm>
        <!--是否删除框-->
        <Modal v-model="delModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="information-circled"></Icon>
                <span>删除确认</span>
            </p>
            <div style="text-align:center">
                <p>是否继续删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="btnLoading"
                        @click="comfirmDel">删除
                </Button>
            </div>
        </Modal>
    </div>

</template>

<script>
    import Cookies from 'js-cookie'
    import {
        getAreasPagedList,
        delAreas
    } from '@/api/getData'
    import {clearObj} from '@/libs/util';
    import areasForm from './areasForm.vue'

    export default {
        name: 'userManagement',
        components: {
            areasForm,
        },
        data() {
            return {
                tableColums: [
                    {
                        type: 'index',
                        width: 60,
                        title: '序号',
                        align: 'center'
                    },
                    {
                        align: 'center',
                        title: '省份',
                        key: 'Province',
                    },
                    {
                        align: 'center',
                        title: '市区',
                        key: 'City',
                    },
                    {
                        align: 'center',
                        title: '地区',
                        key: 'AreaName',
                    },
                    {
                        title: '操作',
                        align: 'center',
                        render: (h, params) => {
                            let actions = [];
                            actions.push(h('Button', {
                                props: {
                                    type: 'warning',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.editItem(params.row)
                                    }
                                }
                            }, '修改'));
                            actions.push(h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.delItem(params.row.Id)
                                    }
                                }
                            }, '删除'));

                            return h('div', actions);
                        }
                    }
                ],
                tableData: [],
                total: 0,
                currentPage: 1,
                formShow: false,
                formTitle: '添加区域',
                resetForm: {
                    Id: '',
                    UserName: '',
                    LoginName: '',
                    Password: '',
                    Mobile: '',
                    Sex: '',
                    DepartMentId: '',
                    Rbac_RoleId: 1,
                },
                parentForm: {
                    Id: '',
                    Province: '',
                    City: '',
                    AreaName: '',

                },
                delModal: false,
                delId: '', //删除的Id
                btnLoading: false,
                searchForm: {
                    uName: '',
                    rows: 10,
                    page: 1,
                    uType: 0,
                },
            }
        },
        computed: {
            UserId: function () {
                return Cookies.get('userId');
            },
        },
        created() {

        },
        mounted() {
            this.getTableList();
        },
        methods: {
            resetSearch() {
                this.searchForm.uName = '';
                this.searchForm.uType = 0;
            },
            doSearchTableList() {
                this.currentPage = 1;
                this.getTableList();
            },
            async getTableList() {
                this.searchForm.page = this.currentPage;
                const params = this.searchForm;
                const res = await getAreasPagedList(params);
                this.total = res.total;
                this.tableData = res.rows;
            },
            changeCurrentPage(num) {
                this.currentPage = num;
                this.getTableList();
            },
            addItem() {
                clearObj(this.parentForm);
                // this.parentForm=JSON.parse(JSON.stringify(this.resetForm));
                this.formTitle = '添加区域';
                this.formShow = true;
            },
            editItem(row) {
                this.parentForm = JSON.parse(JSON.stringify(row));
                this.formTitle = '修改区域';
                this.formShow = true;
            },
            delItem(Id) {
                this.delId = Id;
                this.delModal = true;
            },
            async comfirmDel() {
                this.btnLoading = true;
                try {
                    const res = await delAreas({Id: this.delId});
                    if (res.success) {
                        this.$Message.success('删除成功!');
                        this.getTableList();
                        this.delModal = false;
                    } else {
                        this.$Message.error(res.msg);
                    }
                } catch (err) {
                    console.log(err);
                    this.$Message.error('服务器异常，稍后再试');
                }
                this.btnLoading = false;
            },
            hideModel() {
                this.formShow = false;
            },
        }
    }

</script>
