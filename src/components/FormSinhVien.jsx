import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  themSinhVienAction,
  capNhatSinhVienAction,
  huyChinhSuaAction
} from '../redux/actions/sinhVienActions';

// Regex chuẩn kiểm tra dữ liệu
const REGEX_HO_TEN =
  /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]+$/;
const REGEX_SO_DIEN_THOAI = /^(03|05|07|08|09)[0-9]{8}$/; // SĐT Việt Nam 10 chữ số
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

export const FormSinhVien = () => {
  const dispatch = useDispatch();

  // Lấy dữ liệu từ Redux store
  const { danhSachSinhVien, selectedStudent } = useSelector(
    (state) => state.sinhVienReducer
  );

  // Local state quản lý giá trị nhập liệu và thông báo lỗi
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState(INITIAL_ERRORS);
  const [touched, setTouched] = useState({
    maSV: false,
    hoTen: false,
    soDienThoai: false,
    email: false
  });

  /**
   * Lifecycle useEffect: Lắng nghe thay đổi của selectedStudent
   * Khi người dùng click nút "Chỉnh sửa" ở Table -> selectedStudent có dữ liệu -> đổ lên form
   * Khi selectedStudent là null (sau khi cập nhật/huỷ) -> reset form về rỗng
   */
  useEffect(() => {
    if (selectedStudent) {
      setValues({
        maSV: selectedStudent.maSV,
        hoTen: selectedStudent.hoTen,
        soDienThoai: selectedStudent.soDienThoai,
        email: selectedStudent.email
      });
      setErrors(INITIAL_ERRORS);
      setTouched({
        maSV: false,
        hoTen: false,
        soDienThoai: false,
        email: false
      });
    } else {
      setValues(INITIAL_VALUES);
      setErrors(INITIAL_ERRORS);
      setTouched({
        maSV: false,
        hoTen: false,
        soDienThoai: false,
        email: false
      });
    }
  }, [selectedStudent]);

  /**
   * Hàm kiểm tra tính hợp lệ của từng trường dữ liệu
   * @param {string} name - Tên trường cần kiểm tra
   * @param {string} value - Giá trị nhập vào
   * @returns {string} - Chuỗi thông báo lỗi (nếu rỗng là hợp lệ)
   */
  const validateField = (name, value) => {
    const trimmedValue = value ? value.toString().trim() : '';

    // 1. Kiểm tra bắt buộc nhập (required)
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

    // 2. Kiểm tra theo từng định dạng cụ thể
    switch (name) {
      case 'maSV': {
        if (!REGEX_MA_SV.test(trimmedValue)) {
          return 'Mã sinh viên chỉ gồm chữ và số, không chứa khoảng trắng hay ký tự đặc biệt!';
        }
        // Khi THÊM MỚI (selectedStudent === null), kiểm tra trùng mã SV
        if (!selectedStudent) {
          const isExist = danhSachSinhVien.some(
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

  /**
   * Xử lý khi người dùng nhập dữ liệu (onChange)
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Cập nhật giá trị
    setValues((prev) => ({
      ...prev,
      [name]: value
    }));

    // Nếu trường này đã từng touched (tương tác) hoặc đang có lỗi, cập nhật validate ngay
    if (touched[name] || errors[name]) {
      const errorMsg = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: errorMsg
      }));
    }
  };

  /**
   * Xử lý khi người dùng rời khỏi ô input (onBlur)
   */
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true
    }));

    const errorMsg = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg
    }));
  };

  /**
   * Kiểm tra toàn bộ form có hợp lệ hay không
   */
  const checkFormValid = () => {
    // 1. Kiểm tra còn trường nào chưa điền không
    const isAllFilled = Object.values(values).every(
      (val) => val && val.toString().trim() !== ''
    );
    // 2. Kiểm tra có trường nào đang báo lỗi không
    const hasNoError = Object.values(errors).every((err) => err === '');

    return isAllFilled && hasNoError;
  };

  /**
   * Xử lý Submit Form (Thêm mới hoặc Cập nhật)
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Đánh dấu tất cả trường đều đã touched
    setTouched({
      maSV: true,
      hoTen: true,
      soDienThoai: true,
      email: true
    });

    // Validate lại tất cả 4 trường
    const newErrors = {
      maSV: validateField('maSV', values.maSV),
      hoTen: validateField('hoTen', values.hoTen),
      soDienThoai: validateField('soDienThoai', values.soDienThoai),
      email: validateField('email', values.email)
    };

    setErrors(newErrors);

    // Kiểm tra nếu có bất kỳ lỗi nào thì dừng lại
    const hasError = Object.values(newErrors).some((err) => err !== '');
    if (hasError) {
      return;
    }

    const payload = {
      maSV: values.maSV.trim(),
      hoTen: values.hoTen.trim(),
      soDienThoai: values.soDienThoai.trim(),
      email: values.email.trim()
    };

    if (selectedStudent) {
      // Đang ở chế độ CẬP NHẬT
      dispatch(capNhatSinhVienAction(payload));
    } else {
      // Đang ở chế độ THÊM MỚI
      dispatch(themSinhVienAction(payload));
    }

    // Reset form sau khi submit thành công
    setValues(INITIAL_VALUES);
    setErrors(INITIAL_ERRORS);
    setTouched({
      maSV: false,
      hoTen: false,
      soDienThoai: false,
      email: false
    });
  };

  /**
   * Xử lý huỷ bỏ chỉnh sửa
   */
  const handleCancelEdit = () => {
    dispatch(huyChinhSuaAction());
  };

  const isFormValid = checkFormValid();

  return (
    <div className="card shadow-sm mb-4 border-0">
      <div className="card-header bg-dark text-white py-3 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">
          <i className="fa-solid fa-user-graduate me-2 text-warning"></i>
          Thông tin sinh viên
        </h5>
        {selectedStudent && (
          <span className="badge bg-warning text-dark px-3 py-2">
            <i className="fa-solid fa-pen-to-square me-1"></i>
            Đang chỉnh sửa: SV {selectedStudent.maSV}
          </span>
        )}
      </div>

      <div className="card-body p-4 bg-white">
        <form onSubmit={handleSubmit} noValidate>
          <div className="row g-3">
            {/* Trường Mã SV */}
            <div className="col-12 col-md-6">
              <label htmlFor="maSV" className="form-label fw-semibold text-secondary">
                Mã SV <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted">
                  <i className="fa-solid fa-id-card"></i>
                </span>
                <input
                  type="text"
                  id="maSV"
                  name="maSV"
                  className={`form-control ${
                    touched.maSV
                      ? errors.maSV
                        ? 'is-invalid'
                        : 'is-valid'
                      : ''
                  }`}
                  placeholder="Nhập mã sinh viên (vd: 1, 2, SV01)..."
                  value={values.maSV}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={selectedStudent !== null} // Khóa mã SV khi chỉnh sửa
                />
              </div>
              {touched.maSV && errors.maSV && (
                <div className="text-danger small mt-1">
                  <i className="fa-solid fa-circle-exclamation me-1"></i>
                  {errors.maSV}
                </div>
              )}
              {selectedStudent && (
                <div className="text-muted small mt-1 fst-italic">
                  * Mã sinh viên là định danh duy nhất nên không thể thay đổi khi sửa.
                </div>
              )}
            </div>

            {/* Trường Họ tên */}
            <div className="col-12 col-md-6">
              <label htmlFor="hoTen" className="form-label fw-semibold text-secondary">
                Họ tên <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted">
                  <i className="fa-solid fa-user"></i>
                </span>
                <input
                  type="text"
                  id="hoTen"
                  name="hoTen"
                  className={`form-control ${
                    touched.hoTen
                      ? errors.hoTen
                        ? 'is-invalid'
                        : 'is-valid'
                      : ''
                  }`}
                  placeholder="Nhập họ và tên sinh viên..."
                  value={values.hoTen}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {touched.hoTen && errors.hoTen && (
                <div className="text-danger small mt-1">
                  <i className="fa-solid fa-circle-exclamation me-1"></i>
                  {errors.hoTen}
                </div>
              )}
            </div>

            {/* Trường Số điện thoại */}
            <div className="col-12 col-md-6">
              <label htmlFor="soDienThoai" className="form-label fw-semibold text-secondary">
                Số điện thoại <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted">
                  <i className="fa-solid fa-phone"></i>
                </span>
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
                  placeholder="Nhập số điện thoại (vd: 0938222322)..."
                  value={values.soDienThoai}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {touched.soDienThoai && errors.soDienThoai && (
                <div className="text-danger small mt-1">
                  <i className="fa-solid fa-circle-exclamation me-1"></i>
                  {errors.soDienThoai}
                </div>
              )}
            </div>

            {/* Trường Email */}
            <div className="col-12 col-md-6">
              <label htmlFor="email" className="form-label fw-semibold text-secondary">
                Email <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text bg-light text-muted">
                  <i className="fa-solid fa-envelope"></i>
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-control ${
                    touched.email
                      ? errors.email
                        ? 'is-invalid'
                        : 'is-valid'
                      : ''
                  }`}
                  placeholder="Nhập địa chỉ email (vd: nguyenvanb@gmail.com)..."
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {touched.email && errors.email && (
                <div className="text-danger small mt-1">
                  <i className="fa-solid fa-circle-exclamation me-1"></i>
                  {errors.email}
                </div>
              )}
            </div>
          </div>

          {/* Nhóm nút thao tác */}
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
                  onClick={handleCancelEdit}
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
};
