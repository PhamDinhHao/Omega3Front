import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";

import Autosuggest from "react-autosuggest";
import * as actions from "../../../store/actions";
import DatePicker from "../../../components/Input/DatePicker";
// import InputSuggest from "../../../components/Input/InputSuggest";
import ModelNewProduct from "../../System/Product/ModelNewProduct";
import ModelNewCustomer from "../../System/Customer/ModelNewCustomer";
import { emitter } from "../../../utils/emitter";

class SaleNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CustomerValue: "",
      customerSuggestions: [],
      productValue: "",
      productSuggestions: [],
      products: [],
      updatedproducts: [],
      selectedDate: new Date(),
      isOpenNewProduct: false,
      isOpenNewCustomer: false,
      selectedCustomerId: null,
      total: "",
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.customerSuggestions !== this.props.customerSuggestions) {
      this.setState({ customerSuggestions: this.props.customerSuggestions });
    }
    if (prevProps.productSuggestions !== this.props.productSuggestions) {
      this.setState({ productSuggestions: this.props.productSuggestions });
    }
  }

  toggleProductModal = () => {
    this.setState({
      isOpenNewProduct: !this.state.isOpenNewProduct,
    });
  };

  handleReturnToSale = () => {
    this.props.history.push("/system/sale");
  };

  handleAddNewProduct = () => {
    this.setState({
      isOpenNewProduct: true,
    });
  };

  createNewProduct = async (data) => {
    try {
      let response = await this.props.createNewProductRedux(data);

      if (response && response.errCode !== 0) {
        alert(response.errMessage);
      } else {
        this.setState({
          isOpenNewProduct: false,
        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA", { id: "your id" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  toggleCustomerModal = () => {
    this.setState({
      isOpenNewCustomer: !this.state.isOpenNewCustomer,
    });
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
        emitter.emit("EVENT_CLEAR_MODAL_DATA", { id: "your id" });
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  getcustomerSuggestions = async (value) => {
    try {
      this.props.fetchCustomerSuggestionsRedux(value);
    } catch (error) {
      console.error("error fetching Customer suggestions", error);
    }
  };

  getProductSuggestions = async (value) => {
    try {
      this.props.fetchProductSuggestionsRedux(value);
    } catch (error) {
      console.error("error fetching product suggestions", error);
    }
  };

  renderCustomerSuggestion = (suggestion) => <div>{suggestion.name}</div>;

  renderProductSuggestion = (suggestion) => <div>{suggestion.productName}</div>;

  onCustomerChange = (event, { newValue }) => {
    this.setState({
      CustomerValue: newValue,
    });

    this.getcustomerSuggestions(newValue);
  };

  onProductChange = (event, { newValue }) => {
    this.setState({
      productValue: newValue,
    });
    this.getProductSuggestions(newValue);
  };

  oncustomerSuggestionsFetchRequested = ({ value }) => {
    this.getcustomerSuggestions(value);
  };

  onProductSuggestionsFetchRequested = ({ value }) => {
    this.getProductSuggestions(value);
  };

  onSuggestionsClearRequested = () => {
    this.setState({ customerSuggestions: [] });
  };

  onProductTableSuggestionSelected = (event, { suggestion }) => {
    // const { products } = this.state;
    // const newProduct = {
    //   id: suggestion.id,
    //   name: suggestion.productName,
    //   quantity: 1,
    //   price: 0,
    // };
    // const newproducts = [...products, newProduct];
    // this.setState({ products: newproducts });
    // this.setState({ productValue: "" });
    const { products } = this.state;
    const existingProductIndex = products.findIndex(
      (product) => product.id === suggestion.id
    );

    if (existingProductIndex !== -1) {
      // Sản phẩm đã tồn tại trong bảng
      const updatedProducts = [...products];
      updatedProducts[existingProductIndex].quantity++; // Tăng số lượng sản phẩm
      updatedProducts[existingProductIndex].total =
        updatedProducts[existingProductIndex].quantity *
        updatedProducts[existingProductIndex].salePrice;
      this.setState({ products: updatedProducts });
    } else {
      // Sản phẩm chưa tồn tại trong bảng
      const newProduct = {
        id: suggestion.id,
        name: suggestion.productName,
        quantity: 1,
        salePrice: suggestion.salePrice,
        total: suggestion.salePrice,
      };
      const newProducts = [...products, newProduct];
      this.setState({ products: newProducts });
    }
    this.setState({ productValue: "" });
  };

  onQuantityIncrease = (index) => {
    const { products } = this.state;
    const updatedproducts = [...products];
    updatedproducts[index].quantity++;
    updatedproducts[index].total =
      updatedproducts[index].quantity * updatedproducts[index].salePrice;
    this.setState({ products: updatedproducts });
  };

  onQuantityDecrease = (index) => {
    const { products } = this.state;
    const updatedproducts = [...products];
    updatedproducts[index].quantity--;
    updatedproducts[index].total =
      updatedproducts[index].quantity * updatedproducts[index].salePrice;
    this.setState({ products: updatedproducts });
  };

  onQuantityChange = (index, value) => {
    const newQuantity = parseInt(value); // Chuyển đổi giá trị nhập vào thành số nguyên
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      // Kiểm tra nếu giá trị là một số và lớn hơn hoặc bằng 1
      // Update số lượng cho sản phẩm tại index
      const updatedProducts = [...this.state.products];
      updatedProducts[index].quantity = newQuantity;
      updatedProducts[index].total =
        newQuantity * updatedProducts[index].salePrice;
      this.setState({ products: updatedProducts });
    }
  };

  onPriceChange = (index, newPrice) => {
    const { products } = this.state;
    const updatedproducts = [...products];
    updatedproducts[index].salePrice = newPrice;
    updatedproducts[index].total = newPrice * updatedproducts[index].quantity;
    this.setState({ products: updatedproducts });
  };

  onDeleteProduct = (index) => {
    const { products } = this.state;
    const updatedproducts = [...products];
    updatedproducts.splice(index, 1);
    this.setState({ products: updatedproducts });
  };

  getTotalQuantity = () => {
    const { products } = this.state;
    let totalQuantity = 0;
    products.forEach((product) => {
      totalQuantity += product.quantity;
    });
    return totalQuantity;
  };

  getTotalMoney = () => {
    const { products } = this.state;
    let totalMoney = 0;
    products.forEach((product) => {
      totalMoney += product.quantity * product.salePrice;
    });
    this.state.total = totalMoney;
    return totalMoney;
  };

  handleDateChange = (date) => {
    this.setState({ selectedDate: date });
  };

  saveSaleAndDetails = async (selectedDate) => {
    try {
      const { products, selectedCustomerId } = this.state;
      if (products.length > 0 && selectedCustomerId) {
        await this.props.createNewSaleRedux({
          saleDate: selectedDate,
          customerId: this.state.selectedCustomerId,
          total: this.state.total,
        });
        const { saleId } = this.props;

        await Promise.all(
          this.state.products.map(async (product) => {
            const {
              id: productId,
              name: productName,
              quantity,
              salePrice,
              total,
            } = product;
            const res = await this.props.createSaleDetailRedux({
              saleId: saleId,
              productId: productId,
              productName: productName,
              quantity: quantity,
              total: total,
              salePrice: salePrice,
            });
            // if (this.props.isSaleDetail == false) {
            //   this.props.history.push("/system/sale");
            // }
          })
        );
        console.log(
          "Sale and details saved successfully!",
          this.props.isSaleDetail
        );

        console.log("Sale and details saved successfully!");
        this.props.history.push("/system/sale");
      } else {
        alert("Thiếu thông tin khách hàng hoặc chưa có sản phẩm");
      }
    } catch (error) {
      console.error("Error saving Sale and details:", error);
    }
  };
  onSuggestionSelected = (event, { suggestion }) => {
    this.setState({
      selectedCustomerId: suggestion.id,
    });
  };
  render() {
    const {
      CustomerValue,
      customerSuggestions,
      productValue,
      productSuggestions,
      products,
      updatedproducts,
      selectedDate,
    } = this.state;

    const CustomerInputProps = {
      placeholder: "Tìm khách hàng",
      value: CustomerValue,
      onChange: this.onCustomerChange,
    };

    const productInputProps = {
      placeholder: "Tìm sản phẩm",
      value: productValue,
      onChange: this.onProductChange,
    };
    return (
      <div class="cover-div">
        <div class="item-left">
          <div class="search-box">
            <div class="back-arrow">
              <button onClick={() => this.handleReturnToSale()}>
                <i class="fas fa-arrow-left"></i>
              </button>
            </div>
            <div class="search-bar">
              <button>
                <i class="fas fa-search icon"></i>
              </button>
              {/* <input type="text" placeholder="Search product"></input> */}
              <div class="suggestion-container">
                <Autosuggest
                  suggestions={productSuggestions}
                  onSuggestionsFetchRequested={
                    this.onProductSuggestionsFetchRequested
                  }
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                  getSuggestionValue={(suggestion) => suggestion.productName}
                  renderSuggestion={this.renderProductSuggestion}
                  inputProps={productInputProps}
                  onSuggestionSelected={this.onProductTableSuggestionSelected}
                />
              </div>
              <button onClick={() => this.handleAddNewProduct()}>
                <i class="fas fa-plus"></i>
              </button>
            </div>
          </div>
          <div class="item-table">
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>STT</th>
                  <th>Id</th>
                  <th>Tên</th>
                  <th>Số Lượng</th>
                  <th>Giá Bán</th>
                  <th>Tổng</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, index) => (
                  <tr key={index}>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => this.onDeleteProduct(index)}
                      >
                        <i
                          className="fas fa-trash"
                          style={{ color: "#B22222" }}
                        ></i>
                      </button>
                    </td>
                    <td>{index + 1}</td>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>
                      <button
                        className="quantity-btn"
                        onClick={() => this.onQuantityDecrease(index)}
                        disabled={product.quantity <= 1}
                      >
                        -
                      </button>
                      {/* <span className="quantity">{product.quantity}</span> */}
                      <input
                        type="number"
                        className="quantity-input"
                        value={product.quantity}
                        onChange={(e) =>
                          this.onQuantityChange(index, e.target.value)
                        }
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                      <button
                        className="quantity-btn"
                        onClick={() => this.onQuantityIncrease(index)}
                      >
                        +
                      </button>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={product.salePrice}
                        onChange={(e) =>
                          this.onPriceChange(index, e.target.value)
                        }
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    </td>
                    <td>{product.quantity * product.salePrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="product-list">
            <ModelNewProduct
              isOpen={this.state.isOpenNewProduct}
              toggleFromParent={this.toggleProductModal}
              createNewProduct={this.createNewProduct}
            />
            <ModelNewCustomer
              isOpen={this.state.isOpenNewCustomer}
              toggleFromParent={this.toggleCustomerModal}
              createNewCustomer={this.createNewCustomer}
            />
          </div>
        </div>
        <div class="item-right">
          <div class="purchare-order">
            <div class="user-box">
              <div class="user-name">
                <span>{this.props.userInfo.name}</span>
              </div>
              <div class="datetime-picker">
                <DatePicker
                  value={selectedDate}
                  onChange={this.handleDateChange}
                />
              </div>
            </div>
            <div class="search-bar">
              <button>
                <i class="fas fa-search icon"></i>
              </button>
              {/* <input type="text" placeholder="Search Customer"></input> */}
              <div class="suggestion-container">
                <Autosuggest
                  suggestions={customerSuggestions}
                  onSuggestionsFetchRequested={
                    this.oncustomerSuggestionsFetchRequested
                  }
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                  getSuggestionValue={(suggestion) => suggestion.name}
                  renderSuggestion={this.renderCustomerSuggestion}
                  inputProps={CustomerInputProps}
                  onSuggestionSelected={this.onSuggestionSelected}
                />
              </div>
              <button onClick={() => this.handleAddNewCustomer()}>
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <div class="quantity-box">
              <span>Tổng số lượng:</span>
              <span class="total-quantity">{this.getTotalQuantity()}</span>
            </div>
            <div class="money-box">
              <span>Tổng Tiền:</span>
              <span class="total-money">{this.getTotalMoney()}</span>
            </div>
            <div class="wrap-button">
              <a
                href="#"
                className="btn btn-success btn-font--medium"
                onClick={() => this.saveSaleAndDetails(selectedDate)}
              >
                <i class="fas fa-check"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    customerSuggestions: state.customer.customerSuggestions,
    productSuggestions: state.product.productSuggestions,
    saleId: state.sale.saleId,
    userInfo: state.user.userInfo,
    isSaleDetail: state.sale.isSaleDetail,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchCustomerSuggestionsRedux: (value) =>
      dispatch(actions.fetchCustomerSuggestions(value)),
    fetchProductSuggestionsRedux: (value) =>
      dispatch(actions.fetchProductSuggestions(value)),
    createNewSaleRedux: (data) => dispatch(actions.createNewSale(data)),
    createSaleDetailRedux: (data) =>
      dispatch(actions.createNewSaleDetail(data)),
    createNewProductRedux: (data) => dispatch(actions.createNewProduct(data)),
    createNewCustomerRedux: (data) => dispatch(actions.createNewCustomer(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SaleNew);
