import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import "./Colum.scss";
import {
  getAllHistorySale,
  getAllHistoryPurchase,
  getAllHistorySaleMonth,
  getAllHistoryPurchaseMonth,
} from "../../../services/columService";
import { Radio } from "antd";
import CustomScrollbars from "../../../components/CustomScrollbars";

class Colum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSale: [],
      dataSaleMonth: [],
      dataPurchase: [],
      dataPurchaseMonth: [],
      value: 1,
    };
  }

  async componentDidMount() {
    try {
      const [res1, res2, res3, res4] = await Promise.all([
        getAllHistorySale(),
        getAllHistoryPurchase(),
        getAllHistorySaleMonth(),
        getAllHistoryPurchaseMonth(),
      ]);
      this.setState({
        dataSale: res1.data,
        dataPurchase: res2.data,
        dataSaleMonth: res3.data,
        dataPurchaseMonth: res4.data,
      });
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }

  onChange = (e) => {
    this.setState({ value: e.target.value });
  };

  render() {
    const { dataSale, dataSaleMonth, dataPurchase, dataPurchaseMonth, value } =
      this.state;
    const totalSale = value === 2 ? dataSaleMonth : dataSale;
    const totalPurchse = value === 2 ? dataPurchaseMonth : dataPurchase;

    return (
      <div className="body-wrap">
        <div class="wrapper-div">
          <div class="dashboard-container">
            <div class="dashboard">
              <div class="header">
                <div class="header-item">
                  <i class="fa fa-dollar-sign dollar-icon"></i>
                  <h3>Doanh thu hôm nay</h3>
                  <p>22,200,000</p>
                </div>
                <div class="header-item">
                  <i class="fa fa-undo undo-icon"></i>
                  <h3>Trả hàng</h3>
                  <p>0</p>
                </div>
                <div class="header-item">
                  <i class="fa fa-arrow-down arrow-down-icon"></i>
                  <h3>So với hôm qua</h3>
                  <p>-86.58%</p>
                </div>
                <div class="header-item">
                  <i class="fa fa-calendar calendar-icon"></i>
                  <h3>So với cùng kỳ tháng trước</h3>
                  <p>-25.34%</p>
                </div>
              </div>

              <div class="main">
                <div class="left-column">
                  <h3>Tổng thu chi</h3>
                  <div class="main-colum">
                    <div class="main-radio-colum">
                      <div class="radio-colum">
                        <Radio.Group onChange={this.onChange} value={value}>
                          <Radio value={1}>Theo ngày</Radio>
                          <Radio value={2}>Theo tháng</Radio>
                        </Radio.Group>
                      </div>
                    </div>
                    <div class="content-colum">
                      <div class="top-content">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={totalSale}>
                            <CartesianGrid strokeDasharray="1 1" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="totalSales"
                              fill="#8884d8"
                              name="Tổng thu"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div class="bot-content">
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={totalPurchse}>
                            <CartesianGrid strokeDasharray="1 1" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="totalPurchases"
                              fill="#8884d8"
                              name="Tổng chi"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="right-column">
                  <div class="notifications">
                    <h4>Thông báo</h4>
                    <p>
                      <i class="fas fa-exclamation-circle"></i> Có 1 hoạt động
                      đăng nhập khác thường cần kiểm tra.
                    </p>
                  </div>
                  {/* <hr></hr> */}
                  <div class="activity-log">
                    <h4>Các hoạt động gần đây</h4>
                    <ul>
                      <li>
                        <i class="fas fa-shopping-cart"></i> vừa bán đơn hàng
                        với giá trị 22,200,000
                      </li>
                      <li>
                        <i class="fas fa-arrow-down"></i> vừa nhập hàng với giá
                        trị 0
                      </li>
                      <li>
                        <i class="fas fa-shopping-cart"></i> vừa bán đơn hàng
                        với giá trị 165,450,000
                      </li>
                      <li>
                        <i class="fas fa-arrow-down"></i> vừa nhập hàng với giá
                        trị 0
                      </li>
                      <li>
                        <i class="fas fa-shopping-cart"></i> vừa bán đơn hàng
                        với giá trị 59,250,000
                      </li>
                    </ul>
                  </div>
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
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Colum);
