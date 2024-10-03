import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "../Purchase/PurchaseNew.scss";
import Autosuggest from "react-autosuggest";
import * as actions from "../../../store/actions";
import DatePicker from "../../../components/Input/DatePicker";

import ModelNewProduct from "../../System/Product/ModelNewProduct";
import ModelNewCustomer from "../../System/Customer/ModelNewCustomer";
import { emitter } from "../../../utils/emitter";

class SaleUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      CustomerValue: "",
      CustomerId: null,
      CustomerSuggestions: [],
      productValue: "",
      productSuggestions: [],
      products: [],
      updatedproducts: [],
      selectedDate: new Date(),
      isOpenNewProduct: false,
      isOpenNewCustomer: false,
      total: null,
      record: null,
    };
  }

  async componentDidMount() {
    const { state } = this.props.location;
    if (state && state.record) {
      const { record } = state;
      await this.props.fetchProductBySaleIdRedux(record.id);
      this.setState({
        record,
        // Cập nhật state khác nếu cần thiết, ví dụ:
        CustomerValue: record.Customer.name,
        CustomerId: record.CustomerId,
        // products: this.props.listProductBySaleId.data,
        selectedDate: new Date(record.saleDate),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.CustomerSuggestions !== this.props.CustomerSuggestions) {
      // console.log(
      //   "Customer suggestions received:",
      //   this.props.CustomerSuggestions
      // );
      this.setState({ CustomerSuggestions: this.props.CustomerSuggestions });
    }
    if (prevProps.productSuggestions !== this.props.productSuggestions) {
      this.setState({ productSuggestions: this.props.productSuggestions });
    }
    if (prevProps.listProductBySaleId !== this.props.listProductBySaleId) {
      if (Array.isArray(this.props.listProductBySaleId.data)) {
        console.log("chek props", this.props.listProductBySaleId.data);
        this.setState({
          products: this.props.listProductBySaleId.data,
        });
      }
    }
  }

  toggleProductModal = () => {
    this.setState({
      isOpenNewProduct: !this.state.isOpenNewProduct,
    });
  };

  handleReturnToSale = () => {
    this.props.history.push("/system/Sale");
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

  getCustomerSuggestions = async (value) => {
    try {
      // const response = await fetch(`/api/get-Customer-suggestion?q=${value}`);
      // const data = await response.json();

      // if (data && data.length > 0) {
      //   this.setState({ CustomerSuggestions: data });
      // } else {
      //   this.setState({ CustomerSuggestions: [] });
      // }
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

  onCustomerChange = (event, { newValue, method }) => {
    if (method === "type") {
      this.setState({
        CustomerValue: newValue,
      });
      this.getCustomerSuggestions(newValue);
    } else if (method === "click" || method === "enter") {
      const selectedCustomer = this.state.CustomerSuggestions.find(
        (Customer) => Customer.name === newValue
      );
      this.setState({
        CustomerValue: newValue,
        CustomerId: selectedCustomer ? selectedCustomer.id : null,
      });
    }
  };

  onProductChange = (event, { newValue }) => {
    this.setState({
      productValue: newValue,
    });
    this.getProductSuggestions(newValue);
  };

  onCustomerSuggestionsFetchRequested = ({ value }) => {
    this.getCustomerSuggestions(value);
  };

  onProductSuggestionsFetchRequested = ({ value }) => {
    this.getProductSuggestions(value);
  };

  onCustomerSuggestionsClearRequested = () => {
    this.setState({ CustomerSuggestions: [] });
  };

  onProductSuggestionsClearRequested = () => {
    this.setState({ productSuggestions: [] });
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
        productName: suggestion.productName,
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

  updateSaleAndDetails = async (selectedDate) => {
    // console.log("updateSaleAndDetails called");
    try {
      const Sale = {
        SaleId: this.state.record.id,
        CustomerId: this.state.CustomerId,
        total: this.state.total,
      };

      const SaleDetails = this.state.products.map((product) => {
        const {
          id: productId,
          // name: productName,
          quantity,
          salePrice,
          total,
        } = product;
        return {
          SaleId: this.state.record.id,
          productId: productId,
          // productName: productName,
          quantity: quantity,
          salePrice: salePrice,
          total: total,
        };
      });
      // console.log(
      //   "editSaleAndDetails called with:",
      //   Sale,
      //   SaleDetails
      // );
      await this.props.editSaleAndDetailsRedux(Sale, SaleDetails);

      console.log("Sale and details updated successfully!");
      this.props.history.push("/system/Sale");
    } catch (error) {
      console.error("Error updating Sale and details:", error);
    }
  };

  render() {
    const {
      CustomerValue,
      CustomerId,
      CustomerSuggestions,
      productValue,
      productSuggestions,
      products = [],
      updatedproducts,
      selectedDate,
      record,
    } = this.state;
    // console.log("products", products);
    const CustomerInputProps = {
      placeholder: "Tìm khách hàng",
      value: CustomerValue,
      onChange: this.onCustomerChange,
      // onBlur: () => {
      //   const selectedCustomer = this.state.CustomerSuggestions.find(
      //     (Customer) => Customer.name === this.state.CustomerValue
      //   );
      //   this.setState({
      //     CustomerId: selectedCustomer ? selectedCustomer.id : null,
      //   });
      // },
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

              <div class="suggestion-container">
                <Autosuggest
                  suggestions={productSuggestions}
                  onSuggestionsFetchRequested={
                    this.onProductSuggestionsFetchRequested
                  }
                  onSuggestionsClearRequested={
                    this.onProductSuggestionsClearRequested
                  }
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
                    <td>{product.productName}</td>
                    <td>
                      <button
                        className="quantity-btn"
                        onClick={() => this.onQuantityDecrease(index)}
                        disabled={product.quantity <= 1}
                      >
                        -
                      </button>

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
                <span></span>
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

              <div class="suggestion-container">
                <Autosuggest
                  suggestions={CustomerSuggestions}
                  onSuggestionsFetchRequested={
                    this.onCustomerSuggestionsFetchRequested
                  }
                  onSuggestionsClearRequested={
                    this.onCustomerSuggestionsClearRequested
                  }
                  getSuggestionValue={(suggestion) => suggestion.name}
                  renderSuggestion={this.renderCustomerSuggestion}
                  inputProps={CustomerInputProps}
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
              <button
                // href="#"
                className="btn btn-success btn-font--medium"
                onClick={() => this.updateSaleAndDetails(selectedDate)}
              >
                <i class="fas fa-check"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    CustomerSuggestions: state.customer.customerSuggestions,
    productSuggestions: state.product.productSuggestions,
    SaleId: state.sale.saleId,
    listProductBySaleId: state.product.listProductBySaleId,
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
    fetchProductBySaleIdRedux: (data) =>
      dispatch(actions.fetchProductBySaleIdRedux(data)),
    editSaleAndDetailsRedux: (Sale, SaleDetails) =>
      dispatch(actions.editSaleAndDetails(Sale, SaleDetails)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SaleUpdate);
