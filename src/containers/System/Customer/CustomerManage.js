import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import ModelNewCustomer from "./ModelNewCustomer";
import ModelUpdateCustomer from "./ModelUpdateCustomer";
import Select from "react-select";
import { Table } from "antd";
import CustomScrollbars from "../../../components/CustomScrollbars";
import "./CustomerManage.scss";

class CustomerManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerRedux: [],
      isOpenNewCustomer: false,
      isOpenModalEditCustomer: false,
      customerEdit: {},
      selectedCustomer: null,
      listCustomer: [],
      selectedItemCheckbox: [],
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
          title: "Giới tính",
          dataIndex: "gender",
        },
        {
          title: "Hoạt động",
          dataIndex: "",
          render: (text, record) => (
            <div>
              <button
                className="btn-edit"
                onClick={() => this.handleUpdateCustomer(record)}
              >
                <i className="fas fa-pencil-alt"></i>
              </button>
              <button
                className="btn-delete"
                onClick={() => this.handleDeleteCustomer(record)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ),
        },
      ],
    };
  }

  toggleCustomerModal = () => {
    this.setState({
      isOpenNewCustomer: !this.state.isOpenNewCustomer,
    });
  };

  async componentDidMount() {
    this.props.fetchCustomerRedux();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listcustomers !== this.props.listcustomers) {
      this.setState({
        customerRedux: this.props.listcustomers,
        listCustomer: this.buildDataInputSelect(this.props.listcustomers),
      });
    }
  }

  handleChangeSelect = (selectedCustomer) => {
    this.setState({ selectedCustomer: selectedCustomer });
    if (selectedCustomer === null) {
      this.setState({ customerRedux: this.props.listcustomers });
    } else {
      this.filterCustomersBySelection(selectedCustomer);
    }
  };

  filterCustomersBySelection = (selectedCustomer) => {
    let filteredCustomers = this.props.listcustomers;
    if (selectedCustomer) {
      filteredCustomers = this.props.listcustomers.filter(
        (customer) => customer.id === selectedCustomer.value
      );
    }
    this.setState({ customerRedux: filteredCustomers });
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

  handleAddNewCustomer = () => {
    this.setState({
      isOpenNewCustomer: true,
    });
  };

  createNewCustomer = async (data) => {
    try {
      let response = await this.props.createNewCustomerRedux(data);
      if (response && response.errCode !== 0) {
        alert(response.errMessage);
      } else {
        this.setState({
          isOpenNewCustomer: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleDeleteCustomer = (customer) => {
    this.props.deleteCustomerRedux(customer.id);
  };

  handleUpdateCustomer = (customer) => {
    this.setState({
      isOpenModalEditCustomer: true,
      customerEdit: customer,
    });
  };

  toggleCustomerEditModal = () => {
    this.setState({
      isOpenModalEditCustomer: !this.state.isOpenModalEditCustomer,
    });
  };

  doEditCustomer = async (customer) => {
    try {
      let response = await this.props.editCustomerRedux(customer);
      if (response && response.errCode !== 0) {
        alert(response.errCode);
      } else {
        this.setState({
          isOpenModalEditCustomer: false,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  handleGenderFilterChange = (gender) => {
    let filteredCustomers = [];
    if (gender !== null) {
      filteredCustomers = this.props.listcustomers.filter(
        (customer) => customer.gender === gender
      );
    } else {
      filteredCustomers = this.props.listcustomers;
    }
    this.setState({
      customerRedux: filteredCustomers,
    });
  };

  render() {
    return (
      <div className="customer-manage">
        <div className="customer-content">
          <div className="main-left">
            <div className="heading-page">
              <span className="ng-binding">Khách hàng</span>
            </div>
            <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
              <div className="checkbox-fillList">
                <label style={{ fontWeight: "600" }}>Lọc theo giới tính</label>
                <div>
                  <input
                    type="checkbox"
                    onChange={() => this.handleGenderFilterChange("Nam")}
                  />{" "}
                  Nam
                </div>
                <div>
                  <input
                    type="checkbox"
                    onChange={() => this.handleGenderFilterChange("Nữ")}
                  />{" "}
                  Nữ
                </div>
              </div>
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
                    value={this.state.selectedCustomer}
                    onChange={this.handleChangeSelect}
                    options={this.state.listCustomer}
                  />
                </div>
                <div className="header-filter-buttons">
                  <button
                    className="btn btn-success"
                    onClick={() => this.handleAddNewCustomer()}
                  >
                    <i className="fas fa-plus"></i>
                    <span>Thêm Mới</span>
                  </button>
                </div>
              </div>
              <div className="customer-list">
                <ModelNewCustomer
                  isOpen={this.state.isOpenNewCustomer}
                  toggleFromParent={this.toggleCustomerModal}
                  createNewCustomer={this.createNewCustomer}
                />
                {this.state.isOpenModalEditCustomer && (
                  <ModelUpdateCustomer
                    isOpen={this.state.isOpenModalEditCustomer}
                    toggleFromParent={this.toggleCustomerEditModal}
                    currentCustomer={this.state.customerEdit}
                    editCustomer={this.doEditCustomer}
                  />
                )}
                <div className="suppliers-table mt-4">
                  <Table
                    pagination={{ pageSize: 10 }}
                    scroll={{ y: 700 }}
                    columns={this.state.columns}
                    dataSource={this.state.customerRedux}
                    rowClassName="customer-row"
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
    listcustomers: state.customer.customers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCustomerRedux: () => dispatch(actions.fetchAllCustomersStart()),
    createNewCustomerRedux: (data) => dispatch(actions.createNewCustomer(data)),
    deleteCustomerRedux: (id) => dispatch(actions.deleteCustomer(id)),
    editCustomerRedux: (data) => dispatch(actions.editCustomer(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CustomerManage);
