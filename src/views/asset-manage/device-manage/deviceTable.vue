<style>
.device {
  padding: 10px;
  min-height: 600px;
}
</style>

<template>

  <div class="device">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>
        <Col span="24">
        <Button @click="toExcel" type="ghost" style="background-color:#fff" class="top-btn" size="large" icon="archive">导出
        </Button>
        <Button @click="importDevice" type="warning" class="top-btn" size="large" icon="ios-cloud-upload-outline">导入SIM卡
        </Button>
        <Button @click="distributeDevice" type="error" class="top-btn" size="large" icon="stats-bars">分配设备</Button>
        <Button class="top-right-btn" size="large" icon="plus" @click="addItem">添加</Button>
        <Poptip width="400" title='搜索' placement="bottom-end" class="top-btn">
          <Button type="primary" size="large" icon="ios-search">搜 索</Button>
          <div style="text-align:center" slot="content">
            <Form ref="searchForm" :model="searchForm" :label-width="80" value=true style="min-width:200px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
              <Row>
                <Form-item label="设备名称">
                  <Input v-model="searchForm.DevName"></Input>
                </Form-item>
              </Row>
              <Row>
                <Form-item label="设备型号">
                  <Input v-model="searchForm.DevModel"></Input>
                </Form-item>
              </Row>
              <Row>
                <Form-item label="IMEI">
                  <Input v-model="searchForm.IMEI"></Input>
                </Form-item>
              </Row>
              <Row>
                <Form-item label="ICCID">
                  <Input v-model="searchForm.ICCID"></Input>
                </Form-item>
              </Row>
            </Form>
            <Row>
              <Button style="margin-left:5px;margin-top:10px;float:right;background-color: #5bc0de;color:#fff" size="small" @click="doSearchTableList">确定</Button>
              <Button style="float:right;margin-top:10px;" size="small" @click="resetSearch">重置</Button>
            </Row>
          </div>
        </Poptip>
        </Col>
      </Row>
    </div>
    <!--table-->
    <Row>
      <Table stripe size="small" :loading="tableLoading" :columns="tableColums" :data="tableData" @on-selection-change="onTableSelectChange"></Table>
    </Row>
    <Row>
      <Page :total="total" :current="currentPage" @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
    </Row>
    <!--新增编辑-->
    <deviceForm :modalShow="formShow" :modalFormTitle="formTitle" :parentForm="parentForm" @listenModalForm="hideModel" @refreshTableList="getTableList"></deviceForm>
    <!--导入-->
    <deviceImport :modalShow="importFormShow" @listenModalForm="hideImportModel" @refreshTableList="getTableList"></deviceImport>
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
        <Button type="error" size="large" long :loading="btnLoading" @click="comfirmDel">删除</Button>
      </div>
    </Modal>
    <Modal v-model="distributeModal" title="分配设备" @on-ok="confirmDistribute" @on-cancel="cancel">
      <Select v-model="distriAgentId" style="width:300px" placeholder="请选择分配代理商">
        <Option v-for="(item,index) in agentList" :value="item.Id" :key="index">{{ item.UserName }}</Option>
      </Select>
    </Modal>
        <Modal title="安装照片" v-model="visible">
      <img :src="devImage" v-if="visible" style="width: 100%">
            <div slot="footer">
      </div>
    </Modal>
  </div>

</template>

