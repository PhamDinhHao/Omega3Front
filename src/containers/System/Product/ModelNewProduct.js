import React, { Component } from "react";
import { FormattedMessage } from "react-intl";

import { connect } from "react-redux";
import { Button, Modal } from "reactstrap";
import * as actions from "../../../store/actions";
import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { emitter } from "../../../utils/emitter";
import { CommonUtils } from "../../../utils";
import "./ModelNewProduct.scss";
import Lightbox from "react-image-lightbox";
import Select from "react-select";
import ModelNewSupplier from "../Supplier/ModelNewSupplier";
import ModelNewCategory from "./ModelNewCategory";
import ModelNewUnit from "./ModelNewUnit";
import {
  getAllCategory,
  createNewCategoryrService,
  getAllLocation,
  createNewLocationrService,
} from "../../../services/categoryService";
import {
  getAllUnit,
  createNewUnitService,
} from "../../../services/unitService";
import ModelNewLocation from "./ModelNewLocation";
class ModelNewProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,

      productName: "",

      costPrice: "",
      salePrice: "",
      image: "",
      quantity: "",
      description: "",
      waitTime: "",
      previewImgUrl: "",

      supplierRedux: [],
      listSupplierState: [],
      selectedSupplier: [],
      isOpenNewSupplier: false,

      arrCategorys: [],
      listCategoryState: [],
      selectedCategory: [],
      isOpenNewCategory: false,

      arrUnits: [],
      listUnitState: [],
      selectedUnit: [],
      isOpenNewUnit: false,

      arrLocations: [],
      listLocationState: [],
      selectedLocation: [],
      isOpenNewLocation: false,
    };
    this.listenToEmitter();
  }
  listenToEmitter() {
    emitter.on("EVENT_CLEAR_MODAL_DATA", () => {
      this.setState({
        productName: "",

        costPrice: "",
        salePrice: "",
        image: "",
        quantity: "",
        description: "",
        previewImgUrl: "",

        supplierRedux: [],
        listSupplierState: [],
        selectedSupplier: [],

        arrCategorys: [],
        listCategoryState: [],
        selectedCategory: [],

        arrUnits: [],
        listUnitState: [],
        selectedUnit: [],

        arrLocations: [],
        listLocationState: [],
        selectedLocation: [],
      });
    });
  }

  async getAllCategoryFromReact() {
    let response = await getAllCategory("ALL");
    let response1 = await getAllUnit("ALL");
    let response2 = await getAllLocation("ALL");
    console.log("res", response2);
    if (
      response &&
      response.errCode === 0 &&
      JSON.stringify(response.categorys) !==
        JSON.stringify(this.state.arrCategorys)
    ) {
      this.setState({
        arrCategorys: response.categorys,
      });
    }
    if (
      response1 &&
      response1.errCode === 0 &&
      JSON.stringify(response1.units) !== JSON.stringify(this.state.arrUnits)
    ) {
      this.setState({
        arrUnits: response1.units,
      });
    }
    if (
      response2 &&
      response2.errCode === 0 &&
      JSON.stringify(response2.lacations) !==
        JSON.stringify(this.state.arrLocations)
    ) {
      this.setState({
        arrLocations: response2.lacations,
      });
    }
  }
  async componentDidMount() {
    await this.getAllCategoryFromReact();
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.listSuppliers !== this.props.listSuppliers) {
      let dataSelectSupplier = this.buildDataInputSelectSupplier(
        this.props.listSuppliers
      );
      this.setState({
        supplierRedux: this.props.listSuppliers,
        listSupplierState: dataSelectSupplier,
      });
    }

    if (prevState.arrCategorys !== this.state.arrCategorys) {
      let dataSelectCategory = this.buildDataInputSelectCategory(
        this.state.arrCategorys
      );

      this.setState({
        listCategoryState: dataSelectCategory,
      });
      this.getAllCategoryFromReact();
    }
    if (prevState.arrUnits !== this.state.arrUnits) {
      let dataSelectUnit = this.buildDataInputSelectUnit(this.state.arrUnits);

      this.setState({
        listUnitState: dataSelectUnit,
      });
      this.getAllCategoryFromReact();
    }
    if (prevState.arrLocations !== this.state.arrLocations) {
      let dataSelectLocation = this.buildDataInputSelectLocation(
        this.state.arrLocations
      );

      this.setState({
        listLocationState: dataSelectLocation,
      });
      this.getAllCategoryFromReact();
    }
  }

  handleChangeSelectLocation = (selectedLocation) => {
    this.setState({ selectedLocation: selectedLocation });
  };
  handleChangeSelectCategory = (selectedCategory) => {
    this.setState({ selectedCategory: selectedCategory });
  };
  handleChangeSelectUnit = (selectedUnit) => {
    this.setState({ selectedUnit: selectedUnit });
  };
  toggle = () => {
    this.props.toggleFromParent();
  };

  handleOnChangeInput = (event, id) => {
    let copyState = { ...this.state };
    copyState[id] = event.target.value;
    this.setState({
      ...copyState,
    });
  };

  checkValideInput = () => {
    let isValid = true;
    let arrInput = [
      "productName",
      "costPrice",
      "salePrice",
      "image",
      "quantity",
    ];
    for (let i = 0; i < arrInput.length; i++) {
      if (!this.state[arrInput[i]]) {
        isValid = false;
        alert("Missing parameter: " + arrInput[i]);
        break;
      }
    }
    return isValid;
  };
  checkValideInputSelect = () => {
    let isValid = true;
    let arrInput = ["selectedCategory", "selectedUnit"];

    for (let i = 0; i < arrInput.length; i++) {
      if (this.state[arrInput[i]].length == 0) {
        isValid = false;
        alert("Missing parameter: " + arrInput[i]);
        break;
      }
    }
    return isValid;
  };

  handleAddNewProduct = () => {
    let isValid = this.checkValideInput();
    let isValidSelect = this.checkValideInputSelect();

    if (isValid == true && isValidSelect == true) {
      //call apicreat modal
      //   console.log("check data", this.state);
      this.props.createNewProduct(this.state);
    }
  };
  handleOnchangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);

      let objectUrl = URL.createObjectURL(file);

      this.setState({
        previewImgUrl: objectUrl,
        image: base64,
      });
    }
  };
  buildDataInputSelectLocation = (inputData) => {
    let result = [];

    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        object.label = item.locationName;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };
  buildDataInputSelectCategory = (inputData) => {
    let result = [];

    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        object.label = item.categoryName;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };
  buildDataInputSelectUnit = (inputData) => {
    let result = [];

    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        object.label = item.unitName;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };
  buildDataInputSelectSupplier = (inputData) => {
    let result = [];

    if (inputData && inputData.length > 0) {
      inputData.map((item, index) => {
        let object = {};
        object.label = item.locationName;
        object.value = item.id;
        result.push(object);
      });
    }
    return result;
  };

  toggleLocationModal = () => {
    this.setState({
      isOpenNewLocation: !this.state.isOpenNewLocation,
    });
  };
  toggleCategoryModal = () => {
    this.setState({
      isOpenNewCategory: !this.state.isOpenNewCategory,
    });
  };
  toggleUnitModal = () => {
    this.setState({
      isOpenNewUnit: !this.state.isOpenNewUnit,
    });
  };
  handleAddNewLocation = () => {
    this.setState({
      isOpenNewLocation: true,
    });
  };
  handleAddNewCategory = () => {
    this.setState({
      isOpenNewCategory: true,
    });
  };
  handleAddNewUnit = () => {
    this.setState({
      isOpenNewUnit: true,
    });
  };
  createNewLocation = async (data) => {
    try {
      let response = await createNewLocationrService(data);
      if (response && response.errCode !== 0) {
        alert(response.errMessage);
      } else {
        this.setState({
          isOpenNewLocation: false,
        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA", { id: "your id" });
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  createNewCategory = async (data) => {
    try {
      let response = await createNewCategoryrService(data);
      if (response && response.errCode !== 0) {
        alert(response.errMessage);
      } else {
        this.setState({
          isOpenNewCategory: false,
        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA", { id: "your id" });
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  createNewUnit = async (data) => {
    try {
      let response = await createNewUnitService(data);
      if (response && response.errCode !== 0) {
        alert(response.errMessage);
      } else {
        this.setState({
          isOpenNewUnit: false,
        });
        emitter.emit("EVENT_CLEAR_MODAL_DATA", { id: "your id" });
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div>
        <ModelNewLocation
          isOpen={this.state.isOpenNewLocation}
          toggleFromParent={this.toggleLocationModal}
          createNewLocation={this.createNewLocation}
        />
        <ModelNewCategory
          isOpen={this.state.isOpenNewCategory}
          toggleFromParent={this.toggleCategoryModal}
          createNewCategory={this.createNewCategory}
        />
        <ModelNewUnit
          isOpen={this.state.isOpenNewUnit}
          toggleFromParent={this.toggleUnitModal}
          createNewUnit={this.createNewUnit}
        />
        <Modal
          isOpen={this.props.isOpen}
          toggle={() => {
            this.toggle();
          }}
          className={"model-supplier-container"}
          size="lg"
          centered
        >
          <ModalHeader
            toggle={() => {
              this.toggle();
            }}
          >
            Thêm mới sản phẩm
          </ModalHeader>
          <ModalBody>
            <div className="modal-supplier-body">
              <div className="input-container">
                <label>Tên sản phẩm</label>
                <input
                  type="text"
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "productName")
                  }
                  value={this.state.productName}
                ></input>
              </div>
              <div className="input-container">
                <label>
                  Loại sản phẩm
                  <i
                    className="fas fa-plus"
                    style={{ marginLeft: "10px" }}
                    onClick={() => this.handleAddNewCategory()}
                  ></i>
                </label>

                <Select
                  onChange={this.handleChangeSelectCategory}
                  value={this.state.selectedCategory}
                  options={this.state.listCategoryState}
                ></Select>
              </div>

              <div className="input-container">
                <label>Số lượng</label>
                <input
                  type="number"
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "quantity")
                  }
                  value={this.state.quantity}
                ></input>
              </div>
              <div className="input-container">
                <label>
                  Vị trí kho
                  <i
                    className="fas fa-plus"
                    style={{ marginLeft: "10px" }}
                    onClick={() => this.handleAddNewLocation()}
                  ></i>
                </label>

                <Select
                  onChange={this.handleChangeSelectLocation}
                  value={this.state.selectedLocation}
                  options={this.state.listLocationState}
                ></Select>
              </div>
              <div className="input-container">
                <label>Giá nhập</label>
                <input
                  type="number"
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "costPrice")
                  }
                  value={this.state.costPrice}
                ></input>
              </div>
              <div className="input-container">
                <label>
                  Đơn vị
                  <i
                    className="fas fa-plus"
                    style={{ marginLeft: "10px" }}
                    onClick={() => this.handleAddNewUnit()}
                  ></i>
                </label>

                <Select
                  onChange={this.handleChangeSelectUnit}
                  value={this.state.selectedUnit}
                  options={this.state.listUnitState}
                ></Select>
              </div>
              <div className="input-container">
                <label>Giá bán</label>
                <input
                  type="number"
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "salePrice")
                  }
                  value={this.state.salePrice}
                ></input>
              </div>
              <div className="input-container">
                <label>Thời gian đặt hàng</label>
                <input
                  type="number"
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "waitTime")
                  }
                  value={this.state.waitTime}
                ></input>
              </div>
              <div className="input-container max-width-input">
                <label>Mô tả</label>
                <input
                  type="text"
                  onChange={(event) =>
                    this.handleOnChangeInput(event, "description")
                  }
                  value={this.state.description}
                ></input>
              </div>
              <div className="col-md-3">
                <label htmlFor="inputImage" className="form-label">
                  Hình ảnh
                </label>
                <div className="preview-img-container">
                  <input
                    id="previewImg"
                    type="file"
                    hidden
                    onChange={(event) => this.handleOnchangeImage(event)}
                  />
                  <label className="label-upload" htmlFor="previewImg">
                    Tải ảnh <i className="fas fa-upload"></i>
                  </label>
                  <div
                    className="preview-image"
                    style={{
                      backgroundImage: `url(${this.state.previewImgUrl})`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              className="px-3"
              onClick={() => {
                this.handleAddNewProduct();
              }}
            >
              Thêm mới
            </Button>{" "}
            <Button
              color="secondary"
              className="px-3"
              onClick={() => {
                this.toggle();
              }}
            >
              Đóng
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    listSuppliers: state.supplier.suppliers,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchSupplierRedux: () => dispatch(actions.fetchAllSuppliersStart()),
    createNewSupplierRedux: (data) => dispatch(actions.createNewSupplier(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModelNewProduct);
