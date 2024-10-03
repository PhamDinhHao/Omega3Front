import React, { Component } from "react";
import { connect } from "react-redux";
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import { handleLoginAPI } from "../../services/userService";
import { userLoginSuccess } from "../../store/actions/userActions";
import { Button, Input, Typography } from 'antd';
import { FormattedMessage } from "react-intl";
import "./Login.scss";
import axios from 'axios';
import { editUserServicePassword, checkEmail } from "../../services/userService";
import { toast } from "react-toastify";
const { Title } = Typography;

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            isOpenOtp: false,
            isOpenChangePassword: false,
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",

        };
        this.onChange = this.onChange.bind(this);
    }

    handleOnChangeEmail = (event) => {
        this.setState({
            email: event.target.value,
        });
    };
    checkValideInput = () => {
        let isValid = true;
        let arrInput = [
            "email",
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
    handleOtp = async () => {
        let isValid = this.checkValideInput();
        if (isValid) {
            const res = await checkEmail(this.state.email);
            if (res.errCode === 0) {
                this.setState((prevState) => ({
                    isOpenOtp: !prevState.isOpenOtp,
                }));
                this.sendOtpEmail();
            }
            else {
                // toast.error("Email không tồn tại")
            }

        }

    };
    sendOtpEmail = async () => {
        try {
            const response = await axios.post("http://localhost:8080/send-otp-email", { email: this.state.email });
        } catch (error) {
            console.log("error", error)
        }
    };
    verifyOtp = async (otp) => {
        try {
            const response = await axios.post("http://localhost:8080/verify-otp", { email: this.state.email, otp });
            if (response.data.success === true) {
                this.setState({
                    isOpenChangePassword: !this.state.isOpenChangePassword
                })
            }



        } catch (error) {
            console.log("error", error)
        }
    };
    onChange = (text) => {
        this.verifyOtp(text)
    };
    handleOnChangeCurrentPassword = (e) => {
        this.setState({ currentPassword: e.target.value });
    };

    handleOnChangeNewPassword = (e) => {
        this.setState({ newPassword: e.target.value });
    };

    handleOnChangeConfirmNewPassword = (e) => {
        this.setState({ confirmNewPassword: e.target.value });
    };

    handleChangePassword = async () => {
        const { currentPassword, newPassword, confirmNewPassword } = this.state;
        if (newPassword !== confirmNewPassword) {

        } else {
            let object = {};
            object.email = this.state.email;
            object.password = confirmNewPassword;
            let res = await editUserServicePassword(object);
            if (res.errCode === 0) {
                this.setState({
                    isOpenChangePassword: false,
                    currentPassword: "",
                    newPassword: "",
                    confirmNewPassword: "",
                    email: "",
                })
                this.props.history.push("/login");

            }
        }
    };
    render() {
        const sharedProps = {
            onChange: this.onChange,
        };
        const { isOpenOtp, isOpenChangePassword, email, currentPassword, newPassword, confirmNewPassword } = this.state;
        return (
            <div className="login-background">
                <div className="login-container">
                    <div className="login-content">
                        {isOpenOtp ? (
                            isOpenChangePassword ? (
                                <div className="col-12 text-login">
                                    <div className="col-12 text-login">
                                        <Title level={5}>Đổi mật khẩu</Title>
                                    </div>
                                    <div className="col-12 form-group login-input">
                                        <Input.Password
                                            className="form-control"
                                            placeholder="Nhập mật khẩu hiện tại"
                                            value={currentPassword}
                                            onChange={this.handleOnChangeCurrentPassword}
                                        />
                                    </div>
                                    <div className="col-12 form-group login-input">
                                        <Input.Password
                                            className="form-control"
                                            placeholder="Nhập mật khẩu mới"
                                            value={newPassword}
                                            onChange={this.handleOnChangeNewPassword}
                                        />
                                    </div>
                                    <div className="col-12 form-group login-input">
                                        <Input.Password
                                            className="form-control"
                                            placeholder="Xác nhận mật khẩu mới"
                                            value={confirmNewPassword}
                                            onChange={this.handleOnChangeConfirmNewPassword}
                                        />
                                    </div>
                                    <div className="col-12 text-login">
                                        <Button type="primary" onClick={this.handleChangePassword}>
                                            Đổi mật khẩu
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="col-12 text-login">
                                    <div style={{ marginBottom: '16px' }}>
                                        <Title level={5}>Xác thực email</Title>
                                        <Input.OTP formatter={(str) => str.toUpperCase()} {...sharedProps} />
                                    </div>
                                    <div className="col-12 text-login">
                                        <Button type="primary" onClick={this.handleOtp}>
                                            <FormattedMessage id="login.back" defaultMessage="Back" />
                                        </Button>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div>
                                <div className="col-12 text-login">
                                    Vui lòng nhập email
                                </div>
                                <div className="col-12 form-group login-input">
                                    <Input
                                        type="email"
                                        className="form-control"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={this.handleOnChangeEmail}
                                    />
                                </div>
                                <div className="col-12 text-login">
                                    <Button type="primary" onClick={this.handleOtp}>
                                        Gửi mã OTP
                                    </Button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        language: state.app.language,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        navigate: (path) => dispatch(push(path)),
        userLoginSuccess: (userInfo) => dispatch(actions.userLoginSuccess(userInfo)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
