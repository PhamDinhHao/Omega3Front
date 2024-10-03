import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import ModelNewSupplier from "./ModelNewSupplier";
import ModelUpdateSupplier from "./ModelUpdateSupplier";
import Select from "react-select";
import { Table } from "antd";
import CustomScrollbars from "../../../components/CustomScrollbars";
import "./SupplierManage.scss";

class SupplierManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierRedux: [],
      isOpenNewSupplier: false,
      isOpenModalEditSupplier: false,
      supplierEdit: {},
      selectedSupplier: null,
      listSupplier: [],
      columns: [
        {
          title: "Tên",
          dataIndex: "name",
        },
        {
          title: "Số điện thoại",
          dataIndex: "phoneNumber",
        },
        {
          title: "Địa chỉ",
          dataIndex: "address",
        },
        {
          title: "Số nợ",
          dataIndex: "debtSupplier",
        },
        {
          title: "Hoạt động",
          dataIndex: "",
          render: (text, record) => (
            <div>
              <button
                className="btn-edit"
                onClick={() => this.handleUpdateSupplier(record)}
              >
                <i className="fas fa-pencil-alt"></i>
              </button>
              <button
                className="btn-delete"
                onClick={() => this.handleDeleteSupplier(record)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ),
        },
      ],
    };
  }

  componentDidMount() {
    this.props.fetchSupplierRedux();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listSuppliers !== this.props.listSuppliers) {
      this.setState({
        supplierRedux: this.props.listSuppliers,
        listSupplier: this.buildDataInputSelect(this.props.listSuppliers),
      });
    }
  }

  toggleSupplierModal = () => {
    this.setState({
      isOpenNewSupplier: !this.state.isOpenNewSupplier,
    });
  };

  toggleSupplierEditModal = () => {
    this.setState({
      isOpenModalEditSupplier: !this.state.isOpenModalEditSupplier,
    });
  };

  handleAddNewSupplier = () => {
    this.setState({
      isOpenNewSupplier: true,
    });
  };

  createNewSupplier = async (data) => {
    try {
      let response = await this.props.createNewSupplierRedux(data);
      if (response && response.errCode !== 0) {
        alert(response.errMessage);
      } else {
        this.setState({
          isOpenNewSupplier: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleDeleteSupplier = (supplier) => {
    this.props.deleteSupplierRedux(supplier.id);
  };

  handleUpdateSupplier = (supplier) => {
    this.setState({
      isOpenModalEditSupplier: true,
      supplierEdit: supplier,
    });
  };

  doEditSupplier = async (supplier) => {
    try {
      let response = await this.props.editSupplierRedux(supplier);
      if (response && response.errCode !== 0) {
        alert(response.errCode);
      } else {
        this.setState({
          isOpenModalEditSupplier: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleChangeSelect = async (selectedSupplier) => {
    this.setState({ selectedSupplier: selectedSupplier });
    if (selectedSupplier) {
      const filteredSuppliers = this.props.listSuppliers.filter(
        (supplier) => supplier.id === selectedSupplier.value
      );
      this.setState({ supplierRedux: filteredSuppliers });
    } else {
      this.setState({ supplierRedux: this.props.listSuppliers });
    }
  };

  buildDataInputSelect = (inputData) => {
    let result = [];
    if (inputData && inputData.length > 0) {
      inputData.map((item) => {
        let object = {};
        object.label = item.name;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };

  render() {
    return (
      <div className="supplier-manage">
        <div className="supplier-content">
          <div className="main-left">
            <div className="heading-page">
              <span className="ng-binding">Nhà cung cấp</span>
            </div>
            <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
              {/* Additional filters can be added here */}
            </CustomScrollbars>
          </div>
          <div className="main-right">
            <div className="mainWrap">
              <div className="header-filter">
                <div className="header-filter-search">
                  <Select
                    classNamePrefix="select"
                    placeholder={"Search"}
                    isClearable
                    value={this.state.selectedSupplier}
                    onChange={this.handleChangeSelect}
                    options={this.state.listSupplier}
                  />
                </div>
                <div className="header-filter-buttons">
                  <button
                    className="btn btn-success"
                    onClick={() => this.handleAddNewSupplier()}
                  >
                    <i className="fas fa-plus"></i>
                    <span>Thêm Mới</span>
                  </button>
                </div>
              </div>
              <div className="supplier-list">
                <ModelNewSupplier
                  isOpen={this.state.isOpenNewSupplier}
                  toggleFromParent={this.toggleSupplierModal}
                  createNewSupplier={this.createNewSupplier}
                />
                {this.state.isOpenModalEditSupplier && (
                  <ModelUpdateSupplier
                    isOpen={this.state.isOpenModalEditSupplier}
                    toggleFromParent={this.toggleSupplierEditModal}
                    currentSupplier={this.state.supplierEdit}
                    editSupplier={this.doEditSupplier}
                  />
                )}
                <div className="suppliers-table mt-4">
                  <Table
                    pagination={{ pageSize: 10 }}
                    scroll={{ y: 700 }}
                    columns={this.state.columns}
                    dataSource={this.state.supplierRedux}
                    rowClassName="supplier-row"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listSuppliers: state.supplier.suppliers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSupplierRedux: () => dispatch(actions.fetchAllSuppliersStart()),
    createNewSupplierRedux: (data) => dispatch(actions.createNewSupplier(data)),
    deleteSupplierRedux: (id) => dispatch(actions.deleteSupplier(id)),
    editSupplierRedux: (data) => dispatch(actions.editSupplier(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SupplierManage);
