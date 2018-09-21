<style>
.mobile-user {
  padding: 10px;
  min-height: 600px;
}
</style>

<template>

  <div class="mobile-user">
    <div style="background-color:#B0E0E6;padding:10px 0 0;border-radius:4px;position:relative;">
      <Row>
        <Col span="24">
        <Poptip width="400" title='搜索' placement="bottom-end" class="top-btn">
          <Button type="primary" size="large" icon="ios-search">搜 索</Button>
          <div style="text-align:center" slot="content">
            <Form ref="searchForm" :model="searchForm" :label-width="80" value=true style="min-width:200px;padding-top:20px;border-top:1px solid #a3adba;border-bottom:1px solid #a3adba;">
              <Row>
                <Form-item label="用户名">
                  <Input v-model="searchForm.UserName"></Input>
                </Form-item>
              </Row>
              <Row>
                <Form-item label="手机号">
                  <Input v-model="searchForm.Mobile"></Input>
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
      <Table stripe size="small" :loading="tableLoading" :columns="tableColums" :data="tableData"></Table>
    </Row>
    <Row>
      <Page :total="total" :current="currentPage" @on-change="changeCurrentPage" show-total style="float:right;margin-top:10px"></Page>
    </Row>
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
  </div>

</template>

<script>
import { getMobileCusPagedList } from "../../../api/getData";
import { clearObj } from "../../../libs/util";
import formatter from "./../../../libs/formatter";
export default {
  name: "mobile-user",
  data() {
    return {
      tableLoading: false,
      tableColums: [
        {
          type: "index",
          width: 60,
          title: "序号",
          align: "center"
        },
        {
          align: "center",
          title: "用户名",
          key: "UserName"
        },
        {
          align: "center",
          title: "手机号",
          key: "Mobile"
        },
        {
          align: "center",
          title: "地址",
          key: "ADDR"
        }
      ],
      tableData: [],
      total: 0,
      currentPage: 1,
      delModal: false,
      delId: "", //删除的Id
      btnLoading: false,
      searchForm: {
        UserName: "",
        Mobile: "",
        rows: 10,
        page: 1
      }
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.getTableList();
  },
  methods: {
    resetSearch() {
      this.searchForm.UserName = "";
      this.searchForm.Mobile = "";
    },
    doSearchTableList() {
      this.currentPage = 1;
      this.getTableList();
    },
    async getTableList() {
      this.tableLoading = true;
      this.searchForm.page = this.currentPage;
      const params = this.searchForm;
      const res = await getMobileCusPagedList(params);
      this.total = res.total;
      this.tableData = res.rows;
      this.tableLoading = false;
    },
    changeCurrentPage(num) {
      this.currentPage = num;
      this.getTableList();
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
    }
  }
};
</script>
