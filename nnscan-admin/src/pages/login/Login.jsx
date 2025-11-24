import React, { useState } from "react";
import { ethers } from "ethers";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast, { Toaster } from "react-hot-toast";
import { adminLogin, ledgerlogin, ledgerloginverify } from "../../uitils/action";
// import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState("email");
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await adminLogin({
          email: values.email,
          password: values.password,
        });

        if (res.success === true) {
          toast.success("Login successful!");
          localStorage.setItem("token", res.data.token);

          setTimeout(() => {
            navigate("/dashboard");
          }, 1500);
        } else {
          toast.error(res.message || "Login failed");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        console.error(error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // const handleLedgerLogin = async () => {
  //   try {
  //     toast.loading("Connecting to Ledger...");
  //     setTimeout(() => {
  //       toast.dismiss();
  //       toast.success("Ledger connected successfully!");
  //       navigate("/home");
  //     }, 1500);
  //   } catch (err) {
  //     toast.error("Ledger connection failed");
  //   }
  // };

  const handleLedgerLogin = async () => {
    try {
      toast.loading("Connecting to Ledger...");
      const testPrivateKey =
        "0x59c6995e998f97a5a0044966f094538b292b5bda3c11d02cc9812cdb6a428b8a";
      const wallet = new ethers.Wallet(testPrivateKey);
      const ledgerAddress = wallet.address;

      console.log("Ledger address (simulated):", ledgerAddress);
      const nonceRes = await ledgerlogin({ address: ledgerAddress })
      console.log(nonceRes, "nonceRes")
      const nonceMessage = nonceRes.message;
      const signature = await wallet.signMessage(nonceMessage);
      const verifyRes = await ledgerloginverify({
        address: ledgerAddress,
        signature,
      })
      console.log(verifyRes, "verifyRes")
      toast.dismiss();
      if (verifyRes.success) {
        toast.success("Ledger login successful!");
        localStorage.setItem("token", verifyRes.token);
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        toast.error("Ledger verification failed");
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Ledger connection failed");
      console.error(error);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      <div
        className="d-flex justify-content-center flex-column gap-3 align-items-center w-100"
        style={{ height: "100vh", width: "100vw" }}
      >
        <img
          src="assets/images/logo/logo1.svg"
          alt="nnscan logo"
          className="w-32"
        />

        <div>
          <h3>Admin Panel</h3>
        </div>

        {/* 🔘 Radio selection for login method */}
        <div className="d-flex gap-3 align-items-center mb-3">
          {/* <Form.Check
            type="radio"
            label="Login with Password"
            name="loginMethod"
            value="email"
            checked={loginMethod === "email"}
            onChange={(e) => setLoginMethod(e.target.value)}
          /> */}
          {/* <Form.Check
            type="radio"
            label="Login with Ledger"
            name="loginMethod"
            value="ledger"
            checked={loginMethod === "ledger"}
            onChange={(e) => setLoginMethod(e.target.value)}
          /> */}
          <div>Login with Password</div>
        </div>

        <div
          className="align-content-center p-4 rounded-3"
          style={{ backgroundColor: "#ffc65542", minWidth: "320px" }}
        >
          {loginMethod === "email" ? (
            // 📧 Email login form
            <Form onSubmit={formik.handleSubmit}>
              {/* Email Field */}
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={formik.touched.email && !!formik.errors.email}
                />
                {formik.touched.email && formik.errors.email && (
                  <div className="text-danger small mt-1">
                    {formik.errors.email}
                  </div>
                )}
              </Form.Group>

              {/* Password Field */}
              <Form.Group className="mb-3" controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <div className="d-flex align-items-center">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      formik.touched.password && !!formik.errors.password
                    }
                  />
                  <Button
                    variant="light"
                    className="ms-2"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-danger small mt-1">
                    {formik.errors.password}
                  </div>
                )}
              </Form.Group>

              {/* Submit Button */}
              <div className="d-flex justify-content-end">
                <Button
                  type="submit"
                  variant="primary"
                   className="w-100 custom-color 
                   "
                   style={{border:"none"}}
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Loading..." : "Login"}
                </Button>
              </div>
            </Form>
          ) : (
            // 🔐 Ledger login section
            <div className="text-center d-flex flex-column align-items-center">
              <img
                src="assets/images/logo/ledger.png"
                className="img-fluid mb-3"
                style={{ height: 60 }}
                alt="Ledger"
              />
              <Button variant="primary" className="custom-color" style={{border:"none"}} onClick={handleLedgerLogin}>
                Connect with Ledger
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Login;

