import React, { Component } from "react";
import { FormattedMessage } from "react-intl";

import { connect } from "react-redux";
import { Button, Modal } from "reactstrap";

import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { emitter } from "../../../utils/emitter";

class ModelNewCustomer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phoneNumber: "",
      address: "",
      gender: "",
      birthday: "",
      debtCustomer: "",
    };
    this.listenToEmitter();
  }
  listenToEmitter() {
    emitter.on("EVENT_CLEAR_MODAL_DATA", () => {
      this.setState({
        name: "",
        phoneNumber: "",
        address: "",
        gender: "",
        birthday: "",
        debtCustomer: "",
      });
    });
  }
  componentDidMount() { }
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
      "name",
      "phoneNumber",
      "address",
      "debtCustomer",
      "gender",
      "birthday",
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
  handleAddNewCustomer = () => {
    let isValid = this.checkValideInput();
    if (isValid == true) {
      //call apicreat modal
      this.props.createNewCustomer(this.state);
      this.setState({
        name: "",
        phoneNumber: "",
        address: "",
        gender: "",
        birthday: "",
        debtCustomer: "",
      });
    }
  };

  render() {
    return (
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
          Thêm khách hàng
        </ModalHeader>
        <ModalBody>
          <div className="modal-supplier-body">
            <div className="input-container">
              <label>Tên khách hàng</label>
              <input
                type="text"
                onChange={(event) => this.handleOnChangeInput(event, "name")}
                value={this.state.name}
              ></input>
            </div>
            <div className="input-container">
              <label>Số điện thoại</label>
              <input
                type="text"
                onChange={(event) =>
                  this.handleOnChangeInput(event, "phoneNumber")
                }
                value={this.state.phoneNumber}
              ></input>
            </div>
            <div className="input-container">
              <label>Số nợ</label>
              <input
                type="text"
                onChange={(event) =>
                  this.handleOnChangeInput(event, "debtCustomer")
                }
                value={this.state.debtCustomer}
              ></input>
            </div>
            <div className="input-container">
              <label>Giới Tính</label>
              <select
                value={this.state.gender}
                onChange={(event) => this.handleOnChangeInput(event, "gender")}
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
              </select>
            </div>
            <div className="input-container">
              <label>Ngày Sinh</label>
              <input
                type="date"
                onChange={(event) =>
                  this.handleOnChangeInput(event, "birthday")
                }
                value={this.state.birthday}
              ></input>
            </div>
            <div className="input-container max-width-input">
              <label>Địa chỉ</label>
              <input
                type="text"
                onChange={(event) => this.handleOnChangeInput(event, "address")}
                value={this.state.address}
              ></input>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="px-3"
            onClick={() => {
              this.handleAddNewCustomer();
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
    );
  }
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ModelNewCustomer);
