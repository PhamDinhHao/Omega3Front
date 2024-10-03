
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

import { connect } from 'react-redux';
import { Button, Modal } from 'reactstrap';

import { ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { emitter } from "../../../utils/emitter";





class ModelNewSupplier extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: "",



        }
        this.listenToEmitter();

    }
    listenToEmitter() {
        emitter.on('EVENT_CLEAR_MODAL_DATA', () => {
            this.setState({
                name: "",

            })
        })
    }
    componentDidMount() {


    }
    toggle = () => {
        this.props.toggleFromParent();
    }
    handleOnChangeInput = (event, id) => {
        let copyState = { ...this.state };
        copyState[id] = event.target.value;
        this.setState({
            ...copyState
        });
    }
    checkValideInput = () => {
        let isValid = true;
        let arrInput = ['name'];
        for (let i = 0; i < arrInput.length; i++) {
            if (!this.state[arrInput[i]]) {
                isValid = false;
                alert('Missing parameter: ' + arrInput[i]);
                break;
            }
        }
        return isValid;
    }
    handleAddNewSupplier = () => {
        let isValid = this.checkValideInput();
        if (isValid == true) {
            //call apicreat modal
            this.props.createNewCategory(this.state);

        }
    }



    render() {

        return (

            <Modal
                isOpen={this.props.isOpen}
                toggle={() => { this.toggle() }}
                className={"model-supplier-container"}
                size='lg'
                centered>
                <ModalHeader toggle={() => { this.toggle() }} >
                    Thêm loại hàng
                </ModalHeader>
                <ModalBody>
                    <div className='modal-supplier-body'>
                        <div className='input-container'>
                            <label>Tên loại hàng</label>
                            <input type='text'
                                onChange={(event) => this.handleOnChangeInput(event, "name")}
                                value={this.state.name}></input>
                        </div>

                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button color="primary" className='px-3' onClick={() => { this.handleAddNewSupplier() }} >
                        Thêm mới
                    </Button>{' '}
                    <Button color="secondary" className='px-3' onClick={() => { this.toggle() }} >
                        Đóng
                    </Button>

                </ModalFooter>
            </Modal>




        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ModelNewSupplier);
