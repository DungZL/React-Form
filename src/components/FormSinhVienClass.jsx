import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  themSinhVienAction,
  capNhatSinhVienAction,
  huyChinhSuaAction
} from '../redux/actions/sinhVienActions';

// Regex chuẩn kiểm tra dữ liệu
const REGEX_HO_TEN =
  /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
const REGEX_SO_DIEN_THOAI = /^(03|05|07|08|09)[0-9]{8}$/;
const REGEX_EMAIL = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const REGEX_MA_SV = /^[0-9a-zA-Z]+$/;

const INITIAL_VALUES = {
  maSV: '',
  hoTen: '',
  soDienThoai: '',
  email: ''
};

const INITIAL_ERRORS = {
  maSV: '',
  hoTen: '',
  soDienThoai: '',
  email: ''
};

class FormSinhVienClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      values: { ...INITIAL_VALUES },
      errors: { ...INITIAL_ERRORS },
      touched: {
        maSV: false,
        hoTen: false,
        soDienThoai: false,
        email: false
      }
    };
  }

  /**
   * Lifecycle componentDidUpdate: Lắng nghe sự thay đổi của selectedStudent từ Redux props.
   * Khi props.selectedStudent thay đổi -> cập nhật state values tương ứng.
   */
  componentDidUpdate(prevProps) {
    if (prevProps.selectedStudent !== this.props.selectedStudent) {
      if (this.props.selectedStudent) {
        this.setState({
          values: { ...this.props.selectedStudent },
          errors: { ...INITIAL_ERRORS },
          touched: { maSV: false, hoTen: false, soDienThoai: false, email: false }
        });
      } else {
        this.setState({
          values: { ...INITIAL_VALUES },
          errors: { ...INITIAL_ERRORS },
          touched: { maSV: false, hoTen: false, soDienThoai: false, email: false }
        });
      }
    }
  }

  validateField = (name, value) => {
    const trimmedValue = value ? value.toString().trim() : '';

    if (!trimmedValue) {
      switch (name) {
        case 'maSV':
          return 'Mã sinh viên không được để trống!';
        case 'hoTen':
          return 'Họ tên sinh viên không được để trống!';
        case 'soDienThoai':
          return 'Số điện thoại không được để trống!';
        case 'email':
          return 'Email không được để trống!';
        default:
          return 'Trường này không được để trống!';
      }
    }

    switch (name) {
      case 'maSV': {
        if (!REGEX_MA_SV.test(trimmedValue)) {
          return 'Mã sinh viên chỉ gồm chữ và số, không khoảng trắng hay ký tự đặc biệt!';
        }
        if (!this.props.selectedStudent) {
          const isExist = this.props.danhSachSinhVien.some(
            (sv) => sv.maSV.toLowerCase() === trimmedValue.toLowerCase()
          );
          if (isExist) {
            return 'Mã sinh viên đã tồn tại trên hệ thống!';
          }
        }
        return '';
      }
      case 'hoTen': {
        if (!REGEX_HO_TEN.test(trimmedValue)) {
          return 'Họ tên phải là chữ cái và không chứa số hay ký tự đặc biệt!';
        }
        return '';
      }
      case 'soDienThoai': {
        if (!REGEX_SO_DIEN_THOAI.test(trimmedValue)) {
          return 'Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03, 05, 07, 08, 09)!';
        }
        return '';
      }
      case 'email': {
        if (!REGEX_EMAIL.test(trimmedValue)) {
          return 'Email không đúng định dạng (Ví dụ: sinhvien@gmail.com)!';
        }
        return '';
      }
      default:
        return '';
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => {
      const newValues = { ...prevState.values, [name]: value };
      const newErrors = { ...prevState.errors };

      if (prevState.touched[name] || prevState.errors[name]) {
        newErrors[name] = this.validateField(name, value);
      }

      return { values: newValues, errors: newErrors };
    });
  };

  handleBlur = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      touched: { ...prevState.touched, [name]: true },
      errors: { ...prevState.errors, [name]: this.validateField(name, value) }
    }));
  };

  checkFormValid = () => {
    const { values, errors } = this.state;
    const isAllFilled = Object.values(values).every(
      (val) => val && val.toString().trim() !== ''
    );
    const hasNoError = Object.values(errors).every((err) => err === '');
    return isAllFilled && hasNoError;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const { values } = this.state;
    const { selectedStudent, themSinhVien, capNhatSinhVien } = this.props;

    const newErrors = {
      maSV: this.validateField('maSV', values.maSV),
      hoTen: this.validateField('hoTen', values.hoTen),
      soDienThoai: this.validateField('soDienThoai', values.soDienThoai),
      email: this.validateField('email', values.email)
    };

    this.setState({
      errors: newErrors,
      touched: { maSV: true, hoTen: true, soDienThoai: true, email: true }
    });

    const hasError = Object.values(newErrors).some((err) => err !== '');
    if (hasError) return;

    const payload = {
      maSV: values.maSV.trim(),
      hoTen: values.hoTen.trim(),
      soDienThoai: values.soDienThoai.trim(),
      email: values.email.trim()
    };

    if (selectedStudent) {
      capNhatSinhVien(payload);
    } else {
      themSinhVien(payload);
    }

    this.setState({
      values: { ...INITIAL_VALUES },
      errors: { ...INITIAL_ERRORS },
      touched: { maSV: false, hoTen: false, soDienThoai: false, email: false }
    });
  };

  render() {
    const { values, errors, touched } = this.state;
    const { selectedStudent, huyChinhSua } = this.props;
    const isFormValid = this.checkFormValid();

    return (
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">
            <i className="fa-solid fa-user-graduate me-2 text-warning"></i>
            Thông tin sinh viên (Class Component Version)
          </h5>
          {selectedStudent && (
            <span className="badge bg-warning text-dark px-3 py-2">
              <i className="fa-solid fa-pen-to-square me-1"></i>
              Đang chỉnh sửa: SV {selectedStudent.maSV}
            </span>
          )}
        </div>

        <div className="card-body p-4 bg-white">
          <form onSubmit={this.handleSubmit} noValidate>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label htmlFor="maSV" className="form-label fw-semibold text-secondary">
                  Mã SV <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="maSV"
                  name="maSV"
                  className={`form-control ${
                    touched.maSV ? (errors.maSV ? 'is-invalid' : 'is-valid') : ''
                  }`}
                  placeholder="Nhập mã sinh viên..."
                  value={values.maSV}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                  disabled={selectedStudent !== null}
                />
                {touched.maSV && errors.maSV && (
                  <div className="text-danger small mt-1">{errors.maSV}</div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="hoTen" className="form-label fw-semibold text-secondary">
                  Họ tên <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="hoTen"
                  name="hoTen"
                  className={`form-control ${
                    touched.hoTen ? (errors.hoTen ? 'is-invalid' : 'is-valid') : ''
                  }`}
                  placeholder="Nhập họ và tên sinh viên..."
                  value={values.hoTen}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                />
                {touched.hoTen && errors.hoTen && (
                  <div className="text-danger small mt-1">{errors.hoTen}</div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="soDienThoai" className="form-label fw-semibold text-secondary">
                  Số điện thoại <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="soDienThoai"
                  name="soDienThoai"
                  className={`form-control ${
                    touched.soDienThoai
                      ? errors.soDienThoai
                        ? 'is-invalid'
                        : 'is-valid'
                      : ''
                  }`}
                  placeholder="Nhập số điện thoại..."
                  value={values.soDienThoai}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                />
                {touched.soDienThoai && errors.soDienThoai && (
                  <div className="text-danger small mt-1">{errors.soDienThoai}</div>
                )}
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="email" className="form-label fw-semibold text-secondary">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${
                    touched.email ? (errors.email ? 'is-invalid' : 'is-valid') : ''
                  }`}
                  placeholder="Nhập địa chỉ email..."
                  value={values.email}
                  onChange={this.handleChange}
                  onBlur={this.handleBlur}
                />
                {touched.email && errors.email && (
                  <div className="text-danger small mt-1">{errors.email}</div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-2 d-flex gap-2">
              {selectedStudent ? (
                <>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-semibold"
                    disabled={!isFormValid}
                  >
                    <i className="fa-solid fa-floppy-disk me-2"></i>
                    Cập nhật sinh viên
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary px-4"
                    onClick={huyChinhSua}
                  >
                    <i className="fa-solid fa-xmark me-2"></i>
                    Hủy bỏ
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="btn btn-success px-4 fw-semibold"
                  disabled={!isFormValid}
                >
                  <i className="fa-solid fa-user-plus me-2"></i>
                  Thêm sinh viên
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  danhSachSinhVien: state.sinhVienReducer.danhSachSinhVien,
  selectedStudent: state.sinhVienReducer.selectedStudent
});

const mapDispatchToProps = {
  themSinhVien: themSinhVienAction,
  capNhatSinhVien: capNhatSinhVienAction,
  huyChinhSua: huyChinhSuaAction
};

export default connect(mapStateToProps, mapDispatchToProps)(FormSinhVienClass);