<script>
import {
  getDevicePagedList,
  delDevice,
  getAgentList,
  distributeDeviceToAgent,
  getDeviceListExcel
} from "../../../api/getData";
import { clearObj } from "../../../libs/util";
import deviceForm from "./deviceForm.vue";
import deviceImport from "./deviceImport.vue";
import {baseUrl} from './../../../api/env'
export default {
  name: "Res_Operator",
  components: {
    deviceForm,
    deviceImport
  },
  data() {
    return {
      tableLoading: false,
      tableColums: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          type: "index",
          minWidth: 50,
          title: "序号",
          align: "center"
        },
        {
          align: "center",
          minWidth: 150,
          title: "设备名称",
          key: "DevName"
        },
        {
          align: "center",
          minWidth: 120,
          title: "设备型号",
          key: "DevModel"
        },
        {
          align: "center",
          minWidth: 120,
          title: "IMEI",
          key: "IMEI"
        },
        {
          align: "center",
          minWidth: 160,
          title: "ICCID",
          key: "ICCID"
        },
        {
          align: "center",
          minWidth: 160,
          title: "安装时间",
          key: "InstallDate"
        },
        {
          align: "center",
          minWidth: 160,
          title: "安装地址",
          key: "InstallADDR"
        },
        {
          align: "center",
          minWidth: 160,
          title: "片区管理者",
          key: "AgentName"
        },
        {
          align: "center",
          minWidth: 100,
          title: "所属客户",
          key: "UserName"
        },
        {
          align: "center",
          minWidth: 120,
          title: "客户手机",
          key: "Mobile"
        },
        {
            align:'center',
            title: '安装图',
            minWidth: 80,
            key: 'Pic1',
            render: (h, params) => {
              let imgSrc=params.row.Pic1;
              if(imgSrc)
              imgSrc = baseUrl+imgSrc;
              return h('img',{
                attrs: {
                  src: imgSrc
                },
                on: {
                click: () => {
                  this.handleView(imgSrc)
                }
              },
                style:{
                  width:'60px',
                  height:'60px'
                }
              });
            }
          },
        {
          title: "操作",
          minWidth: 140,
          align: "center",
          render: (h, params) => {
            let actions = [];
            actions.push(
              h(
                "Button",
                {
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.editItem(params.row);
                    }
                  }
                },
                "修改"
              )
            );

            actions.push(
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.delItem(params.row.Id);
                    }
                  }
                },
                "删除"
              )
            );

            return h("div", actions);
          }
        }
      ],
      tableData: [],
      total: 0,
      currentPage: 1,
      formShow: false,
      formTitle: "添加设备",
      parentForm: {
        Id: "",
        Web_UsersId: "",
        Web_AgentId: "",
        Admin_GroupId: "",
        Agent_GroupId: "",
        Customer_GroupId: "",
        DevId: "",
        DevName: "",
        DevModel: "",
        FriendName: "",
        IMEI: "",
        ICCID: "",
        InstallDate: "",
        InstallADDR: "",
        Remark: ""
      },
      delModal: false,
      delId: "", //删除的Id
      btnLoading: false,
      searchForm: {
        DevName: "",
        DevModel: "",
        IMEI: "",
        ICCID: "",
        rows: 10,
        page: 1
      },
      selectedRows: [],
      distributeModal: false,
      distriAgentId: "",
      importFormShow: false,
      visible: false,
      devImage:""
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getAgentComboList();
    this.getTableList();
  },
  methods: {
    resetSearch() {
      this.searchForm.DevName = "";
      this.searchForm.DevModel = "";
      this.searchForm.IMEI = "";
      this.searchForm.ICCID = "";
    },
    doSearchTableList() {
      this.currentPage = 1;
      this.getTableList();
    },
    async getTableList() {
      this.tableLoading = true;
      this.searchForm.page = this.currentPage;
      const params = this.searchForm;
      const res = await getDevicePagedList(params);
      this.total = res.total;
      this.tableData = res.rows;
      this.tableLoading = false;
    },
    changeCurrentPage(num) {
      this.currentPage = num;
      this.getTableList();
    },
    async getAgentComboList() {
      this.agentList = await getAgentList();
    },
    addItem() {
      clearObj(this.parentForm);
      this.formTitle = "添加设备";
      this.formShow = true;
    },
    editItem(row) {
      this.parentForm = JSON.parse(JSON.stringify(row));
      this.formTitle = "修改设备";
      this.formShow = true;
    },
    delItem(Id) {
      this.delId = Id;
      this.delModal = true;
    },
    async comfirmDel() {
      this.btnLoading = true;
      try {
        const res = await delResOperator({ Id: this.delId });
        if (res.success) {
          this.$Message.success("删除成功!");
          this.getTableList();
          this.delModal = false;
        } else {
          this.$Message.error(res.msg);
        }
      } catch (err) {
        console.log(err);
        this.$Message.error("服务器异常，稍后再试");
      }
      this.btnLoading = false;
    },
    hideModel() {
      this.formShow = false;
    },
    onTableSelectChange(selection) {
      this.selectedRows = selection;
    },
    distributeDevice() {
      if (this.selectedRows.length == 0) {
        this.$Message.error("请选择至少一个设备。");
      } else {
        this.distributeModal = true;
      }
    },
    async confirmDistribute() {
      const devices = this.selectedRows.map(function(value, index, array) {
        return value.Id;
      });
      // console.log(devices.join(','));
      console.log(this.distriAgentId);
      const res = await distributeDeviceToAgent({
        devices: devices,
        distriAgentId: this.distriAgentId
      });
      if (res.success) {
        this.$Notice.success({
          title: "分配成功",
          duration: 8,
          desc: res.msg
        });
        this.getTableList();
      } else {
        this.$Notice.error({
          title: "失败",
          duration: 8,
          desc: res.msg
        });
      }
    },
    importDevice() {
      this.importFormShow = true;
    },
                async toExcel() {
                const params = this.searchForm;
                const res = await getDeviceListExcel(params);
                if (res.success) {
                    const url = baseUrl + "/excel/" + res.filename;
                    window.open(url);
                } else {

                }
            },
                 handleView (img) {
                   this.devImage=img;
                  this.visible = true
                }
  }
};
</script>
