import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./PurchaseNew.scss";
import Autosuggest from "react-autosuggest";
import * as actions from "../../../store/actions";
import DatePicker from "../../../components/Input/DatePicker";

import ModelNewProduct from "../../System/Product/ModelNewProduct";
import ModelNewSupplier from "../../System/Supplier/ModelNewSupplier";
import { emitter } from "../../../utils/emitter";

class PurchaseUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supplierValue: "",
      supplierId: null,
      supplierSuggestions: [],
      productValue: "",
      productSuggestions: [],
      products: [],
      updatedproducts: [],
      selectedDate: new Date(),
      isOpenNewProduct: false,
      isOpenNewSupplier: false,
      total: null,
      record: null,
    };
  }

  async componentDidMount() {
    console.log("chek props", this.props.location);
    const { state } = this.props.location;
    if (state && state.record) {
      const { record } = state;
      await this.props.fetchProductByPurchaseIdRedux(record.id);
      this.setState({
        record,
        // Cập nhật state khác nếu cần thiết, ví dụ:
        supplierValue: record.supplierId.name,
        supplierId: record.supplierId.id,
        // products: this.props.listProductByPurchaseId.data,
        selectedDate: new Date(record.purchaseDate),
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.supplierSuggestions !== this.props.supplierSuggestions) {
      // console.log(
      //   "Supplier suggestions received:",
      //   this.props.supplierSuggestions
      // );
      this.setState({ supplierSuggestions: this.props.supplierSuggestions });
    }
    if (prevProps.productSuggestions !== this.props.productSuggestions) {
      this.setState({ productSuggestions: this.props.productSuggestions });
    }
    if (
      prevProps.listProductByPurchaseId !== this.props.listProductByPurchaseId
    ) {
      if (Array.isArray(this.props.listProductByPurchaseId.data)) {
        this.setState({
          products: this.props.listProductByPurchaseId.data,
        });
      }
    }
  }

  toggleProductModal = () => {
    this.setState({
      isOpenNewProduct: !this.state.isOpenNewProduct,
    });
  };

  handleReturnToPurchase = () => {
    this.props.history.push("/system/purchase");
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

  toggleSupplierModal = () => {
    this.setState({
      isOpenNewSupplier: !this.state.isOpenNewSupplier,
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
        emitter.emit("EVENT_CLEAR_MODAL_DATA", { id: "your id" });
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  getSupplierSuggestions = async (value) => {
    try {
      // const response = await fetch(`/api/get-supplier-suggestion?q=${value}`);
      // const data = await response.json();

      // if (data && data.length > 0) {
      //   this.setState({ supplierSuggestions: data });
      // } else {
      //   this.setState({ supplierSuggestions: [] });
      // }
      this.props.fetchSupplierSuggestionsRedux(value);
    } catch (error) {
      console.error("error fetching supplier suggestions", error);
    }
  };

  getProductSuggestions = async (value) => {
    try {
      this.props.fetchProductSuggestionsRedux(value);
    } catch (error) {
      console.error("error fetching product suggestions", error);
    }
  };

  renderSupplierSuggestion = (suggestion) => <div>{suggestion.name}</div>;

  renderProductSuggestion = (suggestion) => <div>{suggestion.productName}</div>;

  onSupplierChange = (event, { newValue, method }) => {
    if (method === "type") {
      this.setState({
        supplierValue: newValue,
      });
      this.getSupplierSuggestions(newValue);
    } else if (method === "click" || method === "enter") {
      const selectedSupplier = this.state.supplierSuggestions.find(
        (supplier) => supplier.name === newValue
      );
      this.setState({
        supplierValue: newValue,
        supplierId: selectedSupplier ? selectedSupplier.id : null,
      });
    }
  };

  onProductChange = (event, { newValue }) => {
    this.setState({
      productValue: newValue,
    });
    this.getProductSuggestions(newValue);
  };

  onSupplierSuggestionsFetchRequested = ({ value }) => {
    this.getSupplierSuggestions(value);
  };

  onProductSuggestionsFetchRequested = ({ value }) => {
    this.getProductSuggestions(value);
  };

  onSupplierSuggestionsClearRequested = () => {
    this.setState({ supplierSuggestions: [] });
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
        updatedProducts[existingProductIndex].costPrice;
      this.setState({ products: updatedProducts });
    } else {
      // Sản phẩm chưa tồn tại trong bảng
      const newProduct = {
        id: suggestion.id,
        productName: suggestion.productName,
        quantity: 1,
        costPrice: suggestion.costPrice,
        total: suggestion.costPrice,
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
      updatedproducts[index].quantity * updatedproducts[index].costPrice;
    this.setState({ products: updatedproducts });
  };

  onQuantityDecrease = (index) => {
    const { products } = this.state;
    const updatedproducts = [...products];
    updatedproducts[index].quantity--;
    updatedproducts[index].total =
      updatedproducts[index].quantity * updatedproducts[index].costPrice;
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
        newQuantity * updatedProducts[index].costPrice;
      this.setState({ products: updatedProducts });
    }
  };

  onPriceChange = (index, newPrice) => {
    const { products } = this.state;
    const updatedproducts = [...products];
    updatedproducts[index].costPrice = newPrice;
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
      totalMoney += product.quantity * product._doc.costPrice;
    });
    this.state.total = totalMoney;
    return totalMoney;
  };

  handleDateChange = (date) => {
    this.setState({ selectedDate: date });
  };

  updatePurchaseAndDetails = async (selectedDate) => {
    console.log("updatePurchaseAndDetails called",this.state);

    const { products, supplierId } = this.state;
    if (products.length > 0 && supplierId != null) {
      const purchase = {
        purchaseId: this.state.record.id,
        supplierId: this.state.supplierId.id,
        total: this.state.total,
      };

      const purchaseDetails = this.state.products.map((product) => {
        console.log(product);

        const {
          _doc: tempId,
          // name: productName,
          quantity,
          costPrice,
          total,
        } = product;
        const productId = tempId._id;
        return {
          purchaseId: this.state.record.id,
          productId: productId,
          // productName: productName,
          quantity: quantity,
          costPrice: costPrice,
          total: total,
        };
      });
      await this.props.editPurchaseAndDetailsRedux(purchase, purchaseDetails);
      this.props.history.push("/system/purchase");
    }
  };

  render() {
    const {
      supplierValue,
      supplierId,
      supplierSuggestions,
      productValue,
      productSuggestions,
      products = [],
      updatedproducts,
      selectedDate,
      record,
    } = this.state;
    console.log("products", products);
    const supplierInputProps = {
      placeholder: "Search supplier",
      value: supplierValue,
      onChange: this.onSupplierChange,
      // onBlur: () => {
      //   const selectedSupplier = this.state.supplierSuggestions.find(
      //     (supplier) => supplier.name === this.state.supplierValue
      //   );
      //   this.setState({
      //     supplierId: selectedSupplier ? selectedSupplier.id : null,
      //   });
      // },
    };

    const productInputProps = {
      placeholder: "Search product",
      value: productValue,
      onChange: this.onProductChange,
    };

    return (
      <div class="cover-div">
        <div class="item-left">
          <div class="search-box">
            <div class="back-arrow">
              <button onClick={() => this.handleReturnToPurchase()}>
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
                  <th>Tên</th>
                  <th>Số Lượng</th>
                  <th>Giá Nhập</th>
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
                    <td>{product._doc.productName}</td>
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
                        value={product._doc.costPrice}
                        onChange={(e) =>
                          this.onPriceChange(index, e.target.value)
                        }
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                    </td>
                    <td>{product.quantity * product._doc.costPrice}</td>
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
            <ModelNewSupplier
              isOpen={this.state.isOpenNewSupplier}
              toggleFromParent={this.toggleSupplierModal}
              createNewSupplier={this.createNewSupplier}
            />
          </div>
        </div>
        <div class="item-right">
          <div class="purchare-order">
            <div class="user-box">
              <div class="user-name">
                <span>user</span>
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
                  suggestions={supplierSuggestions}
                  onSuggestionsFetchRequested={
                    this.onSupplierSuggestionsFetchRequested
                  }
                  onSuggestionsClearRequested={
                    this.onSupplierSuggestionsClearRequested
                  }
                  getSuggestionValue={(suggestion) => suggestion.name}
                  renderSuggestion={this.renderSupplierSuggestion}
                  inputProps={supplierInputProps}
                />
              </div>
              <button onClick={() => this.handleAddNewSupplier()}>
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <div class="quantity-box">
              <span>quantity:</span>
              <span class="total-quantity">{this.getTotalQuantity()}</span>
            </div>
            <div class="money-box">
              <span>total:</span>
              <span class="total-money">{this.getTotalMoney()}</span>
            </div>
            <div class="wrap-button">
              <button
                // href="#"
                className="btn btn-success btn-font--medium"
                onClick={() => this.updatePurchaseAndDetails(selectedDate)}
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
    supplierSuggestions: state.supplier.supplierSuggestions,
    productSuggestions: state.product.productSuggestions,
    purchaseId: state.purchase.purchaseId,
    listProductByPurchaseId: state.product.listProductByPurchaseId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSupplierSuggestionsRedux: (value) =>
      dispatch(actions.fetchSupplierSuggestions(value)),
    fetchProductSuggestionsRedux: (value) =>
      dispatch(actions.fetchProductSuggestions(value)),
    createNewPurchaseRedux: (data) => dispatch(actions.createNewPurchase(data)),
    createPurchaseDetailRedux: (data) =>
      dispatch(actions.createNewPurchaseDetail(data)),
    createNewProductRedux: (data) => dispatch(actions.createNewProduct(data)),
    createNewSupplierRedux: (data) => dispatch(actions.createNewSupplier(data)),
    fetchProductByPurchaseIdRedux: (data) =>
      dispatch(actions.fetchProductByPurchaseIdRedux(data)),
    editPurchaseAndDetailsRedux: (purchase, purchaseDetails) =>
      dispatch(actions.editPurchaseAndDetails(purchase, purchaseDetails)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseUpdate);
