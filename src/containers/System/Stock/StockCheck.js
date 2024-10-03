import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { Table, Radio } from "antd";
import CustomScrollbars from "../../../components/CustomScrollbars";
import Lightbox from "react-image-lightbox";
import { withRouter } from "react-router-dom";
import * as actions from "../../../store/actions";
import "../../System/Product/ProductManage.scss";

class StockCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stockCheckRedux: [],
      listStockCheck: [],
      selectedStockCheck: null,
      selectedDateFilter: null,
      selectedItemCheckbox: [], // Khởi tạo selectedItemCheckbox
      columns: [
        {
          title: "Mã kiểm kho",
          dataIndex: "id",
        },
        {
          title: "Thời gian",
          dataIndex: "checkDate",
          render: (text) => <span>{this.formatDate(text)}</span>,
        },
        {
          title: "SL thực tế",
          dataIndex: "totalActualQuantity",
          render: (text) => this.formatNumberWithCommas(text),
        },
        {
          title: "Tổng thực tế",
          dataIndex: "totalActualMoney",
          render: (text) => this.formatNumberWithCommas(text),
        },
        {
          title: "Tổng chênh lệch",
          dataIndex: "totalMoneyDifference",
          render: (text) => this.formatNumberWithCommas(text),
        },
        {
          title: "Hoạt động",
          dataIndex: "",
          render: (text, record) => (
            <div>
              <button
                className="btn-edit"
                onClick={() => this.handleUpdateStockCheck(record)}
              >
                <i className="fas fa-pencil-alt"></i>
              </button>
              <button
                className="btn-delete"
                onClick={() => this.handleDeleteStockCheck(record)}
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
    this.props.fetchStockCheckRedux();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.stockChecks !== this.props.stockChecks) {
      // console.log("Stock checks updated:", this.props.stockChecks);
      let dataSelect = this.buildDataInputSelect(this.props.stockChecks);
      this.setState({
        stockCheckRedux: this.props.stockChecks,
        listStockCheck: dataSelect,
      });
    }
  }

  handleAddNewStockCheck = () => {
    this.props.history.push("/system/stock-check-add");
  };

  handleUpdateStockCheck = async (record) => {
    await this.props.history.push({
      pathname: "/system/stock-check-update",
      state: { record },
    });
  };

  handleChangeSelect = (selectedStockCheck) => {
    this.setState({ selectedStockCheck });
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

  filterStockChecks = (stockChecks, selectedOption) => {
    if (selectedOption === null) return stockChecks;
    return stockChecks.filter(
      (stockCheck) => stockCheck.id === selectedOption.value
    );
  };

  formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  handleSearchByDate = (value) => {
    const { stockChecks } = this.props;
    let filteredData = [];

    const currentDate = new Date();

    switch (value) {
      case "thisMonth":
        filteredData = stockChecks.filter((item) => {
          const checkDate = new Date(item.checkDate);
          return (
            checkDate.getMonth() === currentDate.getMonth() &&
            checkDate.getFullYear() === currentDate.getFullYear()
          );
        });
        break;

      case "yesterday":
        const yesterday = new Date();
        yesterday.setDate(currentDate.getDate() - 1);
        filteredData = stockChecks.filter((item) => {
          const checkDate = new Date(item.checkDate);
          return checkDate.toDateString() === yesterday.toDateString();
        });
        break;

      default:
        filteredData = stockChecks;
        break;
    }
    this.setState({ stockCheckRedux: filteredData, selectedDateFilter: value });
  };

  searchByRadioGroupOrInputSearch = () => {
    let tempList = [];

    if (this.state.selectedItemCheckbox.length > 0) {
      tempList = this.state.selectedItemCheckbox;
    } else {
      tempList = this.filterStockChecks(
        this.state.stockCheckRedux,
        this.state.selectedStockCheck
      );
    }

    return tempList;
  };

  formatNumberWithCommas(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  render() {
    const {
      selectedStockCheck,
      columns,
      listStockCheck,
      selectedDateFilter,
      stockCheckRedux,
    } = this.state;
    const filteredStockChecks = this.searchByRadioGroupOrInputSearch();
    // console.log("StockCheckRedux in render:", stockCheckRedux);
    return (
      <div className="product">
        <div className="product-content">
          <div className="main-left">
            <div className="heading-page">
              <span className="ng-binding">Kiểm kho</span>
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
                    value={selectedStockCheck}
                    onChange={this.handleChangeSelect}
                    options={listStockCheck}
                  />
                </div>
                <div className="header-filter-buttons">
                  <button
                    className="btn btn-success"
                    onClick={this.handleAddNewStockCheck}
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
                      dataSource={filteredStockChecks}
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
    stockChecks: state.stock.stockChecks,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchStockCheckRedux: () => dispatch(actions.fetchAllStockChecksStart()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StockCheck);
