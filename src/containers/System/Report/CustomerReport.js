import React, { Component } from "react";
import { connect } from "react-redux";
import { Radio, DatePicker } from "antd";
import moment from "moment";
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
import { getTop10CustomersByRevenue } from "../../../services/reportService";

class CustomerReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataCustomers: [],
      filterType: "month",
      selectedDate: moment(),
      customRange: {
        startDate: null,
        endDate: null,
      },
    };
  }

  async componentDidMount() {
    await this.fetchTopCustomers();
  }

  fetchTopCustomers = async () => {
    const { filterType, selectedDate, customRange } = this.state;
    let dataCustomers;

    console.log("Fetching data with filterType:", filterType);

    if (filterType === "custom") {
      const { startDate, endDate } = customRange;
      if (!startDate || !endDate) {
        return; // Không fetch dữ liệu nếu chưa chọn đầy đủ ngày
      }
      dataCustomers = await getTop10CustomersByRevenue(
        filterType,
        selectedDate.toISOString(),
        startDate.toISOString(),
        endDate.toISOString()
      );
    } else {
      dataCustomers = await getTop10CustomersByRevenue(
        filterType,
        selectedDate.toISOString()
      );
    }

    this.setState({ dataCustomers });
  };

  onChangeFilterType = (e) => {
    this.setState({ filterType: e.target.value }, this.fetchTopCustomers);
  };

  onDateChange = (date) => {
    this.setState({ selectedDate: date }, this.fetchTopCustomers);
  };

  onCustomRangeChange = (dates) => {
    this.setState(
      {
        customRange: {
          startDate: dates ? dates[0] : null,
          endDate: dates ? dates[1] : null,
        },
      },
      this.fetchTopCustomers
    );
  };

  render() {
    const { dataCustomers, filterType, selectedDate, customRange } = this.state;

    return (
      <div className="container">
        <div className="left-items">
          <h3>Lọc theo</h3>
          <Radio.Group onChange={this.onChangeFilterType} value={filterType}>
            <Radio value="month">Tháng</Radio>
            <Radio value="week">Tuần</Radio>
            <Radio value="custom">Tùy chỉnh</Radio>
          </Radio.Group>
          {filterType === "custom" ? (
            <DatePicker.RangePicker
              value={[customRange.startDate, customRange.endDate]}
              onChange={this.onCustomRangeChange}
            />
          ) : (
            <DatePicker
              picker={filterType}
              value={selectedDate}
              onChange={this.onDateChange}
              format={filterType === "month" ? "MM/YYYY" : "DD/MM/YYYY"}
            />
          )}
        </div>

        <div className="right-items">
          <h3>Top 10 Khách Hàng Mua Nhiều Nhất</h3>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={dataCustomers}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="customerName" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalRevenue" fill="#0071ba" name="Doanh thu" />
              </BarChart>
            </ResponsiveContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(CustomerReport);
