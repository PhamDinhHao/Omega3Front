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

class SaleManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SaleRedux: [],
      arrCategorys: [],
      selectedItemCheckbox: [],
      listSale: [],
      selectedSale: null,
      selectedDateFilter: null,
      columns: [
        {
          title: "Mã đơn hàng",
          dataIndex: "id",
        },
        {
          title: "Thời gian",
          dataIndex: "saleDate",
          render: (text) => <span>{this.formatDate(text)}</span>,
        },
        {
          title: "Khách hàng",
          dataIndex: ["Customer", "name"],
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

  async componentDidMount() {
    await this.props.fetchSaleRedux();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.Sales !== this.props.Sales) {
      let dataSelect = this.buildDataInputSelect(this.props.Sales);
      this.setState({
        SaleRedux: this.props.Sales,
        listSale: dataSelect,
      });
    }
  }

  handleAddNewSale = () => {
    this.props.history.push("/system/sale-new");
  };

  handleUpdateProduct = async (record) => {
    console.log("chcek creoce", record);
    await this.props.history.push({
      pathname: "/system/sale-update",
      state: { record },
    });
  };

  handleChangeSelect = (selectedSale) => {
    this.setState({ selectedSale });
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

  filterProducts = (Sales, selectedOption) => {
    if (selectedOption === null) return Sales;
    return Sales.filter((Sale) => Sale.id === selectedOption.value);
  };

  formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  handleSearchByDate = (value) => {
    const { Sales } = this.props;
    let filteredData = [];

    const currentDate = new Date();

    switch (value) {
      case "thisMonth":
        filteredData = Sales.filter((item) => {
          const SaleDate = new Date(item.saleDate);
          return (
            SaleDate.getMonth() === currentDate.getMonth() &&
            SaleDate.getFullYear() === currentDate.getFullYear()
          );
        });
        break;

      case "yesterday":
        const yesterday = new Date();
        yesterday.setDate(currentDate.getDate() - 1);
        filteredData = Sales.filter((item) => {
          const SaleDate = new Date(item.saleDate);
          return SaleDate.toDateString() === yesterday.toDateString();
        });
        break;

      default:
        filteredData = Sales;
        break;
    }
    // console.log("Filtered Data: ", filteredData);
    this.setState({ SaleRedux: filteredData, selectedDateFilter: value });
  };

  searchByRadioGroupOrInputSearch = () => {
    let tempList = [];

    if (this.state.selectedItemCheckbox.length > 0) {
      tempList = this.state.selectedItemCheckbox;
    } else {
      tempList = this.filterProducts(
        this.state.SaleRedux,
        this.state.selectedSale
      );
    }

    return tempList;
  };

  formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    const { selectedSale, columns, listSale, selectedDateFilter } = this.state;
    const filteredSales = this.searchByRadioGroupOrInputSearch();

    return (
      <div className="product">
        <div className="product-content">
          <div className="main-left">
            <div className="heading-page">
              <span className="ng-binding">Phiếu Bán Hàng</span>
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
                    value={selectedSale}
                    onChange={this.handleChangeSelect}
                    options={listSale}
                  />
                </div>
                <div className="header-filter-buttons">
                  <button
                    className="btn btn-success"
                    onClick={this.handleAddNewSale}
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
                      dataSource={filteredSales}
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
    Sales: state.sale.sales,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSaleRedux: () => dispatch(actions.fetchAllSalesStart()),
    // editSaleRedux: (data) => dispatch(actions.editSale(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SaleManage);
