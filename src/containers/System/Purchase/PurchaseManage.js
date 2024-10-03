import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import * as actions from "../../../store/actions";
import { connect } from "react-redux";
import Select from "react-select";
import "../../System/Product/ProductManage.scss";
import { Divider, Radio, Table } from "antd";
import { emitter } from "../../../utils/emitter";
import Checkbox from "antd/es/checkbox/Checkbox";
import CustomScrollbars from "../../../components/CustomScrollbars";
import Lightbox from "react-image-lightbox";
import { withRouter } from "react-router-dom";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  BarChart,
} from "recharts";

class PurchaseManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      purchaseRedux: [],
      arrCategorys: [],
      selectedItemCheckbox: [],
      listPurchase: [],
      selectedPurchase: null,
      selectedDateFilter: null,
      columns: [
        {
          title: "Mã đơn hàng",
          dataIndex: "id",
        },
        {
          title: "Thời gian",
          dataIndex: "purchaseDate",
          render: (text) => <span>{this.formatDate(text)}</span>,
        },
        {
          title: "Nhà cung cấp",
          dataIndex: ["Supplier", "name"],
        },
        {
          title: "Tổng Tiền",
          dataIndex: "total",
          render: (text) => this.formatNumberWithCommas(text),
        },
        {
          title: "Hoạt động",
          dataIndex: "",
          render: (text, record) => (
            <div>
              <button
                className="btn-edit"
                onClick={() => this.handleUpdateProduct(record)}
              >
                <i className="fas fa-pencil-alt"></i>
              </button>
              <button
                className="btn-delete"
                onClick={() => this.handleDeleteProduct(record)}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ),
        },
      ],
      isOpen: false,
      previewImgUrl: "",
    };
  }

  componentDidMount() {
    this.props.fetchPurchaseRedux();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.purchases !== this.props.purchases) {
      let dataSelect = this.buildDataInputSelect(this.props.purchases);
      this.setState({
        purchaseRedux: this.props.purchases,
        listPurchase: dataSelect,
      });
    }
  }

  handleAddNewPurchase = () => {
    this.props.history.push("/system/purchase-new");
  };

  handleUpdateProduct = async (record) => {
    await this.props.history.push({
      pathname: "/system/purchase-update",
      state: { record },
    });
  };

  handleChangeSelect = (selectedPurchase) => {
    this.setState({ selectedPurchase });
  };

  buildDataInputSelect = (inputData) => {
    let result = [];

    if (inputData && inputData.length > 0) {
      inputData.forEach((item) => {
        let object = {
          label: item.id,
          value: item.id,
        };
        result.push(object);
      });
    }
    return result;
  };

  filterProducts = (purchases, selectedOption) => {
    if (selectedOption === null) return purchases;
    return purchases.filter((purchase) => purchase.id === selectedOption.value);
  };

  formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  handleSearchByDate = (value) => {
    const { purchases } = this.props;
    let filteredData = [];

    const currentDate = new Date();

    switch (value) {
      case "thisMonth":
        filteredData = purchases.filter((item) => {
          const purchaseDate = new Date(item.purchaseDate);
          return (
            purchaseDate.getMonth() === currentDate.getMonth() &&
            purchaseDate.getFullYear() === currentDate.getFullYear()
          );
        });
        break;

      case "yesterday":
        const yesterday = new Date();
        yesterday.setDate(currentDate.getDate() - 1);
        filteredData = purchases.filter((item) => {
          const purchaseDate = new Date(item.purchaseDate);
          return purchaseDate.toDateString() === yesterday.toDateString();
        });
        break;

      default:
        filteredData = purchases;
        break;
    }
    // console.log("Filtered Data: ", filteredData);
    this.setState({ purchaseRedux: filteredData, selectedDateFilter: value });
  };

  searchByRadioGroupOrInputSearch = () => {
    let tempList = [];

    if (this.state.selectedItemCheckbox.length > 0) {
      tempList = this.state.selectedItemCheckbox;
    } else {
      tempList = this.filterProducts(
        this.state.purchaseRedux,
        this.state.selectedPurchase
      );
    }

    return tempList;
  };

  formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    const { selectedPurchase, columns, listPurchase, selectedDateFilter } =
      this.state;
    const filteredPurchases = this.searchByRadioGroupOrInputSearch();

    return (
      <div className="product">
        <div className="product-content">
          <div className="main-left">
            <div className="heading-page">
              <span className="ng-binding">Phiếu Nhập Hàng</span>
            </div>
            <CustomScrollbars style={{ height: "100vh", width: "100%" }}>
              <div className="checkbox-fillList">
                <label style={{ fontWeight: "600" }}>Thời Gian:</label>
                <Radio.Group
                  value={selectedDateFilter}
                  onChange={(e) => this.handleSearchByDate(e.target.value)}
                >
                  <div className="radio-box">
                    <Radio value="thisMonth">Tháng này</Radio>
                  </div>
                  <div className="radio-box">
                    <Radio value="yesterday">Hôm qua</Radio>
                  </div>
                </Radio.Group>
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
                    value={selectedPurchase}
                    onChange={this.handleChangeSelect}
                    options={listPurchase}
                  />
                </div>
                <div className="header-filter-buttons">
                  <button
                    className="btn btn-success"
                    onClick={this.handleAddNewPurchase}
                  >
                    <i className="fas fa-plus"></i>
                    <span>Thêm Mới</span>
                  </button>
                </div>
              </div>
              <div className="product-list">
                <div className="suppliers-table mt-4">
                  <div>
                    <Table
                      pagination={{ pageSize: 10 }}
                      scroll={{ y: 700 }}
                      columns={columns}
                      dataSource={filteredPurchases}
                      rowKey="id"
                      onRow={(record, rowIndex) => {
                        return {
                          onClick: (event) => {
                            console.log("check record", record);
                          },
                        };
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {this.state.isOpen === true && (
          <Lightbox
            mainSrc={this.state.previewImgUrl}
            onCloseRequest={() => this.setState({ isOpen: false })}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    purchases: state.purchase.purchases,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchPurchaseRedux: () => dispatch(actions.fetchAllPurchasesStart()),
    // editPurchaseRedux: (data) => dispatch(actions.editPurchase(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseManage);
