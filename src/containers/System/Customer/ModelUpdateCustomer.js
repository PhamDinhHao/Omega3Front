import React, { Component } from "react";
import { FormattedMessage } from "react-intl";

import { connect } from "react-redux";
import { Button, Modal } from "reactstrap";

import { ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { emitter } from "../../../utils/emitter";
import _, { isEmpty } from "lodash";

class ModelUpdateCustomer extends Component {
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

  componentDidMount() {
    let customer = this.props.currentCustomer;
    if (customer && !isEmpty(customer)) {
      this.setState({
        id: customer.id,
        name: customer.name,
        phoneNumber: customer.phoneNumber,
        gender: customer.gender,
        birthday: customer.birthday,
        debtCustomer: customer.debtCustomer,
        address: customer.address,
      });
    }
  }

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

  handleUpdateCustomer = () => {
    let isValid = this.checkValideInput();
    if (isValid == true) {
      //call apicreat modal
      this.props.editCustomer(this.state);
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
          Cập nhật khách hàng
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
              <input
                type="text"
                onChange={(event) => this.handleOnChangeInput(event, "gender")}
                value={this.state.gender}
              ></input>
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
              this.handleUpdateCustomer();
            }}
          >
            Lưu
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ModelUpdateCustomer);
