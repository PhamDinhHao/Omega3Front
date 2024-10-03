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
import "./ProductReport.scss";
import {
  getTop10ProductBySale,
  getTop10ProductByQuantity,
} from "../../../services/reportService";

class ProductReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSale: [],
      dataQuantity: [],
      value: 1,
      filterType: "month",
      selectedDate: moment(),
      customRange: {
        startDate: null,
        endDate: null,
      },
    };
  }

  async componentDidMount() {
    await this.fetchData();
  }

  fetchData = async () => {
    const { filterType, selectedDate, customRange } = this.state;
    let dataSale, dataQuantity;
    // console.log("Fetching data with filterType:", filterType);

    if (filterType === "custom") {
      const { startDate, endDate } = customRange;
      if (!startDate || !endDate) {
        return; // Không fetch dữ liệu nếu chưa chọn đầy đủ ngày
      }
      dataSale = await getTop10ProductBySale(
        filterType,
        selectedDate.toISOString(),
        startDate.toISOString(),
        endDate.toISOString()
      );
      dataQuantity = await getTop10ProductByQuantity(
        filterType,
        selectedDate.toISOString(),
        startDate.toISOString(),
        endDate.toISOString()
      );
    } else {
      dataSale = await getTop10ProductBySale(
        filterType,
        selectedDate.toISOString()
      );
      dataQuantity = await getTop10ProductByQuantity(
        filterType,
        selectedDate.toISOString()
      );
    }

    this.setState({ dataSale, dataQuantity });
  };

  onChangeValue = (e) => {
    this.setState({ value: e.target.value }, this.fetchData);
  };

  onChangeFilterType = (e) => {
    this.setState({ filterType: e.target.value }, this.fetchData);
  };

  onDateChange = (date) => {
    this.setState({ selectedDate: date }, this.fetchData);
  };

  onCustomRangeChange = (dates) => {
    this.setState(
      {
        customRange: {
          startDate: dates ? dates[0] : null,
          endDate: dates ? dates[1] : null,
        },
      },
      this.fetchData
    );
  };

  render() {
    const {
      dataSale,
      dataQuantity,
      value,
      filterType,
      selectedDate,
      customRange,
    } = this.state;
    const chartData = value === 1 ? dataSale : dataQuantity;
    const dataKey = value === 1 ? "totalRevenue" : "totalQuantity";
    const barName = value === 1 ? "Doanh thu" : "Số lượng";

    return (
      <div className="container">
        <div className="left-items">
          <h3>Biểu đồ theo</h3>
          <Radio.Group onChange={this.onChangeValue} value={value}>
            <Radio value={1}>Doanh thu</Radio>
            <Radio value={2}>Số lượng</Radio>
          </Radio.Group>
          <h3>Lọc theo</h3>
          <Radio.Group onChange={this.onChangeFilterType} value={filterType}>
            <Radio value="month">Tháng</Radio>
            <Radio value="week">Tuần</Radio>
            <Radio value="custom">Tùy chọn</Radio>
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
          <h3>Top 10 Sản Phẩm Theo {barName}</h3>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="Product.productName" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey={dataKey} fill="#0071ba" name={barName} />
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductReport);
